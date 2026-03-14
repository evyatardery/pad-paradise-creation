import { useState } from "react";
import { generatePrintFile } from "@/utils/printFileGenerator";
import { generateOrderFormPDF } from "@/utils/orderFormGenerator";
import { Download, FileText, Printer, Loader2 } from "lucide-react";

// Use one of the existing pad images
import sampleDesign from "@/assets/pads/anime-itachi.png";

const TestSample = () => {
  const [loading, setLoading] = useState(false);
  const [orderFormBlob, setOrderFormBlob] = useState<Blob | null>(null);
  const [printBlob, setPrintBlob] = useState<Blob | null>(null);
  const [printFilename, setPrintFilename] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      // 1. Generate print file with sample design
      const printResult = await generatePrintFile({
        designImageSrc: sampleDesign,
        dimensionLabel: "XL 80x30",
        overlayText: "PADZONE SAMPLE",
        overlayFont: "Arial",
        overlayAlign: "center",
      });

      setPrintBlob(printResult.blob);
      setPrintFilename(printResult.filename);
      setPreviewUrl(printResult.canvas.toDataURL("image/png", 0.3));

      // 2. Generate order form PDF with dummy data
      const formBlob = generateOrderFormPDF({
        orderNumber: "PZ-2026-00042",
        orderDate: "14/03/2026",
        customerName: "ישראל ישראלי",
        customerEmail: "israel@example.com",
        customerPhone: "054-1234567",
        shippingAddress: "רחוב הרצל 42, תל אביב, 6120101",
        designName: "Itachi Uchiha — Anime Collection",
        dimensions: "XL 80x30 ס״מ",
        quantity: 2,
        unitPrice: 89,
        totalPrice: 178,
        isCustomDesign: false,
      });

      setOrderFormBlob(formBlob);
    } catch (err) {
      console.error(err);
      alert("שגיאה ביצירת הקבצים: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">🧪 דוגמת קבצי הזמנה</h1>
          <p className="text-muted-foreground">יצירת טופס הזמנה + קובץ הדפסה לדוגמה עם פרטים בדויים</p>
        </div>

        {!orderFormBlob && (
          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                מייצר קבצים...
              </>
            ) : (
              "🚀 צור קבצים לדוגמה"
            )}
          </button>
        )}

        {orderFormBlob && printBlob && (
          <div className="space-y-6">
            {/* Print preview */}
            {previewUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                <p className="bg-card text-card-foreground text-sm font-semibold px-4 py-2 border-b border-border">
                  📐 תצוגה מקדימה של קובץ ההדפסה (300 DPI, בליד 5mm, סימני חיתוך)
                </p>
                <img src={previewUrl} alt="Print preview" className="w-full" />
              </div>
            )}

            {/* Download buttons */}
            <div className="space-y-3">
              <button
                onClick={() => downloadBlob(orderFormBlob, "order-PZ-2026-00042.pdf")}
                className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <FileText size={20} />
                📄 הורד טופס הזמנה (PDF)
              </button>

              <button
                onClick={() => downloadBlob(printBlob, printFilename)}
                className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <Printer size={20} />
                🖨️ הורד קובץ הדפסה (300 DPI PNG)
              </button>

              <button
                onClick={() => {
                  downloadBlob(orderFormBlob, "order-PZ-2026-00042.pdf");
                  downloadBlob(printBlob, printFilename);
                }}
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Download size={20} />
                ⬇️ הורד הכל
              </button>
            </div>

            {/* Sample data info */}
            <div className="bg-card rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-bold text-card-foreground">פרטי הדוגמה:</p>
              <p>שם: ישראל ישראלי | טלפון: 054-1234567</p>
              <p>כתובת: רחוב הרצל 42, תל אביב</p>
              <p>עיצוב: Itachi Uchiha — Anime Collection</p>
              <p>מידה: XL 80x30 ס״מ | כמות: 2 | סה״כ: ₪178</p>
              <p>מספר הזמנה: PZ-2026-00042</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSample;
