export const Analytics = {
  PromoImpression: () => console.log('[Analytics] PromoImpression'),
  PromoDismissed: () => console.log('[Analytics] PromoDismissed'),
  PromoRemindLater: () => console.log('[Analytics] PromoRemindLater'),
  PromoClaimed: (code?: string) => console.log('[Analytics] PromoClaimed', code),
  BookingAttemptBlocked: (reason: 'unauth' | 'unverified') =>
    console.log('[Analytics] BookingAttemptBlocked', reason),
  BookingStarted: () => console.log('[Analytics] BookingStarted'),
  BookingCompleted: () => console.log('[Analytics] BookingCompleted'),
};

