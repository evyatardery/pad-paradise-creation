import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FACTORY_EMAIL = "EVYATARDERY@GMAIL.COM";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Missing orderId or status" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // If status changed to in_production, send notification email to factory
    if (status === "in_production" && order) {
      try {
        // Build download links for factory
        let printFileLink = "";
        let orderFormLink = "";

        if (order.print_file_url) {
          const { data: signedPrint } = await supabase.storage
            .from("order-files")
            .createSignedUrl(order.print_file_url, 60 * 60 * 24 * 7); // 7 days
          printFileLink = signedPrint?.signedUrl || "";
        }

        if (order.order_form_url) {
          const { data: signedForm } = await supabase.storage
            .from("order-files")
            .createSignedUrl(order.order_form_url, 60 * 60 * 24 * 7);
          orderFormLink = signedForm?.signedUrl || "";
        }

        const emailHtml = `
          <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h1 style="color:#00d4ff;border-bottom:2px solid #00d4ff;padding-bottom:10px;">
              🎮 PADZONE — הזמנה חדשה לייצור
            </h1>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">מספר הזמנה:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.order_number}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">שם לקוח:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.customer_name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">טלפון:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.customer_phone}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">כתובת למשלוח:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.shipping_address}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">עיצוב:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.design_name}${order.is_custom_design ? " (מותאם אישית)" : ""}</td></tr>
              ${order.custom_text ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">טקסט מותאם:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.custom_text}</td></tr>` : ""}
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">מידה:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.dimensions}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">כמות:</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.quantity}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">סה״כ:</td><td style="padding:8px;border-bottom:1px solid #eee;">₪${order.total_price}</td></tr>
            </table>
            <div style="margin:20px 0;">
              <h2 style="color:#00d4ff;">קבצים להורדה:</h2>
              ${printFileLink ? `<p><a href="${printFileLink}" style="color:#00d4ff;font-weight:bold;">📄 הורד קובץ הדפסה</a></p>` : "<p>אין קובץ הדפסה</p>"}
              ${orderFormLink ? `<p><a href="${orderFormLink}" style="color:#00d4ff;font-weight:bold;">📋 הורד טופס הזמנה</a></p>` : ""}
            </div>
            <p style="color:#999;font-size:12px;margin-top:30px;">נשלח אוטומטית ע״י מערכת PADZONE</p>
          </div>
        `;

        // Send email via Lovable API
        const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
        if (lovableApiKey) {
          await fetch("https://api.lovable.dev/v1/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lovableApiKey}`,
            },
            body: JSON.stringify({
              to: FACTORY_EMAIL,
              subject: `PADZONE הזמנה חדשה לייצור: ${order.order_number}`,
              html: emailHtml,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
        // Don't fail the status update just because email failed
      }
    }

    return new Response(JSON.stringify({ success: true, order }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
