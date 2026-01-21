from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class StyleType(str, Enum):
    """Available image transformation styles"""
    GHIBLI = "ghibli"
    ILLUSTRATION = "illustration"
    CSK = "csk"
    PIXAR = "pixar"
    ANIME = "anime"


class StyledImageResponse(BaseModel):
    """Response model for image transformation"""
    transformed_image: str = Field(description="Base64 data URI of transformed image")  # Base64 encoded image with data URI
    original_filename: str = Field(description="Name of uploaded file")
    style: StyleType = Field(description="Applied transformation style")
    created_at: datetime = Field(  # ⭐ Use datetime, not str
        default_factory=datetime.utcnow,
        description="Transformation timestamp"
    )
    transformations_remaining: Optional[int] = Field(
        default=None,  # Free tier gets 5
        description="Remaining image transformations"
    )  # For subscription tracking


    class Config:
        json_schema_extra = {
            "example": {
                "transformed_image": "data:image/png;base64,iVBORw0KG...",
                "original_filename": "photo.jpg",
                "style": "ghibli",
                "created_at": "2024-01-17T10:30:00",
                "transformations_remaining":"null"
            }
        }