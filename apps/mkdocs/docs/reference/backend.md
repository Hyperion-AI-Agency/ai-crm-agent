# Backend Reference — FastAPI

## Quick Navigation

| Area | Path |
|------|------|
| App factory | `apps/api/api/app.py` |
| Uvicorn entry point | `apps/api/api/main.py` |
| Settings | `apps/api/api/settings.py` |
| Items module (example) | `apps/api/api/items/` |
| Dependencies (auth, db) | `apps/api/api/deps/` |
| Sentry integration | `apps/api/api/deps/sentry.py` |
| Celery config + worker | `apps/api/api/deps/celery.py` |
| Celery tasks | `apps/api/api/deps/tasks.py` |
| Core (health, base models, CRUD) | `apps/api/api/core/` |
| Migrations | `apps/api/migrations/versions/` |
| Tests | `apps/api/__tests__/` |

## Project Layout

```
apps/api/
├── api/              # FastAPI HTTP server (routes, modules, deps)
│   ├── core/         # Base models, CRUD, health routes, shared schemas
│   ├── items/        # Example domain module (models, routes, schemas, crud)
│   └── deps/         # Shared dependencies (db, auth, celery, sentry)
├── __tests__/        # pytest tests
├── migrations/       # Alembic migrations
└── pyproject.toml    # Poetry config + CLI scripts
```

## App Factory Pattern

```python
# api/app.py
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup: init Sentry."""
    init_sentry()
    yield

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        docs_url=settings.docs_url,
        openapi_url=settings.openapi_url,
        lifespan=lifespan,
    )
    app.add_middleware(CORSMiddleware, ...)
    app.include_router(core_router)
    app.include_router(items_router, prefix="/api/v1")
    return app
```

