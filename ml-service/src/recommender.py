import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
try:
    from tensorflow.keras.utils import load_img, img_to_array
except ImportError:
    # Fallback for older TensorFlow versions
    from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from numpy.linalg import norm
import pickle
import os
from sklearn.neighbors import NearestNeighbors
from PIL import Image
import requests
from io import BytesIO

# Get the base directory (ml-service folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Pickle files are directly in ml-service folder
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "embeddings.pkl")
FILENAMES_PATH = os.path.join(BASE_DIR, "filenames.pkl")

class FashionRecommender:
    def __init__(self):
        self.model = None
        self.feature_list = None
        self.filenames = None
        self.neighbors = None
        self._load_model()
        self._load_embeddings()
        
    def _load_model(self):
        """Load the ResNet50 model"""
        print("Loading ResNet50 model...")
        base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = False
        
        self.model = keras.Sequential([
            base_model,
            GlobalMaxPooling2D()
        ])
        print("✓ Model loaded successfully!")
        
    def _load_embeddings(self):
        """Load embeddings and filenames from pickle files"""
        try:
            # Check if files exist
            if not os.path.exists(EMBEDDINGS_PATH):
                error_msg = f"\n❌ ERROR: embeddings.pkl not found at {EMBEDDINGS_PATH}\n"
                error_msg += f"Please place your embeddings.pkl file in: {BASE_DIR}\n"
                raise FileNotFoundError(error_msg)
                
            if not os.path.exists(FILENAMES_PATH):
                error_msg = f"\n❌ ERROR: filenames.pkl not found at {FILENAMES_PATH}\n"
                error_msg += f"Please place your filenames.pkl file in: {BASE_DIR}\n"
                raise FileNotFoundError(error_msg)
                
            print(f"Loading embeddings from {EMBEDDINGS_PATH}...")
            with open(EMBEDDINGS_PATH, 'rb') as f:
                loaded_data = pickle.load(f)
                # Handle both list and numpy array formats
                if isinstance(loaded_data, np.ndarray):
                    self.feature_list = loaded_data
                else:
                    self.feature_list = np.array(loaded_data)
            
            print(f"Loading filenames from {FILENAMES_PATH}...")
            with open(FILENAMES_PATH, 'rb') as f:
                self.filenames = pickle.load(f)
            
            print(f"✓ Loaded {len(self.feature_list)} embeddings and {len(self.filenames)} filenames")
            
            # Verify lengths match
            if len(self.feature_list) != len(self.filenames):
                print(f"⚠ Warning: Embeddings ({len(self.feature_list)}) and filenames ({len(self.filenames)}) counts don't match!")
            
            # Initialize NearestNeighbors
            print("Initializing NearestNeighbors...")
            self.neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
            self.neighbors.fit(self.feature_list)
            print("✓ Recommender initialized successfully!")
            
        except Exception as e:
            print(f"❌ Error loading embeddings: {str(e)}")
            raise
    
    def extract_features(self, img_path_or_url):
        """Extract features from an image (local path or URL)"""
        try:
            # Handle URL or local path
            if img_path_or_url.startswith('http://') or img_path_or_url.startswith('https://'):
                response = requests.get(img_path_or_url, timeout=10)
                img = Image.open(BytesIO(response.content))
                img = img.convert('RGB')
                img = img.resize((224, 224))
                img_array = img_to_array(img)
            else:
                # Local file path
                if not os.path.exists(img_path_or_url):
                    raise FileNotFoundError(f"Image not found: {img_path_or_url}")
                img = load_img(img_path_or_url, target_size=(224, 224))
                img_array = img_to_array(img)
            
            expanded_img_array = np.expand_dims(img_array, axis=0)
            preprocessed_img = preprocess_input(expanded_img_array)
            result = self.model.predict(preprocessed_img, verbose=0).flatten()
            normalized_result = result / norm(result)
            
            return normalized_result
        except Exception as e:
            print(f"❌ Error extracting features: {str(e)}")
            raise
    
    def recommend(self, image_path_or_url, top_k=5):
        """Get top-k recommendations for an image"""
        try:
            # Extract features from input image
            features = self.extract_features(image_path_or_url)
            
            # Find nearest neighbors
            distances, indices = self.neighbors.kneighbors([features], n_neighbors=min(top_k + 1, len(self.feature_list)))
            
            # Return recommendations (skip the first one as it's the query image itself if it exists in dataset)
            recommendations = []
            for i in range(1, min(len(indices[0]), top_k + 1)):
                idx = indices[0][i]
                distance = distances[0][i]
                filename = self.filenames[idx] if idx < len(self.filenames) else f"index_{idx}"
                
                recommendations.append({
                    'index': int(idx),
                    'filename': filename,
                    'distance': float(distance),
                    'similarity_score': float(1 - distance)  # Convert distance to similarity (0-1)
                })
            
            return recommendations
        except Exception as e:
            print(f"❌ Error getting recommendations: {str(e)}")
            raise

# Global instance
recommender = None

def get_recommender():
    """Get or initialize the recommender instance"""
    global recommender
    if recommender is None:
        recommender = FashionRecommender()
    return recommender
