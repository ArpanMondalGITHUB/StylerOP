import base64
from datetime import datetime, timezone
import io
from fastapi import FastAPI, Form , UploadFile , File , APIRouter , HTTPException , status
from typing import Annotated
from models.images import StyleType, StyledImageResponse
from PIL import Image
from service.gemini_service import transform_image_with_gemini
router = APIRouter(prefix='/images/v1',tags=["images"])

@router.post('/transform-images', response_model=StyledImageResponse)
async def transform_image(
  file: Annotated[UploadFile, File(description="Image file to transform")],
  style:Annotated[StyleType , Form(description="Style to apply")]
  ):
    
    """Upload and styled an Image using AI"""
    
    # Validate file type

    allowed_type = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_type)}"
        )

    contents = await file.read()

    max_size = 5 * 1024 * 1024  # 5MB in bytes
    if len(contents) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 5MB"
        )
    
    try:
      Image.open(io.BytesIO(contents)).verify()
      img = Image.open(io.BytesIO(contents))
      if img.mode == 'RGBA':
        rgb_img = Image.new('RGB', img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[3])
        img = rgb_img
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image file"
        )
    
    # 5. Upload original to Google Cloud Storage
    # WHY: Don't store files on server, use scalable cloud
    # try:
    #     original_url = await storage_service.upload_image(
    #         file_content=contents,
    #         filename=file.filename,
    #         user_id=str(current_user.id),
    #         folder="originals"
    #     )
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Failed to upload image: {str(e)}"
    #     )

    try:
      transformed_image = await transform_image_with_gemini(image=img , style=style)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image transformation failed: {str(e)}"
        )
    try:
        # Convert Gemini's image object to PIL Image if needed
       if not isinstance(transformed_image, Image.Image):
        # Gemini's image object should have a method to get PIL Image
        # Try common methods:
        if hasattr(transformed_image, '_pil_image'):
            pil_img = transformed_image._pil_image
        elif hasattr(transformed_image, 'to_pil'):
            pil_img = transformed_image.to_pil()
        elif hasattr(transformed_image, 'as_pil'):
            pil_img = transformed_image.as_pil()
        else:
            # If it's already bytes, load it
            if isinstance(transformed_image, bytes):
                pil_img = Image.open(io.BytesIO(transformed_image))
            else:
                raise Exception(f"Unknown image type: {type(transformed_image)}")
       else:
          pil_img = transformed_image
        
       
       output = io.BytesIO()
       transformed_image.save(output,format='PNG')
       output.seek(0) 
       img_bytes = output.getvalue()
       img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    except Exception as e:
       raise HTTPException(
          status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
          detail=f"Failed to process transformed image: {str(e)}"
        )
    

    return StyledImageResponse(
       transformed_image=f"data:image/png;base64,{img_base64}",
       original_filename=file.filename,
       style=style,
       created_at=datetime.now(timezone.utc),
    #    transformations_remaining=None
    )