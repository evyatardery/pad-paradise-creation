/**
 * OrderFormGenerator — creates a PDF order form with customer and product details.
 * Uses jsPDF for PDF generation.
 */
import jsPDF from "jspdf";

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

export function generateOrderFormPDF(data: OrderFormData): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(0, 255, 136);
  doc.setFontSize(28);
  doc.text("PADZONE", pageW / 2, 18, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  doc.text("Order Form", pageW / 2, 30, { align: "center" });

  // Order info
  doc.setTextColor(50, 50, 50);
  let y = 55;

  const addSection = (title: string) => {
    doc.setFillColor(0, 255, 136);
    doc.rect(15, y - 4, 3, 8, "F");
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 30);
    doc.text(title, 22, y + 2);
    y += 12;
  };

  const addRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(label, 22, y);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.text(value, 70, y);
    y += 8;
  };

  // Order Details
  addSection("Order Details");
  addRow("Order Number:", data.orderNumber);
  addRow("Date:", data.orderDate);
  addRow("Status:", "Paid ✓");
  y += 5;

  // Customer Details
  addSection("Customer Details");
  addRow("Full Name:", data.customerName);
  if (data.customerEmail) addRow("Email:", data.customerEmail);
  addRow("Phone:", data.customerPhone);
  addRow("Shipping Address:", data.shippingAddress);
  y += 5;

  // Product Specs
  addSection("Product Specifications");
  addRow("Design:", data.designName);
  addRow("Dimensions:", data.dimensions);
  addRow("Quantity:", data.quantity.toString());
  if (data.isCustomDesign) {
    addRow("Type:", "Custom Design");
    if (data.customText) addRow("Custom Text:", data.customText);
  }
  y += 5;

  // Pricing
  addSection("Pricing");
  addRow("Unit Price:", `₪${data.unitPrice}`);
  addRow("Quantity:", data.quantity.toString());

  // Total line
  y += 3;
  doc.setDrawColor(0, 255, 136);
  doc.setLineWidth(0.5);
  doc.line(22, y, pageW - 22, y);
  y += 8;
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 30);
  doc.text("Total:", 22, y);
  doc.setTextColor(0, 180, 100);
  doc.text(`₪${data.totalPrice}`, pageW - 22, y, { align: "right" });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("PADZONE — Custom Gaming Mousepads", pageW / 2, footerY, { align: "center" });
  doc.text(`Generated: ${new Date().toISOString()}`, pageW / 2, footerY + 5, { align: "center" });

  return doc.output("blob");
}
