import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Printer, Palette, Users, PackageCheck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const values = [
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "עיצובים בלעדיים",
    text: "גרפיקה וקטורית ייחודית שלא תמצאו בשום מקום אחר.",
  },
  {
    icon: <Printer className="w-8 h-8 text-primary" />,
    title: "ייצור כחול-לבן",
    text: "אנחנו מדפיסים ומבקרים כל קובץ וקובץ באופן אישי כאן אצלנו.",
  },
  {
    icon: <PackageCheck className="w-8 h-8 text-primary" />,
    title: "חוויית פרימיום",
    text: "אריזות מהודרות, מחזיקי מפתחות תואמים והוראות שימוש — כל חבילה היא מתנה.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "קהילה לפני הכל",
    text: "האתר הזה הוקם על ידי גיימר, עבור גיימרים ואנשים שאוהבים אסתטיקה וטכנולוגיה.",
  },
];

const About = () => {
  useEffect(() => {
    document.title = "PadZone | הסיפור שלנו – אסף ו-PadZone";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="text-primary font-black text-2xl neon-text">
            PADZONE
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold"
          >
            <ArrowRight size={18} />
            חזרה לחנות
          </Link>
        </div>
      </nav>

      <div className="pt-20 pb-24 px-6 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 mb-6">
            <span className="text-primary font-bold text-sm">הסיפור שלנו</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-card-foreground mb-4 leading-tight">
            הכל התחיל מאהבה גדולה למחשבים
            <br />
            <span className="text-primary neon-text">(וחיפוש אחרי הפד המושלם)</span>
          </h1>
        </motion.div>

        {/* Story sections */}
        <div className="space-y-14">
          <motion.div {...fadeUp} className="bg-card rounded-2xl border border-border p-8 md:p-10">
            <p className="text-card-foreground text-lg leading-relaxed">
              נעים להכיר, אני <strong className="text-primary">אסף</strong>, בן 12, גיימר וחובב
              טכנולוגיה מושבע. כמו כל מי שמבלה זמן מול המסך, תמיד חיפשתי את הדרך לשדרג את
              העמדה שלי (The Setup). הבנתי שהפריט הכי חשוב – זה שנותן את הסטייל וגם שומר על
              הדיוק בביצועים – הוא משטח העכבר.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              כשלא מצאתי פדים שענו על הציפיות שלי מבחינת עיצוב ואיכות, החלטתי לקחת את העניינים
              לידיים. כך נולד <strong className="text-primary">PadZone</strong>.
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-black text-primary neon-text mb-4">
              מיוזמה קטנה למותג פרימיום
            </h2>
            <p className="text-card-foreground text-lg leading-relaxed">
              מה שהתחיל כרעיון הפך מהר מאוד למותג אמיתי. לא הסתפקתי רק בעיצוב – רציתי לשלוט
              בכל שלב בדרך. הקמנו מערך ייצור עצמאי שבו אנחנו מדפיסים כל פד בטכנולוגיית{" "}
              <strong className="text-primary">סובלימציה מתקדמת</strong>, שמבטיחה צבעים חיים שלא
              דוהים לעולם ודיוק וקטורי מקסימלי.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="bg-card rounded-2xl border border-border p-8 md:p-10">
            <h2 className="text-3xl font-black text-primary neon-text mb-4">
              איכות שמרגישים כבר בפתיחת האריזה
            </h2>
            <p className="text-card-foreground text-lg leading-relaxed">
              ב-PadZone, החוויה מתחילה עוד לפני שהעכבר נוגע במשטח. השקענו חודשים בעיצוב אריזות
              מהודרות, בחירת מחזיקי מפתחות תואמים והוראות שימוש, כי אני מאמין שכל לקוח מגיע
              לקבל חבילה שהיא <strong className="text-primary">"מתנה" לעצמו</strong>.
            </p>
          </motion.div>
        </div>

        {/* Values grid */}
        <motion.div {...fadeUp} className="mt-20">
          <h2 className="text-3xl font-black text-primary neon-text text-center mb-10">
            למה לבחור בנו?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors"
              >
                <div className="mb-3">{v.icon}</div>
                <h3 className="text-card-foreground font-bold text-lg mb-1">{v.title}</h3>
                <p className="text-muted-foreground">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing CTA */}
        <motion.div {...fadeUp} className="text-center mt-20">
          <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-2xl border border-primary/20 p-10">
            <p className="text-xl text-card-foreground font-bold mb-2">
              שדרוג העמדה שלכם הוא השליחות שלי.
            </p>
            <p className="text-muted-foreground mb-6">
              תודה שאתם חלק מהמסע של PadZone! 🎮
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl text-lg hover:scale-105 transition-transform neon-box-strong"
            >
              לחנות הפדים
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
