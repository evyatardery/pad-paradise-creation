import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FACTORY_EMAIL = Deno.env.get("FACTORY_EMAIL") || "";

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

    // Build update payload
    const updatePayload: Record<string, any> = { status };
    if (status === "paid" || status === "in_production") {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // When status changes to "in_production" (admin approved payment)
    if (status === "in_production" && order) {
      try {
        // Send payment confirmed email to customer
        if (order.customer_email) {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "payment-confirmed",
              recipientEmail: order.customer_email,
              idempotencyKey: `payment-confirmed-${order.id}`,
              templateData: {
                customerName: order.customer_name,
                orderNumber: order.order_number,
                designName: order.design_name,
                dimensions: order.dimensions,
                quantity: order.quantity,
                totalPrice: order.total_price,
                shippingAddress: order.shipping_address,
              },
            },
          });
        }

        // Send factory order email
        if (FACTORY_EMAIL) {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "factory-order",
              recipientEmail: FACTORY_EMAIL,
              idempotencyKey: `factory-order-${order.id}`,
              templateData: {
                orderNumber: order.order_number,
                designId: order.design_id || "",
                designName: order.design_name,
                dimensions: order.dimensions,
                quantity: order.quantity,
                customerName: order.customer_name,
              },
            },
          });
        }
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }

    // When status changes to "paid", send confirmation emails (legacy flow)
    if (status === "paid" && order) {
      try {
        let printSignedUrl = "";
        let formSignedUrl = "";

        if (order.print_file_url) {
          const { data: pUrl } = await supabase.storage
            .from("order-files")
            .createSignedUrl(order.print_file_url, 60 * 60 * 24 * 7);
          printSignedUrl = pUrl?.signedUrl || "";
        }

        if (order.order_form_url) {
          const { data: fUrl } = await supabase.storage
            .from("order-files")
            .createSignedUrl(order.order_form_url, 60 * 60 * 24 * 7);
          formSignedUrl = fUrl?.signedUrl || "";
        }

        const emailData = {
          orderNumber: order.order_number,
          designName: order.design_name,
          dimensions: order.dimensions,
          quantity: order.quantity,
          totalPrice: order.total_price,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerEmail: order.customer_email || "",
          shippingAddress: order.shipping_address,
        };

        if (order.customer_email) {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "order-confirmation",
              recipientEmail: order.customer_email,
              idempotencyKey: `order-paid-confirm-${order.id}`,
              templateData: emailData,
            },
          });
        }

        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "admin-order-notification",
            recipientEmail: "evyatardery@gmail.com",
            idempotencyKey: `order-paid-admin-${order.id}`,
            templateData: {
              ...emailData,
              printFileUrl: printSignedUrl,
              orderFormUrl: formSignedUrl,
            },
          },
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
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
