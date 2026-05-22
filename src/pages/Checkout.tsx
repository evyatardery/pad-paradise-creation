import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, Shield, ShoppingBag, Tag, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sizes } from "@/data/catalog";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

import { toast } from "sonner";

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  TEST100: { discount: 100, label: "100% הנחה" },
};

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().trim().regex(/^0\d{8,9}$/, "מספר טלפון לא תקין (לדוגמה: 0551234567)"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255),
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
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bit" | "paybox" | "credit">("bit");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState("");

  const discountPercent = promoApplied?.discount || 0;
  const finalPrice = Math.max(0, Math.round(size.price * (1 - discountPercent / 100)));

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES[code];
    if (found) {
      setPromoApplied(found);
      setPromoError("");
      toast.success(`קופון "${code}" הופעל! ${found.label}`);
    } else {
      setPromoApplied(null);
      setPromoError("קוד קופון לא תקין");
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };


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
      const totalPrice = finalPrice;
      const isFreeOrder = totalPrice === 0;
      const orderStatus = isFreeOrder ? "paid" : "pending_payment";

      const paymentLinks: Record<string, string> = {
        bit: "https://app.onelink.me/lmJd/bit?phone=0524796790",
        paybox: "https://links.payboxapp.com/BWlK8Aqyc2b",
      };
      const paymentLink = isFreeOrder ? "" : (paymentLinks[paymentMethod] || "");

      // Create order
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
          status: orderStatus,
          payment_method: paymentMethod,
          ...(isFreeOrder ? { paid_at: new Date().toISOString() } : {}),
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      setOrderNumber(order.order_number);

      // Send emails (fire & forget)
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
              paymentLink: isFreeOrder ? '' : paymentLink,
            },
          },
        }).catch((err) => console.error('Failed to send customer email:', err));
      }

      // Admin notification
      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'admin-order-notification',
          recipientEmail: 'evyatardery@gmail.com',
          idempotencyKey: `order-pending-admin-${order.id}`,
          templateData: {
            orderNumber: order.order_number,
            designName,
            designId: designId || '',
            dimensions: size.label,
            quantity: 1,
            totalPrice,
            customerName: result.data.name,
            customerPhone: result.data.phone,
            customerEmail: result.data.email || '',
            shippingAddress: `${result.data.address}, ${result.data.city}`,
            paymentMethod: isFreeOrder ? 'free' : paymentMethod,
            paymentLink,
          },
        },
      }).catch((err) => console.error('Failed to send admin email:', err));

      // Factory notification - sent for every new order
      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'factory-order',
          recipientEmail: 'orders@padzone.co.il',
          idempotencyKey: `factory-order-${order.id}`,
          templateData: {
            orderNumber: order.order_number,
            designName,
            designId: designId || '',
            dimensions: size.label,
            quantity: 1,
            isCustomDesign: isCustom,
            designImageUrl: designImage.startsWith("data:") ? '' : designImage || '',
          },
        },
      }).catch((err) => console.error('Failed to send factory email:', err));

      // Fire webhook for ALL orders (fire & forget)
      supabase.functions.invoke('notify-order-webhook', {
        body: { orderId: order.id },
      }).catch((err) => console.error('Failed to send webhook:', err));

      setSubmitted(true);
      toast.success(isFreeOrder ? "ההזמנה הושלמה בהצלחה! 🎉" : "ההזמנה נוצרה בהצלחה!");
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
            {finalPrice === 0 ? (
              <>ההזמנה שלך הושלמה בהצלחה! אנחנו מתחילים לעבוד עליה.</>
            ) : (
              <>
                לחץ על הכפתור למטה כדי לעבור לתשלום.
                <br />
                <strong className="text-card-foreground">ההזמנה תצא לייצור מיד עם השלמת התשלום.</strong>
              </>
            )}
          </p>

          {finalPrice > 0 && (
            <div className="mt-6">
              {paymentMethod === "bit" ? (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black py-4 rounded-xl text-lg neon-box-strong hover:bg-primary/90 transition-colors cursor-pointer">
                        💙 עבור לתשלום בביט
                      </button>
                    </DialogTrigger>
                    <DialogContent className="text-center" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">תשלום בביט 💙</DialogTitle>
                        <DialogDescription className="text-base leading-relaxed mt-4">
                          העבר את הסכום המדויק של ההזמנה שלך לביט:
                          <br />
                          <strong className="text-card-foreground text-lg">052-4796790</strong>
                          <br />
                          לאחר ההעברה נשלח לך אישור ונתחיל בייצור 🎮
                        </DialogDescription>
                      </DialogHeader>
                      <DialogClose asChild>
                        <Button variant="secondary" className="mt-4 w-full">סגור</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <a
                  href="https://links.payboxapp.com/BWlK8Aqyc2b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black py-4 rounded-xl text-lg neon-box-strong hover:bg-primary/90 transition-colors"
                >
                  🟢 עבור לתשלום בפייבוקס
                </a>
              )}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-xl hover:bg-secondary/80 transition-colors"
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
                <label className="block text-card-foreground mb-1.5 font-semibold text-sm">אימייל *</label>
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


              {/* Payment method selection */}
              {finalPrice > 0 && (
                <div>
                  <label className="block text-card-foreground mb-3 font-semibold text-sm">אמצעי תשלום *</label>
                  <div className="space-y-2">
                    {[
                      { value: "bit" as const, label: "💙 ביט", disabled: false },
                      { value: "paybox" as const, label: "🟢 פייבוקס", disabled: false },
                      { value: "credit" as const, label: "💳 אשראי - בקרוב", disabled: true },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          option.disabled
                            ? "border-border opacity-50 cursor-not-allowed"
                            : paymentMethod === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.value}
                          checked={paymentMethod === option.value}
                          onChange={() => setPaymentMethod(option.value)}
                          disabled={option.disabled}
                          className="accent-primary w-4 h-4"
                        />
                        <span className={`font-semibold text-sm ${option.disabled ? "text-muted-foreground" : "text-card-foreground"}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
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
                <span>{submitting ? "שולח הזמנה..." : finalPrice === 0 ? "השלם הזמנה - חינם! 🎉" : `הזמן עכשיו - ₪${finalPrice}`}</span>
              </motion.button>

              <p className="text-center text-muted-foreground text-xs">
                {finalPrice === 0 ? "ההזמנה תושלם אוטומטית ללא תשלום" : "לאחר ההזמנה תועבר ישירות לעמוד התשלום"}
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
                  <span className={`text-card-foreground ${promoApplied ? "line-through opacity-50" : ""}`}>₪{size.price}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">הנחת קופון ({promoApplied.label})</span>
                    <span className="text-green-400">-₪{size.price - finalPrice}</span>
                  </div>
                )}
              </div>

              {/* Promo code field */}
              <div className="mb-4 pb-4 border-b border-border">
                <label className="block text-muted-foreground text-xs mb-2 font-semibold">קוד קופון</label>
                {promoApplied ? (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5">
                    <Check size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-bold flex-1">{promoCode.toUpperCase()} — {promoApplied.label}</span>
                    <button onClick={removePromo} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                      placeholder="הזן קוד קופון"
                      className="flex-1 bg-input text-card-foreground rounded-xl px-3 py-2.5 outline-none border-2 border-transparent focus:border-primary text-sm"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="bg-primary/20 text-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/30 transition-colors flex items-center gap-1"
                    >
                      <Tag size={14} />
                      הפעל
                    </button>
                  </div>
                )}
                {promoError && <p className="text-destructive text-xs mt-1.5">{promoError}</p>}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-card-foreground font-bold">סה״כ לתשלום</span>
                <span className="text-primary font-black text-2xl neon-text">
                  {finalPrice === 0 ? "חינם! 🎉" : `₪${finalPrice}`}
                </span>
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
