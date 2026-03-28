import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else if (data.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-card rounded-xl border border-border p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          PAD<span className="text-primary">Z</span>ONE
        </h1>

        {status === "loading" && (
          <p className="text-muted-foreground mt-6">טוען...</p>
        )}

        {status === "valid" && (
          <div className="mt-6 space-y-4">
            <p className="text-card-foreground">האם ברצונך להסיר את עצמך מרשימת התפוצה?</p>
            <button
              onClick={handleUnsubscribe}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              אישור הסרה
            </button>
          </div>
        )}

        {status === "success" && (
          <div className="mt-6 space-y-4">
            <p className="text-green-400 font-semibold">הוסרת בהצלחה מרשימת התפוצה ✓</p>
            <p className="text-muted-foreground text-sm">לא תקבל מאיתנו עוד הודעות.</p>
          </div>
        )}

        {status === "already_unsubscribed" && (
          <div className="mt-6">
            <p className="text-muted-foreground">כבר הוסרת מרשימת התפוצה.</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-6">
            <p className="text-destructive">קישור לא תקין או שפג תוקפו.</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6">
            <p className="text-destructive">אירעה שגיאה. נסה שוב מאוחר יותר.</p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="text-primary text-sm hover:underline">
            חזרה לאתר
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