!!! danger "CORS + Credentials gotcha"
    `allow_origins=["*"]` with `allow_credentials=True` is **invalid per the CORS spec**. Browsers silently reject cookies. Always use explicit origin lists when credentials are enabled. See [Tech Decisions > Gotchas](../tech-decisions.md#cors-credentials) for details.

## Module Pattern

Every domain module under `api/` follows this structure:

```
module_name/
├── routes.py           # FastAPI router (delegates to crud)
├── models/             # SQLAlchemy models
├── schemas.py          # Pydantic request/response schemas
├── crud.py             # CRUD dependency classes (extend BaseCrud)
└── __init__.py
```

**Current modules:** `items/`, `core/`, `deps/`

## Where to Put New Code

| You need... | Put it in... |
|-------------|-------------|
| A new API endpoint | `api/{module}/routes.py` → register in `api/app.py` |
| A new database table | `api/{module}/models/` → generate Alembic migration |
| Request/response types | `api/{module}/schemas.py` |
| Database queries | `api/{module}/crud.py` (extend `BaseCrud`) |
| A shared dependency | `api/deps/` |
| A new Celery task | `api/deps/tasks.py` |
| A test | `__tests__/{module}/test_{name}.py` |

---

## Core Patterns

### Base Model (SQLAlchemy)

All models inherit `created_at` and `updated_at` from `BaseModel`:

```python
# api/core/models.py
class BaseModel(DeclarativeBase):
    __abstract__ = True

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        default=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=False),
        default=lambda: datetime.now(UTC).replace(tzinfo=None),
        onupdate=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=True,
    )
```

### SQLAlchemy Model Pattern

```python
# api/items/models/item.py
class Item(BaseModel):
    __tablename__ = "items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    # ... created_at and updated_at inherited from BaseModel
```

**Conventions:** UUID primary keys, timestamps inherited from BaseModel (UTC, no tzinfo), snake_case table and column names, indexed foreign keys.

### Typed Dependencies

All dependencies use the `Annotated[..., Depends(...)]` pattern:

```python
# Define typed dependency alias
SessionDep = Annotated[AsyncSession, Depends(get_db)]
AuthenticatedUserDep = Annotated[User, Depends(get_user)]
ItemCrudDep = Annotated[ItemCrud, Depends()]

# Use in route handlers
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: uuid.UUID, crud: ItemCrudDep, current_user: AuthenticatedUserDep):
    item = await crud.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemResponse.model_validate(item)
```

### Database Session

```python
# api/deps/db.py
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        try:
            yield session
        finally:
            await session.close()

async def save(session: AsyncSession, db_object: object) -> None:
    """Add, commit, and refresh a database object."""
    session.add(db_object)
    await session.commit()
    await session.refresh(db_object)

SessionDep = Annotated[AsyncSession, Depends(get_db)]
```

### Base CRUD (Generic)

All CRUD classes extend `BaseCrud` with typed generics:

```python
# api/core/crud.py
class BaseCrud(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, session: SessionDep, model: type[ModelType]):
        self.db_session = session
        self.model = model

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        obj_data = obj_in.model_dump(exclude_unset=True)
        db_obj = self.model(**obj_data)
        await save(self.db_session, db_obj)
        return db_obj

    async def get(self, id: UUID) -> ModelType | None: ...
    async def get_multi(self, page: int = 1, page_size: int = 50) -> PageResponse: ...
    async def update(self, id: UUID, obj_in: UpdateSchemaType) -> ModelType | None: ...
    async def delete(self, id: UUID) -> bool: ...
    async def count(self) -> int: ...
    async def exists(self, id: UUID) -> bool: ...
```

### Pagination (PageResponse)

```python
# api/core/schemas.py
class PageResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: list[T]
    page: int
    page_size: int
    total: int
    total_pages: int

    @classmethod
    def create(cls, items, total, page, page_size) -> "PageResponse[T]":
        return cls(
            items=items, page=page, page_size=page_size,
            total=total,
            total_pages=math.ceil(total / page_size) if page_size > 0 else 0,
        )
```

### CRUD Subclass Pattern

```python
# api/items/crud.py
class ItemCrud(BaseCrud[Item, ItemCreate, ItemUpdate]):
    def __init__(self, session: SessionDep) -> None:
        super().__init__(session=session, model=Item)

    async def get_by_user_id(self, user_id: str, page: int = 1, page_size: int = 50) -> PageResponse:
        """Get items for a specific user with pagination."""
        ...

# Typed dependency — inject directly into route handlers
ItemCrudDep = Annotated[ItemCrud, Depends()]
```

### Route Pattern

```python
# api/items/routes.py
router = APIRouter(prefix="/items", tags=["items"], dependencies=[Depends(get_user)])

@router.get("/", response_model=PageResponse[ItemResponse])
async def list_items(crud: ItemCrudDep, current_user: AuthenticatedUserDep, page: int = 1, page_size: int = 50):
    return await crud.get_by_user_id(current_user.id, page=page, page_size=page_size)

@router.post("/", response_model=ItemResponse, status_code=201)
async def create_item(body: ItemCreate, crud: ItemCrudDep, current_user: AuthenticatedUserDep):
    ...
```

### Exception Handling

```python
# api/exceptions.py — global exception handlers registered in app factory
# Handlers for: HTTPException, RequestValidationError, Exception (catch-all)
# All responses use ErrorResponse schema: { status: "error", message: str, detail?: Any }
```

---

## Background Processing (Celery)

```python
# api/deps/celery.py — Celery app config + worker entry point
celery_app = Celery("worker")
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    task_track_started=True,
    task_time_limit=1800,       # 30 min hard limit
    task_soft_time_limit=1500,  # 25 min soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    result_expires=3600,
)

def main() -> None:
    """Run Celery worker."""
    celery_app.worker_main(argv=["worker", "--loglevel=info", "--concurrency=4", "--pool=solo", "--events"])

# api/deps/tasks.py
@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def my_background_task(self, **kwargs) -> None:
    try:
        asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
```

---

## Registered Routes

| Router | Prefix | Tags | Source |
|--------|--------|------|--------|
| `core_router` | `/` | core | `api/core/routes.py` — health check, root |
| `items_router` | `/api/v1/items` | items | `api/items/routes.py` |

## Settings

Configured via Pydantic `BaseSettings` in `api/settings.py` with `API_` prefix:

| Category | Variables |
|----------|-----------|
| Core | `API_PROJECT_NAME`, `API_SECRET_KEY`, `API_ENVIRONMENT` (local/staging/production) |
| Database | `API_DATABASE_URL` (postgresql+asyncpg) |
| Server | `API_SERVER_HOST`, `API_SERVER_PORT`, `API_SERVER_LOG_LEVEL`, `API_SWAGGER_HIDE` |
| OAuth | `API_OAUTH_PROVIDER_URL`, `API_OAUTH_CLIENT_ID`, `API_OAUTH_CLIENT_SECRET` |
| Celery | `API_CELERY_BROKER_URL`, `API_CELERY_RESULT_BACKEND` (Redis) |
| Sentry | `API_SENTRY_DSN`, `API_SENTRY_TRACES_SAMPLE_RATE`, `API_SENTRY_PROFILES_SAMPLE_RATE` |

## Naming Conventions

| Entity | Pattern | Example |
|--------|---------|---------|
| Dependency alias | `XyzDep = Annotated[Xyz, Depends()]` | `ItemCrudDep`, `SessionDep` |
| CRUD class | `{Model}Crud` | `ItemCrud` |
| Read schema | `{Model}Response` | `ItemResponse` |
| Create/Update schema | `{Model}Create` / `{Model}Update` | `ItemCreate`, `ItemUpdate` |
| Router variable | `router` | Included via `app.include_router(router)` |
| Table name | snake_case | `items` |

## Key Libraries

| Library | Purpose | Used In |
|---------|---------|---------|
| FastAPI | HTTP framework | `api/` |
| SQLAlchemy 2.0 | Async ORM | `api/*/models/` |
| Pydantic | Schema validation | `api/*/schemas.py` |
| Alembic | DB migrations | `migrations/` |
| Celery | Task queue | `api/deps/celery.py` |
| Redis | Broker + result backend | `api/deps/celery.py` |
| Sentry SDK | Error tracking | `api/deps/sentry.py` |

## Running

| Command | Purpose |
|---------|---------|
| `poetry run start` | Start uvicorn server |
| `poetry run pytest` | Run tests |
| `poetry run pytest -v -s` | Run tests (verbose with output) |
| `poetry run celery-worker` | Start Celery worker |
| `poetry run alembic upgrade head` | Apply migrations |
| `poetry run alembic revision --autogenerate -m "msg"` | Generate migration |
