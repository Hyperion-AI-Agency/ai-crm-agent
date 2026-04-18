# Testing

## Overview

The backend test suite lives in `apps/api/__tests__/` and uses **pytest**.

The config is in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
addopts = "-v --tb=short -m 'not eval and not benchmark'"
```

## Running Tests

```bash
# All tests (default — fast, no external deps)
poetry run pytest

# Single test file
poetry run pytest __tests__/core/test_crud.py -v

# Single test class
poetry run pytest __tests__/core/test_crud.py::TestBaseCrudCreate -v

# Verbose with output
poetry run pytest -v -s
```

## Directory Structure

```
apps/api/__tests__/
├── conftest.py          # Shared fixtures (app, client, mock_session)
├── helpers.py           # Mock utilities (fake_db_obj, mock_scalars_result, etc.)
└── core/                # Core CRUD and route tests
    ├── test_crud.py     # BaseCrud unit tests (using Item model)
    └── test_routes.py   # Health check and root endpoint tests
```

## Fixtures

Defined in `__tests__/conftest.py`:

| Fixture | Description |
|---------|-------------|
| `app_core_only` | Minimal FastAPI app with only core routes (no DB/lifespan) |
| `client` | Test client for the core-only app |
| `app` | Full application instance with all routers |
| `authed_client` | Test client with auth dependency overridden to return fake user |
| `mock_session` | Mocked AsyncSession with standard DB operations stubbed |

## Unit Tests

Unit tests mock all external dependencies (DB, APIs) and run instantly. They verify CRUD operations, schema validation, and route behavior.

**Key helpers** (`__tests__/helpers.py`):

| Helper | Purpose |
|--------|---------|
| `fake_db_obj(**attrs)` | Creates a MagicMock with given attributes |
| `mock_scalars_result(items, session=)` | Mocks `session.execute → .scalars().all()` |
| `mock_scalar_count(value, session=)` | Mocks scalar count queries |
| `mock_paginated_result(items, total, session=)` | Mocks paginated queries (count + select) |

### CRUD Unit Test Example

```python
# __tests__/core/test_crud.py
class TestBaseCrudCreate:
    """Verify BaseCrud.create persists a new record and returns the model instance."""

    @pytest.mark.asyncio
    async def test_create_returns_model_instance(self, mock_session: AsyncMock):
        """Creating a record should return an Item instance and call save."""
        crud = BaseCrud(session=mock_session, model=Item)
        schema = FakeCreate(title="Test Item")

        with patch("api.core.crud.save", new_callable=AsyncMock) as mock_save:
            result = await crud.create(schema)

        assert isinstance(result, Item)
        mock_save.assert_awaited_once()
```

## DRY Route Protection Tests

Use `@pytest.mark.parametrize` with route lists to verify auth guards across all endpoints. This ensures new routes are tested for auth without writing individual test functions:

```python
PROTECTED_ROUTES = [
    ("GET", "/api/v1/items/"),
    ("POST", "/api/v1/items/"),
    ("DELETE", "/api/v1/items/{id}"),
]

PUBLIC_ROUTES = [
    ("GET", "/api/v1/health"),
]

@pytest.mark.parametrize("method,path", PROTECTED_ROUTES)
@pytest.mark.asyncio
async def test_protected_route_returns_401_without_auth(client, method, path):
    response = await client.request(method, path)
    assert response.status_code == 401
```

When adding a new route, add it to the appropriate list. The parametrized test will automatically cover it.

## E2E Tests (Playwright)

E2E tests live in `apps/nextjs/e2e/` and use Playwright.

```bash
pnpm test:e2e           # Run all E2E tests
pnpm test:e2e:debug     # Debug mode with browser visible
```

### API Mocking with `page.route`

Mock API responses to run E2E tests without a backend:

```typescript
test('shows dashboard when authenticated', async ({ page }) => {
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'test@example.com' }),
    }),
  );
  await page.goto('/dashboard');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

!!! warning "Run Playwright from the app directory"
    Always run Playwright from the app directory (e.g., `apps/nextjs/`), not the monorepo root. The `baseURL` in `playwright.config.ts` is relative to the app directory.

## Adding Tests

### For a new backend module:

1. Add unit tests to `apps/api/__tests__/{module}/`
2. Test CRUD operations with mocked DB sessions
3. Test route handlers with test client
4. Add routes to `PROTECTED_ROUTES` or `PUBLIC_ROUTES` for auth coverage
5. Run `poetry run pytest` to verify
