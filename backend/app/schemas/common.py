from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Timestamped(BaseModel):
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

