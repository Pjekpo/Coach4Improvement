// HMAC SHA-256 using Web Crypto, returns hex strings
export async function hmacSign(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return bufferToHex(sig);
}

export async function verifyHmac(value: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(value, secret);
  return timingSafeEqual(expected, signature);
}

function bufferToHex(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

