from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from recommender import get_recommender

app = FastAPI(title="Fashion Recommender API")

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class RecommendRequest(BaseModel):
    image_url: str
    top_k: Optional[int] = 5

class RecommendResponse(BaseModel):
    success: bool
    recommendations: List[dict]
    message: Optional[str] = None

# Initialize recommender on startup
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("Starting Fashion Recommender Service...")
    print("="*50)
    try:
        get_recommender()
        print("="*50)
        print("✓ Service ready! Listening on http://0.0.0.0:8001")
        print("="*50 + "\n")
    except Exception as e:
        print(f"\n❌ Failed to initialize recommender: {str(e)}\n")
        raise

@app.get("/")
async def root():
    return {
        "message": "Fashion Recommender API is running",
        "status": "ok",
        "endpoints": {
            "health": "/health",
            "recommend": "/recommend (POST)"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        recommender = get_recommender()
        return {
            "status": "healthy",
            "embeddings_loaded": recommender.feature_list is not None,
            "num_embeddings": len(recommender.feature_list) if recommender.feature_list is not None else 0,
            "num_filenames": len(recommender.filenames) if recommender.filenames is not None else 0
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    """
    Get fashion recommendations based on an image URL
    
    Request body:
    {
        "image_url": "http://localhost:4000/images/item_image.png",
        "top_k": 5
    }
    """
    try:
        if not request.image_url:
            raise HTTPException(status_code=400, detail="image_url is required")
        
        recommender = get_recommender()
        
        # Get recommendations
        recommendations = recommender.recommend(request.image_url, top_k=request.top_k)
        
        return RecommendResponse(
            success=True,
            recommendations=recommendations,
            message=f"Found {len(recommendations)} recommendations"
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


