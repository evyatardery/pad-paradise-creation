import { serviceKey } from '../_shared/serviceKey.ts'
// Sends PadZone transactional emails directly through Resend (https://resend.com).
// Replaces the Lovable email queue. Same request body as before:
//   { templateName, recipientEmail, idempotencyKey?, templateData? }
//
// Required secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   – API key from resend.com
// Optional:
//   EMAIL_FROM       – default: "PadZone <orders@padzone.co.il>"
//   EMAIL_REPLY_TO   – default: evyatardery@gmail.com
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) {
    console.error('RESEND_API_KEY is not set')
    return json({ error: 'Email is not configured' }, 500)
  }

  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  const templateName: string = body.templateName || body.template_name
  const recipientEmail: string = body.recipientEmail || body.recipient_email
  const idempotencyKey: string | undefined =
    body.idempotencyKey || body.idempotency_key
  const templateData: Record<string, any> =
    body.templateData && typeof body.templateData === 'object'
      ? body.templateData
      : {}

  const template = templateName ? TEMPLATES[templateName] : undefined
  if (!template) {
    return json(
      {
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
      },
      404,
    )
  }

  const to = template.to || recipientEmail
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return json({ error: 'A valid recipientEmail is required' }, 400)
  }

  const subject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  const element = React.createElement(template.component, templateData)
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${resendKey}`,
    'Content-Type': 'application/json',
  }
  // Resend de-duplicates requests with the same key for 24h
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey.slice(0, 256)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: Deno.env.get('EMAIL_FROM') || 'PadZone <orders@padzone.co.il>',
      reply_to: Deno.env.get('EMAIL_REPLY_TO') || 'evyatardery@gmail.com',
      to: [to],
      subject,
      html,
      text,
    }),
  })
  const result = await res.json().catch(() => ({}))

  // Best-effort log (table is optional)
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      serviceKey(),
    )
    await supabase.from('email_send_log').insert({
      message_id: result?.id ?? null,
      template_name: templateName,
      recipient_email: to,
      status: res.ok ? 'sent' : 'failed',
      error_message: res.ok ? null : JSON.stringify(result).slice(0, 1000),
    })
  } catch (_) { /* ignore */ }

  if (!res.ok) {
    console.error('Resend error', res.status, result)
    return json({ error: 'Failed to send email', details: result }, 502)
  }

  console.log('Email sent', { templateName, to, id: result?.id })
  return json({ success: true, id: result?.id })
})
