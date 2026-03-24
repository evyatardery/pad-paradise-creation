import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, Shield, CreditCard, MessageCircle, FlaskConical } from "lucide-react";
import { sizes } from "@/data/catalog";
import { z } from "zod";
import { processOrder } from "@/utils/orderService";
import { toast } from "sonner";

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
  const [searchParams] = useSearchParams();

  const designId = searchParams.get("design") || "";
  const designName = searchParams.get("name") || "פד מותאם אישית";
  const sizeIdx = Number(searchParams.get("size") || "1");
  const isCustom = searchParams.get("custom") === "1";

  const size = sizes[sizeIdx] || sizes[1];

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Save to sessionStorage for post-payment processing
    sessionStorage.setItem(
      "checkout_data",
      JSON.stringify({
        ...result.data,
        designId,
        designName,
        sizeIdx,
        sizeLabel: size.label,
        price: size.price,
        isCustom,
      })
    );

    // TODO: Redirect to GROW payment page
    // For now, navigate to success page for testing
    navigate("/order-success");
  };

  const inputClass = (field: keyof CheckoutForm) =>
    `w-full bg-input text-card-foreground rounded-xl px-4 py-3.5 outline-none transition-all border-2 ${
      errors[field] && touched[field]
        ? "border-destructive focus:border-destructive"
        : "border-transparent focus:border-primary"
    } focus:ring-2 focus:ring-primary/20`;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <button onClick={() => navigate("/")} className="text-primary font-black text-2xl neon-text">
            PADZONE
          </button>
          <span className="text-muted-foreground font-semibold text-sm">🔒 תשלום מאובטח</span>
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
            <p className="text-muted-foreground mb-8">מלא את הפרטים שלך ונשלח לך את הפד עד הבית 🚀</p>

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

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl text-lg neon-box-strong flex items-center justify-center gap-3"
              >
                <CreditCard size={22} />
                <span>לתשלום באשראי - ₪{size.price}</span>
              </motion.button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-border w-full" />
                <span className="absolute bg-background px-3 text-muted-foreground text-xs">או</span>
              </div>

              <a
                href={`https://wa.me/972552589255?text=${encodeURIComponent(`שלום, אני רוצה לשלם ב-Bit/PayBox עבור: ${designName} - ${size.label}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border-2 border-[hsl(142_70%_49%)] text-[hsl(142_70%_49%)] font-bold py-3.5 rounded-xl text-base hover:bg-[hsl(142_70%_49%)]/10 transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                <span>תשלום ב-Bit / PayBox דרך וואטסאפ</span>
              </a>
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
