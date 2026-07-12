/**
 * Normalizes e-commerce URLs to prevent duplicate product entries.
 * Extracts the core product identifier (e.g., ASIN for Amazon, PID for Flipkart).
 * 
 * @param {string} rawUrl - The original product URL pasted by the user.
 * @returns {string} - The normalized URL or product identifier.
 */
function normalizeUrl(rawUrl) {
  try {
    const urlObj = new URL(rawUrl);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Amazon URL Normalization
    if (hostname.includes('amazon.')) {
      // Look for /dp/ASIN or /gp/product/ASIN
      const dpMatch = urlObj.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (dpMatch && dpMatch[1]) {
        return `amazon:${dpMatch[1]}`; // e.g., amazon:B08N5WRWNW
      }
    }

    // Flipkart URL Normalization
    if (hostname.includes('flipkart.com')) {
      // Flipkart typically uses 'pid=XYZ' query parameter
      const pid = urlObj.searchParams.get('pid');
      if (pid) {
        return `flipkart:${pid}`;
      }
      
      // Fallback: check if it's in the path like /p/itm...
      const itmMatch = urlObj.pathname.match(/\/p\/(itm[a-z0-9]+)/i);
      if (itmMatch && itmMatch[1]) {
        return `flipkart:${itmMatch[1]}`;
      }
    }

    // Generic fallback: remove all query params and trailing slashes
    urlObj.search = '';
    urlObj.hash = '';
    let normalized = urlObj.toString();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;

  } catch (error) {
    // If URL parsing fails, return the original URL as fallback
    console.error(`URL Normalization failed for ${rawUrl}:`, error.message);
    return rawUrl;
  }
}

module.exports = normalizeUrl;
