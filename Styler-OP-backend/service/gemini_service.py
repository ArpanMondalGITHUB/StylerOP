import os
from PIL import Image
from google import genai
from google.genai import types
from models.images import StyleType
from dotenv import load_dotenv

load_dotenv()
STYLE_PROMPTS = {
    StyleType.GHIBLI: "Transform this image into Studio Ghibli anime style with soft colors, whimsical atmosphere, and hand-drawn aesthetic like Spirited Away or Howl's Moving Castle",
    StyleType.ILLUSTRATION: "Generate a hand-drawn portrait illustration in red and yellow pen on notebook paper, inspired by doodle art and comic annotations. Keep full likeness of the subject, expressive lines, spontaneous gestures, bold outline glow, handwritten notes around, realistic pen stroke texture, 4K resolution",
    StyleType.CSK: "Digital vector illustration of this image, showing keep silence by right hand first finger in his lips, wearing a chennai super kings cricket jersey. Art style involves bold thick black outlines, heavy cel-shading, and comic book pop-art aesthetics. Background includes a yellow sunburst pattern with halftone Ben-Day dots. Vibrant high-contrast colors, energetic sports poster vibe, GTA loading screen style. No text, no typography",
    StyleType.PIXAR: "Transform this image into Pixar 3D animation style with smooth textures, expressive features, and cinematic lighting",
    StyleType.ANIME: "Transform this image into Japanese anime style with distinctive eyes, stylized features, and vibrant anime aesthetics",
}
aspect_ratio = "5:4" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
resolution = "2K" # "1K", "2K", "4K"

client = genai.Client(api_key=os.getenv("Generative_Language_API_Key"))

async def transform_image_with_gemini(image:Image.Image, style:StyleType)-> Image.Image:
    
    try:
       prompt = STYLE_PROMPTS.get(style)
       if not prompt:
          raise ValueError(f"Unknown style: {style}")
       
       response = client.models.generate_content(
       model="gemini-3-pro-image-preview",
       contents=[prompt,image],
       config=types.GenerateContentConfig(
          response_modalities=['IMAGE'],
          image_config=types.ImageConfig(
             aspect_ratio=aspect_ratio,
             image_size=resolution
            ),
        )
        )
       
       transformed_image = None
       for part in response.parts:
           if image_part := part.as_image():
              if hasattr(image_part, '_pil_image'):
                 transformed_image = image_part._pil_image
              elif isinstance(image_part, Image.Image):
                 transformed_image = image_part
              else:
                 transformed_image = image_part
              break
        
        # Check if image was generated
       if transformed_image is None:
          raise Exception("No image generated in Gemini response")
       
       if not isinstance(transformed_image, Image.Image):
          raise Exception(f"Expected PIL Image, got {type(transformed_image)}")
        
       return transformed_image
    except Exception as e:
        raise Exception(f"Failed to transform image with Gemini: {str(e)}")