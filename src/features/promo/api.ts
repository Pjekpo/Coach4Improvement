import { supabase } from '@/lib/supabase';

const DAYS = 30;
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function randomBase32(len: number) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => BASE32[b % 32]).join('');
}

function createCode() {
  return `C4I-${randomBase32(4)}-${randomBase32(4)}`;
}

export type PromoRow = {
  id: string;
  user_id: string;
  code: string;
  discount_pct: number;
  issued_at: string;
  expires_at: string;
  redeemed_at: string | null;
};

// Idempotently create or return the user's current non-expired, unredeemed code
export async function issuePromoCode(): Promise<PromoRow> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) throw new Error('Not authenticated');

  const nowIso = new Date().toISOString();
  const { data: existing, error: qErr } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('user_id', uid)
    .is('redeemed_at', null)
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (!qErr && existing) return existing as PromoRow;

  let attempt = 0;
  while (attempt < 5) {
    attempt++;
    const code = createCode();
    const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([{ user_id: uid, code, expires_at: expiresAt }])
      .select('*')
      .single();

    if (!error && data) return data as PromoRow;
    if (error?.message?.includes('duplicate key value') || error?.message?.includes('unique')) continue;
    throw error ?? new Error('Failed to issue promo code');
  }
  throw new Error('Could not generate unique promo code');
}

