import axios from "axios";

const RECOMMENDER_SERVICE_URL = process.env.RECOMMENDER_SERVICE_URL || "http://localhost:8001";

/**
 * Get fashion recommendations based on an image URL
 * @param {string} imageUrl - Full URL to the image
 * @param {number} topK - Number of recommendations (default: 5)
 * @returns {Promise<Array>} Array of recommendation objects
 */
export const getRecommendations = async (imageUrl, topK = 5) => {
    try {
        console.log(`Getting recommendations for: ${imageUrl}`);
        const response = await axios.post(
            `${RECOMMENDER_SERVICE_URL}/recommend`,
            {
                image_url: imageUrl,
                top_k: topK
            },
            {
                timeout: 30000 // 30 seconds timeout for ML processing
            }
        );
        
        if (response.data.success) {
            console.log(`✓ Got ${response.data.recommendations.length} recommendations`);
            return response.data.recommendations;
        }
        return [];
    } catch (error) {
        console.error("Error getting recommendations from ML service:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("⚠ ML service is not running. Start it with: cd ml-service && python -m uvicorn src.service:app --host 0.0.0.0 --port 8001");
        }
        // Return empty array if ML service is unavailable (graceful degradation)
        return [];
    }
};

/**
 * Check if ML service is healthy
 * @returns {Promise<boolean>}
 */
export const checkMLServiceHealth = async () => {
    try {
        const response = await axios.get(`${RECOMMENDER_SERVICE_URL}/health`, {
            timeout: 5000
        });
        return response.data.status === "healthy";
    } catch (error) {
        console.error("ML service health check failed:", error.message);
        return false;
    }
};


