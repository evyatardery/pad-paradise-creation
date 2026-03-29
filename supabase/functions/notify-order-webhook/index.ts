import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(JSON.stringify({ error: "Missing orderId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhookUrl = Deno.env.get("ORDER_WEBHOOK_URL");
    if (!webhookUrl || webhookUrl.includes("placeholder")) {
      console.warn("ORDER_WEBHOOK_URL not configured or is placeholder, skipping webhook.");
      return new Response(JSON.stringify({ skipped: true, reason: "Webhook URL not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the full order details
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      throw new Error(`Failed to fetch order: ${fetchError?.message}`);
    }

    // Build signed URLs for file access
    let printFileSignedUrl = "";
    let orderFormSignedUrl = "";

    if (order.print_file_url) {
      const { data: pUrl } = await supabase.storage
        .from("order-files")
        .createSignedUrl(order.print_file_url, 60 * 60 * 24 * 7);
      printFileSignedUrl = pUrl?.signedUrl || "";
    }

    if (order.order_form_url) {
      const { data: fUrl } = await supabase.storage
        .from("order-files")
        .createSignedUrl(order.order_form_url, 60 * 60 * 24 * 7);
      orderFormSignedUrl = fUrl?.signedUrl || "";
    }

    // Send webhook with clean flat payload (camelCase keys for Make compatibility)
    const payload = {
      event: "order.created",
      timestamp: new Date().toISOString(),
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email || "",
      shippingAddress: order.shipping_address,
      orderNumber: order.order_number,
      status: order.status,
      designName: order.design_name,
      dimensions: order.dimensions,
      quantity: order.quantity,
      unitPrice: order.unit_price,
      isCustomDesign: order.is_custom_design,
      customText: order.custom_text || "",
      totalPrice: order.total_price,
      printFileUrl: printFileSignedUrl,
      orderFormUrl: orderFormSignedUrl,
      designImageUrl: order.design_image_url || "",
      createdAt: order.created_at,
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log(`Webhook sent to ${webhookUrl}, status: ${webhookResponse.status}`);

    return new Response(
      JSON.stringify({ success: true, webhookStatus: webhookResponse.status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
