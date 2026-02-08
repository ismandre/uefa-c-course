/**
 * Environment detection utilities
 */

/**
 * Check if the application is running on localhost
 * @returns {boolean} - True if running on localhost, false otherwise
 */
export function isLocalhost() {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    // Also check for local IP addresses in the 192.168.x.x range
    window.location.hostname.match(/^192\.168\.\d{1,3}\.\d{1,3}$/) !== null ||
    // Check for 10.x.x.x range
    window.location.hostname.match(/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) !== null ||
    // Check for 172.16.x.x - 172.31.x.x range
    window.location.hostname.match(/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/) !== null
  )
}

/**
 * Check if the application is running in production
 * @returns {boolean} - True if running in production, false otherwise
 */
export function isProduction() {
  return !isLocalhost() && import.meta.env.MODE === 'production'
}

/**
 * Check if analytics should be enabled
 * @returns {boolean} - True if analytics should be tracked, false otherwise
 */
export function shouldTrackAnalytics() {
  // Only track analytics if we're NOT on localhost
  return !isLocalhost()
}
