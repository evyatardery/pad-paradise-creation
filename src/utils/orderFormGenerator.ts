/**
 * OrderFormGenerator — creates a PDF order form with customer and product details.
 * Uses jsPDF with embedded Heebo font for proper Hebrew/RTL support.
 */
import jsPDF from "jspdf";
import { heeboRegularBase64 } from "./heeboFont";

export interface OrderFormData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  designName: string;
  dimensions: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCustomDesign: boolean;
  customText?: string;
}

/** Reverse Hebrew/RTL text for jsPDF rendering (jsPDF doesn't support RTL natively) */
function reverseHebrew(text: string): string {
  // Split into segments: Hebrew vs LTR (numbers, latin, symbols)
  const segments: { text: string; isRTL: boolean }[] = [];
  let current = "";
  let currentIsRTL = false;

  for (const char of text) {
    const code = char.charCodeAt(0);
    const isHebrew = code >= 0x0590 && code <= 0x05FF;
    const isSpace = char === " ";

    if (current === "") {
      current = char;
      currentIsRTL = isHebrew;
    } else if (isSpace || isHebrew === currentIsRTL) {
      current += char;
    } else {
      segments.push({ text: current, isRTL: currentIsRTL });
      current = char;
      currentIsRTL = isHebrew;
    }
  }
  if (current) segments.push({ text: current, isRTL: currentIsRTL });

  // Reverse segment order and reverse Hebrew segments internally
  const reversed = segments.reverse().map((s) =>
    s.isRTL ? s.text.split("").reverse().join("") : s.text
  );

  return reversed.join("");
}

export function generateOrderFormPDF(data: OrderFormData): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Embed Heebo font for Hebrew support
  doc.addFileToVFS("Heebo-Regular.ttf", heeboRegularBase64);
  doc.addFont("Heebo-Regular.ttf", "Heebo", "normal");
  doc.setFont("Heebo", "normal");

  const pageW = doc.internal.pageSize.getWidth();

  // Helper: draw right-aligned Hebrew text
  const drawHe = (text: string, x: number, y: number, opts?: { align?: string }) => {
    doc.text(reverseHebrew(text), x, y, opts as any);
  };

  // Header
  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(0, 255, 136);
  doc.setFontSize(28);
  doc.text("PADZONE", pageW / 2, 18, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  drawHe("טופס הזמנה", pageW / 2, 30, { align: "center" });

  // Order info
  doc.setTextColor(50, 50, 50);
  let y = 55;

  const addSection = (title: string) => {
    doc.setFillColor(0, 255, 136);
    doc.rect(pageW - 18, y - 4, 3, 8, "F");
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 30);
    drawHe(title, pageW - 22, y + 2, { align: "right" });
    y += 12;
  };

  const addRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    drawHe(label, pageW - 22, y, { align: "right" });
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    // Values with numbers/latin stay LTR
    const isLatin = /^[a-zA-Z0-9@.\-_+:/, ₪✓]+$/.test(value);
    if (isLatin) {
      doc.text(value, pageW - 75, y);
    } else {
      drawHe(value, pageW - 75, y, { align: "right" });
    }
    y += 8;
  };

  // Order Details
  addSection("פרטי הזמנה");
  addRow("מספר הזמנה:", data.orderNumber);
  addRow("תאריך:", data.orderDate);
  addRow("סטטוס:", "שולם ✓");
  y += 5;

  // Customer Details
  addSection("פרטי לקוח");
  addRow("שם מלא:", data.customerName);
  if (data.customerEmail) addRow("אימייל:", data.customerEmail);
  addRow("טלפון:", data.customerPhone);
  addRow("כתובת משלוח:", data.shippingAddress);
  y += 5;

  // Product Specs
  addSection("מפרט מוצר");
  addRow("עיצוב:", data.designName);
  addRow("מידות:", data.dimensions);
  addRow("כמות:", data.quantity.toString());
  if (data.isCustomDesign) {
    addRow("סוג:", "עיצוב מותאם אישית");
    if (data.customText) addRow("טקסט:", data.customText);
  }
  y += 5;

  // Pricing
  addSection("תמחור");
  addRow("מחיר ליחידה:", `₪${data.unitPrice}`);
  addRow("כמות:", data.quantity.toString());

  // Total line
  y += 3;
  doc.setDrawColor(0, 255, 136);
  doc.setLineWidth(0.5);
  doc.line(22, y, pageW - 22, y);
  y += 8;
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 30);
  drawHe("סה״כ:", pageW - 22, y, { align: "right" });
  doc.setTextColor(0, 180, 100);
  doc.text(`₪${data.totalPrice}`, 22, y);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("PADZONE — Custom Gaming Mousepads", pageW / 2, footerY, { align: "center" });
  doc.text(`Generated: ${new Date().toISOString()}`, pageW / 2, footerY + 5, { align: "center" });

  return doc.output("blob");
}
