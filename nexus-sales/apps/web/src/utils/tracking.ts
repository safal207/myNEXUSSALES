/**
 * A lightweight event tracking helper.
 * In a real-world scenario, this would be much more robust,
 * potentially batching events and handling failures gracefully.
 *
 * @param eventName The name of the event to track.
 * @param payload Additional data associated with the event.
 */
export const track = (eventName: string, payload: Record<string, any> = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TRACKING EVENT]: ${eventName}`, payload);
  }

  // Use navigator.sendBeacon if available for non-blocking requests,
  // otherwise fall back to fetch.
  const data = JSON.stringify({ eventName, ...payload });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/events', data);
    } else {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true, // Important for requests that might outlive the page
      });
    }
  } catch (error) {
    console.error('Failed to send tracking event:', error);
  }
};
