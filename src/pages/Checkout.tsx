import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, Shield, AlertTriangle, ShoppingBag, Tag, Check, X } from "lucide-react";
import { sizes } from "@/data/catalog";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { getPaymentLink } from "@/data/paymentLinks";
import { preflightCheck, type PreflightResult } from "@/utils/printFileGenerator";
import { checkPdfQuality } from "@/utils/pdfQualityChecker";
import { toast } from "sonner";

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  TEST100: { discount: 100, label: "100% הנחה" },
};

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().trim().regex(/^0\d{8,9}$/, "מספר טלפון לא תקין (לדוגמה: 0551234567)"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255).or(z.literal("")),
  address: z.string().trim().min(5, "כתובת חייבת להכיל לפחות 5 תווים").max(300),
  city: z.string().trim().min(2, "עיר חייבת להכיל לפחות 2 תווים").max(100),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PADZONE – השלמת הזמנה";
  }, []);
  const [searchParams] = useSearchParams();

  const designId = searchParams.get("design") || "";
  const designName = searchParams.get("name") || "פד מותאם אישית";
  const sizeIdx = Number(searchParams.get("size") || "1");
  const isCustom = searchParams.get("custom") === "1";
  const designImage = searchParams.get("image") || "";
  const sourcePdf = searchParams.get("sourcePdf") || "";

  const size = sizes[sizeIdx] || sizes[1];
  const [preflight, setPreflight] = useState<PreflightResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Run preflight quality check
  useEffect(() => {
    if (!designImage) return;
    if (sourcePdf) {
      checkPdfQuality(sourcePdf, size.label)
        .then(setPreflight)
        .catch(() => setPreflight(null));
      return;
    }
    preflightCheck(designImage, size.label)
      .then(setPreflight)
      .catch(() => setPreflight(null));
  }, [designImage, size.label, sourcePdf]);

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const result = checkoutSchema.shape[field].safeParse(value);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? undefined : result.error.issues[0]?.message,
      }));
    }
  };

  const handleBlur = (field: keyof CheckoutForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = checkoutSchema.shape[field].safeParse(form[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof CheckoutForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setTouched({ name: true, phone: true, email: true, address: true, city: true });
      return;
    }

    setSubmitting(true);
    try {
      const totalPrice = size.price;
      const paymentLink = getPaymentLink(size.label);

      // Create order with pending_payment status
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: "", // trigger will generate
          customer_name: result.data.name,
          customer_email: result.data.email || null,
          customer_phone: result.data.phone,
          shipping_address: `${result.data.address}, ${result.data.city}`,
          design_id: designId || null,
          design_name: designName,
          design_image_url: designImage.startsWith("data:") ? null : designImage || null,
          dimensions: size.label,
          quantity: 1,
          is_custom_design: isCustom,
          unit_price: size.price,
          total_price: totalPrice,
          status: "pending_payment",
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      setOrderNumber(order.order_number);

      // Send order confirmation email with payment link (fire & forget)
      if (result.data.email) {
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'order-confirmation',
            recipientEmail: result.data.email,
            idempotencyKey: `order-confirm-${order.id}`,
            templateData: {
              customerName: result.data.name,
              orderNumber: order.order_number,
              designName,
              dimensions: size.label,
              quantity: 1,
              totalPrice,
              paymentLink,
            },
          },
        }).catch((err) => console.error('Failed to send customer email:', err));
      }

      // Send admin notification (pending_payment alert)
      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'admin-order-notification',
          recipientEmail: 'evyatardery@gmail.com',
          idempotencyKey: `order-pending-admin-${order.id}`,
          templateData: {
            orderNumber: order.order_number,
            designName,
            dimensions: size.label,
            quantity: 1,
            totalPrice,
            customerName: result.data.name,
            customerPhone: result.data.phone,
            customerEmail: result.data.email || '',
            shippingAddress: `${result.data.address}, ${result.data.city}`,
          },
        },
      }).catch((err) => console.error('Failed to send admin email:', err));

      setSubmitted(true);
      toast.success("ההזמנה נוצרה בהצלחה!");
    } catch (err: any) {
      toast.error(`שגיאה ביצירת הזמנה: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof CheckoutForm) =>
    `w-full bg-input text-card-foreground rounded-xl px-4 py-3.5 outline-none transition-all border-2 ${
      errors[field] && touched[field]
        ? "border-destructive focus:border-destructive"
        : "border-transparent focus:border-primary"
    } focus:ring-2 focus:ring-primary/20`;

  // Success state — show confirmation message
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-card rounded-2xl p-8 border border-border shadow-xl text-center"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <ShoppingBag className="mx-auto text-primary" size={64} />
          </motion.div>

          <h1 className="text-3xl font-bold text-card-foreground mt-6">
            הזמנתך התקבלה! 🎉
          </h1>

          {orderNumber && (
            <p className="text-primary font-mono text-lg mt-2">{orderNumber}</p>
          )}

          <p className="text-muted-foreground text-lg leading-relaxed mt-4">
            לינק לתשלום מאובטח נשלח אליך ברגע זה לווטסאפ ולמייל.
            <br />
            <strong className="text-card-foreground">ההזמנה תצא לייצור מיד עם השלמת התשלום.</strong>
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors neon-box"
            >
              חזרה לחנות ←
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <button onClick={() => navigate("/")} className="text-primary font-black text-2xl neon-text">
            PADZONE
          </button>
          <span className="text-muted-foreground font-semibold text-sm">🛒 השלמת הזמנה</span>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowRight size={18} />
          <span>חזרה לחנות</span>
        </button>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Form - 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <h1 className="text-3xl font-black text-primary neon-text mb-2">השלמת הזמנה</h1>
            <p className="text-muted-foreground mb-8">מלא את הפרטים שלך ונשלח לך לינק תשלום מאובטח 🔒</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">שם מלא *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="ישראל ישראלי"
                  className={inputClass("name")}
                />
                {errors.name && touched.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">טלפון *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="0551234567"
                  className={inputClass("phone")}
                  dir="ltr"
                />
                {errors.phone && touched.phone && (
                  <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">אימייל (אופציונלי)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="example@email.com"
                  className={inputClass("email")}
                  dir="ltr"
                />
                {errors.email && touched.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">כתובת למשלוח *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="רחוב הרצל 1, דירה 5"
                  className={inputClass("address")}
                />
                {errors.address && touched.address && (
                  <p className="text-destructive text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">עיר *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  placeholder="תל אביב"
                  className={inputClass("city")}
                />
                {errors.city && touched.city && (
                  <p className="text-destructive text-xs mt-1">{errors.city}</p>
                )}
              </div>

              {/* Preflight quality warning */}
              {preflight && !preflight.ok && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={20} />
                  <div className="text-sm">
                    <p className="font-bold text-destructive mb-1">⚠️ איכות תמונה נמוכה</p>
                    <p className="text-destructive/80">{preflight.warning}</p>
                  </div>
                </div>
              )}

              {preflight && preflight.ok && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary">
                  <Shield size={16} />
                  <span>✅ איכות תמונה מעולה ({preflight.dpi} DPI)</span>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl text-lg neon-box-strong flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <ShoppingBag size={22} />
                <span>{submitting ? "שולח הזמנה..." : `הזמן עכשיו - ₪${size.price}`}</span>
              </motion.button>

              <p className="text-center text-muted-foreground text-xs">
                לינק לתשלום מאובטח יישלח אליך לווטסאפ ולמייל
              </p>
            </form>
          </motion.div>

          {/* Summary - 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-2"
          >
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-24 neon-box">
              <h2 className="text-lg font-bold text-card-foreground mb-4">סיכום הזמנה</h2>

              {/* Product info */}
              <div className="bg-secondary rounded-xl p-4 mb-4">
                <p className="text-primary font-bold text-sm mb-1">{designName}</p>
                <p className="text-muted-foreground text-xs">גודל: {size.label}</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">מחיר פד</span>
                  <span className="text-card-foreground">₪{size.price}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-card-foreground font-bold">סה״כ לתשלום</span>
                <span className="text-primary font-black text-2xl neon-text">₪{size.price}</span>
              </div>

              {/* Trust badges */}
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "תשלום מאובטח 100%" },
                  { icon: Package, text: "אריזה מוגנת" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
