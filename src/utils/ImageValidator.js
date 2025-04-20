import * as tf from '@tensorflow/tfjs';

/**
 * Returns the predicted class label using a custom Teachable Machine model
 * @param {HTMLImageElement} imageEl
 * @param {Object} model - Loaded Teachable Machine model
 * @param {string[]} classLabels - Class names in order
 * @returns {Promise<string>} - Predicted class name
 */
export const getPredictedLabel = async (imgElement, model, classLabels, threshold = 0.5) => {
    if (!imgElement || !model) throw new Error("Missing image or model");
  
    const tensor = tf.browser.fromPixels(imgElement)
      .resizeNearestNeighbor([224, 224]) // ✅ Match Teachable Machine input size
      .toFloat()
      .expandDims();
  
    const prediction = await model.predict(tensor).data();
    const maxConfidence = Math.max(...prediction);
    const maxIndex = prediction.indexOf(maxConfidence);
  
    if (maxConfidence < threshold) {
      return 'No matching class found';
    }
  
    return classLabels[maxIndex];
  };
  
  
