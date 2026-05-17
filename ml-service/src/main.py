import os
import numpy as np
import pickle
import tensorflow as tf
from tensorflow import keras
from keras.preprocessing import image
from keras.layers import GlobalMaxPooling2D
from keras.applications.resnet50 import ResNet50, preprocess_input
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm

# 1. Load precomputed embeddings and filenames
feature_list = np.array(pickle.load(open("ml-service/embeddings.pkl", "rb")))
filenames = pickle.load(open("ml-service/filenames.pkl", "rb"))

#2. Build feature-extractor model (same as you used to create embeddings)
base_model = ResNet50(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    GlobalMaxPooling2D()
])

# 3. Build KNN index on embeddings
neighbors = NearestNeighbors(n_neighbors=6, algorithm="brute", metric="euclidean")
neighbors.fit(feature_list)


def extract_features(img_path: str):
    """Extract normalized feature vector from an image path."""
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)
    result = model.predict(preprocessed_img).flatten()
    normalized_result = result / norm(result)
    return normalized_result


def get_recommendations(img_path: str, top_k: int = 5):
    """
    Given a query image path, return list of `top_k` similar image paths
    from your catalog.
    """
    features = extract_features(img_path)
    distances, indices = neighbors.kneighbors([features], n_neighbors=top_k)
    recommended_files = [filenames[idx] for idx in indices[0]]
    return recommended_files


if __name__ == "__main__":
    # simple manual test
    test_img = "F:/archieve (1)/clone dataset/Gaun/a2e6fd5e-001b-4cbc-86a0-7f015a1beda6.png"
    if os.path.exists(test_img):
        recs = get_recommendations(test_img, top_k=5)
        print("Recommended images:")
        for r in recs:
            print(r)
    else:
        print("Update `test_img` to point to an existing image.")