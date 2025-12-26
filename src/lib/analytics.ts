export const Analytics = {
  BookingAttemptBlocked: (reason: 'unauth' | 'unverified') =>
    console.log('[Analytics] BookingAttemptBlocked', reason),
  BookingStarted: () => console.log('[Analytics] BookingStarted'),
  BookingCompleted: () => console.log('[Analytics] BookingCompleted'),
};
