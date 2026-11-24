// Server-side key for Supabase admin access inside Edge Functions.
// Legacy SUPABASE_SERVICE_ROLE_KEY is being retired (early 2027);
// fall back to the new SUPABASE_SECRET_KEYS dictionary.
export function serviceKey(): string {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacy) return legacy
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    return keys.default || Object.values(keys)[0] as string || ''
  } catch {
    return ''
  }
}
