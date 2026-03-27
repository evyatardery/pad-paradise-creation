import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, FileText, Printer, Loader2 } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { processOrder, type CreateOrderInput } from "@/utils/orderService";

type Status = "processing" | "success" | "error";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = "PADZONE – ההזמנה התקבלה!";
  }, []);
  const [status, setStatus] = useState<Status>("processing");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderFormBlob, setOrderFormBlob] = useState<Blob | null>(null);
  const [printFileBlob, setPrintFileBlob] = useState<Blob | null>(null);
  const [printFilename, setPrintFilename] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOrder = useCallback(async () => {
    try {
      // In production, order data comes from payment callback / session storage
      const orderDataStr = sessionStorage.getItem("pendingOrder");
      if (!orderDataStr) {
        setErrorMsg("לא נמצאו פרטי הזמנה. חזור לחנות ונסה שוב.");
        setStatus("error");
        return;
      }

      const orderInput: CreateOrderInput = JSON.parse(orderDataStr);
      // Add payment transaction ID from URL params (from GROW callback)
      orderInput.paymentTransactionId = searchParams.get("transaction_id") || undefined;

      const result = await processOrder(orderInput);

      setOrderNumber(result.orderNumber);
      setOrderFormBlob(result.orderFormBlob);
      setPrintFileBlob(result.printFileBlob);
      setPrintFilename(result.printFilename);
      setStatus("success");

      // Clear pending order
      sessionStorage.removeItem("pendingOrder");
    } catch (err) {
      console.error("Order processing failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "שגיאה בעיבוד ההזמנה");
      setStatus("error");
    }
  }, [searchParams]);

  useEffect(() => {
    handleOrder();
  }, [handleOrder]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-card rounded-2xl p-8 border border-border shadow-xl"
      >
        {status === "processing" && (
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto text-primary animate-spin" size={48} />
            <h1 className="text-2xl font-bold text-card-foreground">מעבד את ההזמנה...</h1>
            <p className="text-muted-foreground">מייצר קובץ הדפסה וטופס הזמנה</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle className="mx-auto text-primary" size={64} />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-card-foreground">ההזמנה התקבלה! 🎉</h1>
              <p className="text-primary font-mono text-lg mt-2">{orderNumber}</p>
            </div>

            <p className="text-muted-foreground">
              קובצי ההזמנה וההדפסה נוצרו בהצלחה ונשמרו במערכת.
            </p>

            {/* Download buttons */}
            <div className="space-y-3">
              {orderFormBlob && (
                <button
                  onClick={() => downloadBlob(orderFormBlob, `order-${orderNumber}.pdf`)}
                  className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <FileText size={20} />
                  הורד טופס הזמנה (PDF)
                </button>
              )}

              {printFileBlob && (
                <button
                  onClick={() => downloadBlob(printFileBlob, printFilename)}
                  className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <Printer size={20} />
                  הורד קובץ הדפסה (300 DPI)
                </button>
              )}

              <button
                onClick={() => {
                  if (orderFormBlob) downloadBlob(orderFormBlob, `order-${orderNumber}.pdf`);
                  if (printFileBlob) downloadBlob(printFileBlob, printFilename);
                }}
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors neon-box"
              >
                <Download size={20} />
                הורד את כל הקבצים
              </button>
            </div>

            <Link
              to="/"
              className="block text-primary hover:underline font-semibold mt-4"
            >
              ← חזרה לחנות
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <div className="text-destructive text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-card-foreground">שגיאה</h1>
            <p className="text-muted-foreground">{errorMsg}</p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors"
            >
              חזרה לחנות
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
