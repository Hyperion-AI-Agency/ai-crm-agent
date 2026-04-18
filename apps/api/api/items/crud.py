"""Item CRUD operations — example BaseCrud subclass for the template."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy import func, select

from api.core.crud import BaseCrud
from api.core.schemas import PageResponse
from api.deps.db import SessionDep
from api.items.models.item import Item
from api.items.schemas import ItemCreate, ItemUpdate


class ItemCrud(BaseCrud[Item, ItemCreate, ItemUpdate]):
    def __init__(self, session: SessionDep) -> None:
        super().__init__(session, Item)

    async def get_by_user_id(
        self, user_id: str, page: int = 1, page_size: int = 50
    ) -> PageResponse:
        """Get items for a specific user with pagination."""
        count_stmt = select(func.count()).select_from(Item).where(Item.user_id == user_id)
        count_result = await self.db_session.execute(count_stmt)
        total = count_result.scalar_one() or 0

        offset = (page - 1) * page_size
        statement = (
            select(Item)
            .where(Item.user_id == user_id)
            .offset(offset)
            .limit(page_size)
            .order_by(Item.created_at.desc())
        )
        result = await self.db_session.execute(statement)
        items = list(result.scalars().all())
        return PageResponse.create(items=items, total=total, page=page, page_size=page_size)


ItemCrudDep = Annotated[ItemCrud, Depends()]
