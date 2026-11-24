// supabase/functions/send-transactional-email/index.ts
import * as React5 from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { createClient } from "npm:@supabase/supabase-js@2";

// supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Button,
  Link
} from "npm:@react-email/components@0.0.22";
var TIKTOK_URL = "https://www.tiktok.com/@padzone.il";
var OrderConfirmationEmail = ({
  customerName = "\u05DC\u05E7\u05D5\u05D7/\u05D4 \u05D9\u05E7\u05E8/\u05D4",
  orderNumber = "",
  designName = "",
  dimensions = "",
  quantity = 1,
  totalPrice = 0,
  paymentLink = ""
}) => /* @__PURE__ */ React.createElement(Html, { lang: "he", dir: "rtl" }, /* @__PURE__ */ React.createElement(Head, null), /* @__PURE__ */ React.createElement(Preview, null, "\u05EA\u05EA\u05D7\u05D3\u05E9\u05D5! \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DB\u05DD \u05DE-PadZone \u05D1\u05D3\u05E8\u05DA \u05DC\u05E2\u05DE\u05D3\u05D4 \u{1F3AE}"), /* @__PURE__ */ React.createElement(Body, { style: main }, /* @__PURE__ */ React.createElement(Container, { style: container }, /* @__PURE__ */ React.createElement(Section, { style: header }, /* @__PURE__ */ React.createElement(Text, { style: logoText }, "PAD", /* @__PURE__ */ React.createElement("span", { style: logoAccent }, "Z"), "ONE")), /* @__PURE__ */ React.createElement(Section, { style: content }, /* @__PURE__ */ React.createElement(Heading, { style: h1 }, "\u05EA\u05EA\u05D7\u05D3\u05E9\u05D5! \u{1F3AE}"), /* @__PURE__ */ React.createElement(Text, { style: text }, "\u05D4\u05D9\u05D9 ", customerName, ", \u05DB\u05D0\u05DF \u05D0\u05E1\u05E3 \u05DE-PadZone."), /* @__PURE__ */ React.createElement(Text, { style: text }, "\u05EA\u05D5\u05D3\u05D4 \u05E8\u05D1\u05D4 \u05E9\u05D1\u05D7\u05E8\u05EA \u05D1\u05E0\u05D5 \u05DC\u05E9\u05D3\u05E8\u05D5\u05D2 \u05D4\u05E2\u05DE\u05D3\u05D4 \u05E9\u05DC\u05DA! \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DA \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4 \u05D5\u05D0\u05E0\u05D7\u05E0\u05D5 \u05DB\u05D1\u05E8 \u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05DC\u05E2\u05D1\u05D5\u05D3 \u05E2\u05DC \u05D4\u05E4\u05D3 \u05E9\u05DC\u05DA \u05D1\u05DE\u05E4\u05E2\u05DC."), /* @__PURE__ */ React.createElement(Section, { style: orderBox }, /* @__PURE__ */ React.createElement(Text, { style: orderTitle }, "\u05E4\u05E8\u05D8\u05D9 \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4"), /* @__PURE__ */ React.createElement(Hr, { style: divider }), /* @__PURE__ */ React.createElement(Text, { style: orderDetail }, "\u05DE\u05E1\u05E4\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4: ", /* @__PURE__ */ React.createElement("strong", null, orderNumber)), /* @__PURE__ */ React.createElement(Text, { style: orderDetail }, "\u05D3\u05D2\u05DD: ", designName), /* @__PURE__ */ React.createElement(Text, { style: orderDetail }, "\u05D2\u05D5\u05D3\u05DC: ", dimensions), /* @__PURE__ */ React.createElement(Text, { style: orderDetail }, "\u05DB\u05DE\u05D5\u05EA: ", quantity), /* @__PURE__ */ React.createElement(Hr, { style: divider }), /* @__PURE__ */ React.createElement(Text, { style: orderTotal }, '\u05E1\u05D4"\u05DB: \u20AA', totalPrice)), paymentLink && /* @__PURE__ */ React.createElement(Section, { style: ctaSection }, /* @__PURE__ */ React.createElement(Button, { href: paymentLink, style: ctaButton }, "\u{1F4B3} \u05DC\u05D7\u05E6\u05D5 \u05DB\u05D0\u05DF \u05DC\u05EA\u05E9\u05DC\u05D5\u05DD \u05DE\u05D0\u05D5\u05D1\u05D8\u05D7")), /* @__PURE__ */ React.createElement(Text, { style: text }, "\u05D1\u05E8\u05D2\u05E2 \u05E9\u05D4\u05D7\u05D1\u05D9\u05DC\u05D4 \u05EA\u05E6\u05D0 \u05DC\u05D3\u05E8\u05DA, \u05E0\u05E9\u05DC\u05D7 \u05DC\u05DA \u05E2\u05D3\u05DB\u05D5\u05DF \u05E0\u05D5\u05E1\u05E3."), /* @__PURE__ */ React.createElement(Text, { style: text }, "\u05D1\u05D9\u05E0\u05EA\u05D9\u05D9\u05DD, \u05D0\u05EA\u05DD \u05DE\u05D5\u05D6\u05DE\u05E0\u05D9\u05DD \u05DC\u05E2\u05E7\u05D5\u05D1 \u05D0\u05D7\u05E8\u05D9\u05E0\u05D5 \u05D1\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7 \u05D5\u05DC\u05E8\u05D0\u05D5\u05EA \u05D0\u05D9\u05DA \u05D0\u05E0\u05D7\u05E0\u05D5 \u05DE\u05DB\u05D9\u05E0\u05D9\u05DD \u05D0\u05EA \u05D4\u05E4\u05D3\u05D9\u05DD \u05E9\u05DC\u05DB\u05DD! \u{1F3AC}"), /* @__PURE__ */ React.createElement(Section, { style: ctaSection }, /* @__PURE__ */ React.createElement(Link, { href: TIKTOK_URL, style: tiktokLink }, "\u{1F3B5} \u05E2\u05E7\u05D1\u05D5 \u05D0\u05D7\u05E8\u05D9\u05E0\u05D5 \u05D1\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7"))), /* @__PURE__ */ React.createElement(Section, { style: footer }, /* @__PURE__ */ React.createElement(Text, { style: footerLogo }, "PAD", /* @__PURE__ */ React.createElement("span", { style: footerLogoAccent }, "Z"), "ONE"), /* @__PURE__ */ React.createElement(Text, { style: footerTagline }, "\u05E9\u05D3\u05E8\u05D5\u05D2 \u05D4\u05E2\u05DE\u05D3\u05D4 \u05E9\u05DC\u05DA \u05DE\u05EA\u05D7\u05D9\u05DC \u05DB\u05D0\u05DF"), /* @__PURE__ */ React.createElement(Section, { style: socialRow }, /* @__PURE__ */ React.createElement(Link, { href: TIKTOK_URL, style: socialLink }, "TikTok")), /* @__PURE__ */ React.createElement(Hr, { style: footerDivider }), /* @__PURE__ */ React.createElement(Link, { href: "https://padzone.co.il", style: footerLink }, "padzone.co.il")))));
var template = {
  component: OrderConfirmationEmail,
  subject: (data) => data.paymentLink ? `\u05D4\u05D6\u05DE\u05E0\u05EA\u05DA \u05DE-PadZone \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u2014 \u05DC\u05D7\u05E6\u05D5 \u05DC\u05EA\u05E9\u05DC\u05D5\u05DD \u{1F3AE}` : `\u05EA\u05EA\u05D7\u05D3\u05E9\u05D5! \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DB\u05DD \u05DE-PadZone \u05D1\u05D3\u05E8\u05DA \u05DC\u05E2\u05DE\u05D3\u05D4 \u{1F3AE}`,
  displayName: "\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4 \u05DC\u05DC\u05E7\u05D5\u05D7",
  previewData: {
    customerName: "\u05D9\u05E9\u05E8\u05D0\u05DC \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9",
    orderNumber: "PZ-00042",
    designName: "Cyber Red Blaze",
    dimensions: '90x40 \u05E1"\u05DE',
    quantity: 1,
    totalPrice: 129,
    paymentLink: ""
  }
};
var main = { backgroundColor: "#ffffff", fontFamily: "'Arial', 'Helvetica Neue', sans-serif" };
var container = { margin: "0 auto", maxWidth: "600px" };
var header = {
  backgroundColor: "#0a0a0a",
  padding: "30px 25px",
  textAlign: "center",
  borderRadius: "8px 8px 0 0"
};
var logoText = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0",
  letterSpacing: "3px"
};
var logoAccent = { color: "#00d4ff" };
var content = { padding: "30px 25px" };
var h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#0a0a0a",
  margin: "0 0 20px",
  textAlign: "right"
};
var text = {
  fontSize: "15px",
  color: "#333333",
  lineHeight: "1.7",
  margin: "0 0 16px",
  textAlign: "right"
};
var ctaSection = { textAlign: "center", margin: "24px 0" };
var ctaButton = {
  backgroundColor: "#00b8d9",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "16px 40px",
  borderRadius: "10px",
  textDecoration: "none",
  display: "inline-block"
};
var tiktokLink = {
  color: "#00b8d9",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "underline"
};
var orderBox = {
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  border: "1px solid #e0e0e0"
};
var orderTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#0a0a0a",
  margin: "0 0 10px",
  textAlign: "right"
};
var divider = { borderColor: "#e0e0e0", margin: "12px 0" };
var orderDetail = {
  fontSize: "14px",
  color: "#555555",
  margin: "6px 0",
  textAlign: "right"
};
var orderTotal = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#00b8d9",
  margin: "6px 0",
  textAlign: "right"
};
var footer = {
  backgroundColor: "#0a0a0a",
  padding: "25px",
  textAlign: "center",
  borderRadius: "0 0 8px 8px"
};
var footerLogo = {
  fontSize: "20px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0 0 6px",
  letterSpacing: "2px"
};
var footerLogoAccent = { color: "#00d4ff" };
var footerTagline = { fontSize: "12px", color: "#aaaaaa", margin: "0 0 12px" };
var socialRow = { textAlign: "center", margin: "8px 0 12px" };
var socialLink = { color: "#00d4ff", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
var footerDivider = { borderColor: "#333333", margin: "12px 0" };
var footerLink = { fontSize: "12px", color: "#00d4ff", textDecoration: "none" };

// supabase/functions/_shared/transactional-email-templates/admin-order-notification.tsx
import * as React2 from "npm:react@18.3.1";
import {
  Body as Body2,
  Container as Container2,
  Head as Head2,
  Heading as Heading2,
  Html as Html2,
  Preview as Preview2,
  Text as Text2,
  Section as Section2,
  Hr as Hr2,
  Link as Link2
} from "npm:@react-email/components@0.0.22";
var ADMIN_EMAIL = "evyatardery@gmail.com";
var TIKTOK_URL2 = "https://www.tiktok.com/@padzone.il";
var PAYMENT_METHOD_LABELS = {
  bit: "\u{1F499} \u05D1\u05D9\u05D8",
  paybox: "\u{1F7E2} \u05E4\u05D9\u05D9\u05D1\u05D5\u05E7\u05E1",
  credit: "\u{1F4B3} \u05D0\u05E9\u05E8\u05D0\u05D9"
};
var AdminOrderNotificationEmail = ({
  orderNumber = "",
  designName = "",
  designId = "",
  dimensions = "",
  quantity = 1,
  totalPrice = 0,
  customerName = "",
  customerPhone = "",
  customerEmail = "",
  shippingAddress = "",
  paymentMethod = "",
  paymentLink = "",
  printFileUrl = "",
  orderFormUrl = ""
}) => /* @__PURE__ */ React2.createElement(Html2, { lang: "he", dir: "rtl" }, /* @__PURE__ */ React2.createElement(Head2, null), /* @__PURE__ */ React2.createElement(Preview2, null, "\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D7\u05D3\u05E9\u05D4 \u05D1\u05D0\u05EA\u05E8 PadZone! #", orderNumber), /* @__PURE__ */ React2.createElement(Body2, { style: main2 }, /* @__PURE__ */ React2.createElement(Container2, { style: container2 }, /* @__PURE__ */ React2.createElement(Section2, { style: header2 }, /* @__PURE__ */ React2.createElement(Text2, { style: logoText2 }, "PAD", /* @__PURE__ */ React2.createElement("span", { style: logoAccent2 }, "Z"), "ONE \u2014 \u05D4\u05D6\u05DE\u05E0\u05D4 \u05D7\u05D3\u05E9\u05D4!")), /* @__PURE__ */ React2.createElement(Section2, { style: content2 }, /* @__PURE__ */ React2.createElement(Heading2, { style: h12 }, "\u{1F389} \u05D0\u05D1\u05D9\u05EA\u05E8, \u05D9\u05E9 \u05E2\u05D1\u05D5\u05D3\u05D4!"), /* @__PURE__ */ React2.createElement(Text2, { style: text2 }, "\u05DC\u05E7\u05D5\u05D7 \u05D7\u05D3\u05E9 \u05D1\u05D9\u05E6\u05E2 \u05D4\u05D6\u05DE\u05E0\u05D4."), /* @__PURE__ */ React2.createElement(Section2, { style: detailBox }, /* @__PURE__ */ React2.createElement(Text2, { style: sectionTitle }, "\u05E4\u05E8\u05D8\u05D9 \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4"), /* @__PURE__ */ React2.createElement(Hr2, { style: divider2 }), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DE\u05E1\u05E4\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4: ", /* @__PURE__ */ React2.createElement("strong", null, orderNumber)), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05D3\u05D2\u05DD: ", /* @__PURE__ */ React2.createElement("strong", null, designName)), designId ? /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ", designId) : null, /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05D2\u05D5\u05D3\u05DC: ", dimensions), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DB\u05DE\u05D5\u05EA: ", quantity), /* @__PURE__ */ React2.createElement(Text2, { style: detailHighlight }, '\u05E1\u05D4"\u05DB: \u20AA', totalPrice)), /* @__PURE__ */ React2.createElement(Section2, { style: detailBox }, /* @__PURE__ */ React2.createElement(Text2, { style: sectionTitle }, "\u05E4\u05E8\u05D8\u05D9 \u05DC\u05E7\u05D5\u05D7"), /* @__PURE__ */ React2.createElement(Hr2, { style: divider2 }), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05E9\u05DD: ", customerName), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05D8\u05DC\u05E4\u05D5\u05DF: ", customerPhone), customerEmail ? /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DE\u05D9\u05D9\u05DC: ", customerEmail) : null, /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DB\u05EA\u05D5\u05D1\u05EA \u05DC\u05DE\u05E9\u05DC\u05D5\u05D7: ", shippingAddress)), /* @__PURE__ */ React2.createElement(Section2, { style: detailBox }, /* @__PURE__ */ React2.createElement(Text2, { style: sectionTitle }, "\u05EA\u05E9\u05DC\u05D5\u05DD"), /* @__PURE__ */ React2.createElement(Hr2, { style: divider2 }), /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05D0\u05DE\u05E6\u05E2\u05D9 \u05EA\u05E9\u05DC\u05D5\u05DD: ", PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || "\u05DC\u05D0 \u05E0\u05D1\u05D7\u05E8"), paymentLink ? /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05DC\u05D9\u05E0\u05E7 \u05EA\u05E9\u05DC\u05D5\u05DD: ", /* @__PURE__ */ React2.createElement(Link2, { href: paymentLink, style: fileLink }, paymentLink)) : null), (printFileUrl || orderFormUrl) && /* @__PURE__ */ React2.createElement(Section2, { style: detailBox }, /* @__PURE__ */ React2.createElement(Text2, { style: sectionTitle }, "\u05E7\u05D1\u05E6\u05D9\u05DD"), /* @__PURE__ */ React2.createElement(Hr2, { style: divider2 }), printFileUrl ? /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05E7\u05D5\u05D1\u05E5 \u05D4\u05D3\u05E4\u05E1\u05D4: ", /* @__PURE__ */ React2.createElement(Link2, { href: printFileUrl, style: fileLink }, "\u05D4\u05D5\u05E8\u05D3 PDF")) : null, orderFormUrl ? /* @__PURE__ */ React2.createElement(Text2, { style: detail }, "\u05D8\u05D5\u05E4\u05E1 \u05D4\u05D6\u05DE\u05E0\u05D4: ", /* @__PURE__ */ React2.createElement(Link2, { href: orderFormUrl, style: fileLink }, "\u05D4\u05D5\u05E8\u05D3 PDF")) : null)), /* @__PURE__ */ React2.createElement(Section2, { style: footer2 }, /* @__PURE__ */ React2.createElement(Text2, { style: footerLogo2 }, "PAD", /* @__PURE__ */ React2.createElement("span", { style: footerLogoAccent2 }, "Z"), "ONE"), /* @__PURE__ */ React2.createElement(Text2, { style: footerTagline2 }, "\u05E9\u05D3\u05E8\u05D5\u05D2 \u05D4\u05E2\u05DE\u05D3\u05D4 \u05E9\u05DC\u05DA \u05DE\u05EA\u05D7\u05D9\u05DC \u05DB\u05D0\u05DF"), /* @__PURE__ */ React2.createElement(Section2, { style: socialRow2 }, /* @__PURE__ */ React2.createElement(Link2, { href: TIKTOK_URL2, style: socialLink2 }, "TikTok")), /* @__PURE__ */ React2.createElement(Hr2, { style: footerDivider2 }), /* @__PURE__ */ React2.createElement(Link2, { href: "https://padzone.co.il", style: footerLink2 }, "padzone.co.il")))));
var template2 = {
  component: AdminOrderNotificationEmail,
  subject: (data) => `\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D7\u05D3\u05E9\u05D4 \u05D1\u05D0\u05EA\u05E8 PadZone! #${data.orderNumber || ""}`,
  displayName: "\u05D4\u05EA\u05E8\u05D0\u05EA \u05D4\u05D6\u05DE\u05E0\u05D4 \u05DC\u05D0\u05D3\u05DE\u05D9\u05DF",
  to: ADMIN_EMAIL,
  previewData: {
    orderNumber: "PZ-00042",
    designName: "Cyber Red Blaze",
    designId: "cyber-red-blaze",
    dimensions: '90x40 \u05E1"\u05DE',
    quantity: 1,
    totalPrice: 129,
    customerName: "\u05D9\u05E9\u05E8\u05D0\u05DC \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9",
    customerPhone: "050-1234567",
    customerEmail: "test@example.com",
    shippingAddress: "\u05E8\u05D7\u05D5\u05D1 \u05D4\u05E8\u05E6\u05DC 1, \u05EA\u05DC \u05D0\u05D1\u05D9\u05D1",
    paymentMethod: "bit",
    paymentLink: "https://app.onelink.me/lmJd/bit?phone=0524796790",
    printFileUrl: "https://example.com/print.pdf",
    orderFormUrl: "https://example.com/order-form.pdf"
  }
};
var main2 = { backgroundColor: "#ffffff", fontFamily: "'Arial', 'Helvetica Neue', sans-serif" };
var container2 = { margin: "0 auto", maxWidth: "600px" };
var header2 = {
  backgroundColor: "#0a0a0a",
  padding: "25px",
  textAlign: "center",
  borderRadius: "8px 8px 0 0"
};
var logoText2 = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0",
  letterSpacing: "2px"
};
var logoAccent2 = { color: "#00d4ff" };
var content2 = { padding: "25px" };
var h12 = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#0a0a0a",
  margin: "0 0 16px",
  textAlign: "right"
};
var text2 = {
  fontSize: "15px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0 0 16px",
  textAlign: "right"
};
var detailBox = {
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
  padding: "18px",
  margin: "16px 0",
  border: "1px solid #e0e0e0"
};
var sectionTitle = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#0a0a0a",
  margin: "0 0 8px",
  textAlign: "right"
};
var divider2 = { borderColor: "#e0e0e0", margin: "10px 0" };
var detail = {
  fontSize: "14px",
  color: "#555555",
  margin: "5px 0",
  textAlign: "right"
};
var detailHighlight = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#00b8d9",
  margin: "8px 0 0",
  textAlign: "right"
};
var fileLink = { color: "#00b8d9", textDecoration: "underline" };
var footer2 = {
  backgroundColor: "#0a0a0a",
  padding: "25px",
  textAlign: "center",
  borderRadius: "0 0 8px 8px"
};
var footerLogo2 = {
  fontSize: "18px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0 0 6px",
  letterSpacing: "2px"
};
var footerLogoAccent2 = { color: "#00d4ff" };
var footerTagline2 = { fontSize: "11px", color: "#aaaaaa", margin: "0 0 10px" };
var socialRow2 = { textAlign: "center", margin: "6px 0 10px" };
var socialLink2 = { color: "#00d4ff", fontSize: "12px", textDecoration: "none", fontWeight: "bold" };
var footerDivider2 = { borderColor: "#333333", margin: "10px 0" };
var footerLink2 = { fontSize: "11px", color: "#00d4ff", textDecoration: "none" };

// supabase/functions/_shared/transactional-email-templates/payment-confirmed.tsx
import * as React3 from "npm:react@18.3.1";
import {
  Body as Body3,
  Container as Container3,
  Head as Head3,
  Heading as Heading3,
  Html as Html3,
  Preview as Preview3,
  Text as Text3,
  Section as Section3,
  Hr as Hr3,
  Link as Link3
} from "npm:@react-email/components@0.0.22";
var TIKTOK_URL3 = "https://www.tiktok.com/@padzone.il";
var PaymentConfirmedEmail = ({
  customerName = "\u05DC\u05E7\u05D5\u05D7/\u05D4 \u05D9\u05E7\u05E8/\u05D4",
  orderNumber = "",
  designName = "",
  dimensions = "",
  quantity = 1,
  totalPrice = 0,
  shippingAddress = ""
}) => /* @__PURE__ */ React3.createElement(Html3, { lang: "he", dir: "rtl" }, /* @__PURE__ */ React3.createElement(Head3, null), /* @__PURE__ */ React3.createElement(Preview3, null, "\u2705 \u05D4\u05EA\u05E9\u05DC\u05D5\u05DD \u05D4\u05EA\u05E7\u05D1\u05DC! \u05D4\u05E4\u05D3 \u05E9\u05DC\u05DA \u05D9\u05E6\u05D0 \u05DC\u05D9\u05D9\u05E6\u05D5\u05E8 \u{1F3AE}"), /* @__PURE__ */ React3.createElement(Body3, { style: main3 }, /* @__PURE__ */ React3.createElement(Container3, { style: container3 }, /* @__PURE__ */ React3.createElement(Section3, { style: header3 }, /* @__PURE__ */ React3.createElement(Text3, { style: logoText3 }, "PAD", /* @__PURE__ */ React3.createElement("span", { style: logoAccent3 }, "Z"), "ONE")), /* @__PURE__ */ React3.createElement(Section3, { style: content3 }, /* @__PURE__ */ React3.createElement(Heading3, { style: h13 }, "\u2705 \u05D4\u05EA\u05E9\u05DC\u05D5\u05DD \u05D4\u05EA\u05E7\u05D1\u05DC! \u{1F3AE}"), /* @__PURE__ */ React3.createElement(Text3, { style: text3 }, "\u05D4\u05D9\u05D9 ", customerName, ", \u05DB\u05D0\u05DF \u05D0\u05E1\u05E3 \u05DE-PadZone."), /* @__PURE__ */ React3.createElement(Text3, { style: text3 }, "\u05D4\u05EA\u05E9\u05DC\u05D5\u05DD \u05E9\u05DC\u05DA \u05D4\u05EA\u05E7\u05D1\u05DC \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4 \u05D5\u05D4\u05E4\u05D3 \u05E9\u05DC\u05DA \u05D9\u05E6\u05D0 \u05DC\u05D9\u05D9\u05E6\u05D5\u05E8! \u05D0\u05E0\u05D7\u05E0\u05D5 \u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05DC\u05E2\u05D1\u05D5\u05D3 \u05E2\u05DC \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DA \u05E2\u05DB\u05E9\u05D9\u05D5."), /* @__PURE__ */ React3.createElement(Section3, { style: orderBox2 }, /* @__PURE__ */ React3.createElement(Text3, { style: orderTitle2 }, "\u05E4\u05E8\u05D8\u05D9 \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4"), /* @__PURE__ */ React3.createElement(Hr3, { style: divider3 }), /* @__PURE__ */ React3.createElement(Text3, { style: orderDetail2 }, "\u05DE\u05E1\u05E4\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4: ", /* @__PURE__ */ React3.createElement("strong", null, orderNumber)), /* @__PURE__ */ React3.createElement(Text3, { style: orderDetail2 }, "\u05D3\u05D2\u05DD: ", designName), /* @__PURE__ */ React3.createElement(Text3, { style: orderDetail2 }, "\u05D2\u05D5\u05D3\u05DC: ", dimensions), /* @__PURE__ */ React3.createElement(Text3, { style: orderDetail2 }, "\u05DB\u05DE\u05D5\u05EA: ", quantity), /* @__PURE__ */ React3.createElement(Hr3, { style: divider3 }), /* @__PURE__ */ React3.createElement(Text3, { style: orderTotal2 }, '\u05E1\u05D4"\u05DB: \u20AA', totalPrice)), /* @__PURE__ */ React3.createElement(Section3, { style: orderBox2 }, /* @__PURE__ */ React3.createElement(Text3, { style: orderTitle2 }, "\u05DB\u05EA\u05D5\u05D1\u05EA \u05DC\u05DE\u05E9\u05DC\u05D5\u05D7"), /* @__PURE__ */ React3.createElement(Hr3, { style: divider3 }), /* @__PURE__ */ React3.createElement(Text3, { style: orderDetail2 }, shippingAddress)), /* @__PURE__ */ React3.createElement(Text3, { style: text3 }, "\u05D1\u05E8\u05D2\u05E2 \u05E9\u05D4\u05D7\u05D1\u05D9\u05DC\u05D4 \u05EA\u05E6\u05D0 \u05DC\u05D3\u05E8\u05DA, \u05E0\u05E9\u05DC\u05D7 \u05DC\u05DA \u05E2\u05D3\u05DB\u05D5\u05DF \u05E0\u05D5\u05E1\u05E3."), /* @__PURE__ */ React3.createElement(Text3, { style: text3 }, "\u05D1\u05D9\u05E0\u05EA\u05D9\u05D9\u05DD, \u05D0\u05EA\u05DD \u05DE\u05D5\u05D6\u05DE\u05E0\u05D9\u05DD \u05DC\u05E2\u05E7\u05D5\u05D1 \u05D0\u05D7\u05E8\u05D9\u05E0\u05D5 \u05D1\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7! \u{1F3AC}"), /* @__PURE__ */ React3.createElement(Section3, { style: ctaSection2 }, /* @__PURE__ */ React3.createElement(Link3, { href: TIKTOK_URL3, style: tiktokLink2 }, "\u{1F3B5} \u05E2\u05E7\u05D1\u05D5 \u05D0\u05D7\u05E8\u05D9\u05E0\u05D5 \u05D1\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7"))), /* @__PURE__ */ React3.createElement(Section3, { style: footer3 }, /* @__PURE__ */ React3.createElement(Text3, { style: footerLogo3 }, "PAD", /* @__PURE__ */ React3.createElement("span", { style: footerLogoAccent3 }, "Z"), "ONE"), /* @__PURE__ */ React3.createElement(Text3, { style: footerTagline3 }, "\u05E9\u05D3\u05E8\u05D5\u05D2 \u05D4\u05E2\u05DE\u05D3\u05D4 \u05E9\u05DC\u05DA \u05DE\u05EA\u05D7\u05D9\u05DC \u05DB\u05D0\u05DF"), /* @__PURE__ */ React3.createElement(Hr3, { style: footerDivider3 }), /* @__PURE__ */ React3.createElement(Link3, { href: "https://padzone.co.il", style: footerLink3 }, "padzone.co.il")))));
var template3 = {
  component: PaymentConfirmedEmail,
  subject: "\u2705 \u05D4\u05EA\u05E9\u05DC\u05D5\u05DD \u05D4\u05EA\u05E7\u05D1\u05DC! \u05D4\u05E4\u05D3 \u05E9\u05DC\u05DA \u05D9\u05E6\u05D0 \u05DC\u05D9\u05D9\u05E6\u05D5\u05E8 \u{1F3AE}",
  displayName: "\u05D0\u05D9\u05E9\u05D5\u05E8 \u05EA\u05E9\u05DC\u05D5\u05DD \u05DC\u05DC\u05E7\u05D5\u05D7",
  previewData: {
    customerName: "\u05D9\u05E9\u05E8\u05D0\u05DC \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9",
    orderNumber: "PZ-00042",
    designName: "Cyber Red Blaze",
    dimensions: '90x40 \u05E1"\u05DE',
    quantity: 1,
    totalPrice: 129,
    shippingAddress: "\u05E8\u05D7\u05D5\u05D1 \u05D4\u05E8\u05E6\u05DC 1, \u05EA\u05DC \u05D0\u05D1\u05D9\u05D1"
  }
};
var main3 = { backgroundColor: "#ffffff", fontFamily: "'Arial', 'Helvetica Neue', sans-serif" };
var container3 = { margin: "0 auto", maxWidth: "600px" };
var header3 = { backgroundColor: "#0a0a0a", padding: "30px 25px", textAlign: "center", borderRadius: "8px 8px 0 0" };
var logoText3 = { fontSize: "28px", fontWeight: "800", color: "#ffffff", margin: "0", letterSpacing: "3px" };
var logoAccent3 = { color: "#00d4ff" };
var content3 = { padding: "30px 25px" };
var h13 = { fontSize: "24px", fontWeight: "bold", color: "#0a0a0a", margin: "0 0 20px", textAlign: "right" };
var text3 = { fontSize: "15px", color: "#333333", lineHeight: "1.7", margin: "0 0 16px", textAlign: "right" };
var ctaSection2 = { textAlign: "center", margin: "24px 0" };
var tiktokLink2 = { color: "#00b8d9", fontSize: "15px", fontWeight: "bold", textDecoration: "underline" };
var orderBox2 = { backgroundColor: "#f7f7f7", borderRadius: "8px", padding: "20px", margin: "20px 0", border: "1px solid #e0e0e0" };
var orderTitle2 = { fontSize: "16px", fontWeight: "bold", color: "#0a0a0a", margin: "0 0 10px", textAlign: "right" };
var divider3 = { borderColor: "#e0e0e0", margin: "12px 0" };
var orderDetail2 = { fontSize: "14px", color: "#555555", margin: "6px 0", textAlign: "right" };
var orderTotal2 = { fontSize: "18px", fontWeight: "bold", color: "#00b8d9", margin: "6px 0", textAlign: "right" };
var footer3 = { backgroundColor: "#0a0a0a", padding: "25px", textAlign: "center", borderRadius: "0 0 8px 8px" };
var footerLogo3 = { fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "0 0 6px", letterSpacing: "2px" };
var footerLogoAccent3 = { color: "#00d4ff" };
var footerTagline3 = { fontSize: "12px", color: "#aaaaaa", margin: "0 0 12px" };
var footerDivider3 = { borderColor: "#333333", margin: "12px 0" };
var footerLink3 = { fontSize: "12px", color: "#00d4ff", textDecoration: "none" };

// supabase/functions/_shared/transactional-email-templates/factory-order.tsx
import * as React4 from "npm:react@18.3.1";
import {
  Body as Body4,
  Container as Container4,
  Head as Head4,
  Heading as Heading4,
  Html as Html4,
  Preview as Preview4,
  Text as Text4,
  Section as Section4,
  Hr as Hr4
} from "npm:@react-email/components@0.0.22";
var FactoryOrderEmail = ({
  orderNumber = "",
  designId = "",
  designName = "",
  dimensions = "",
  quantity = 1,
  customerName = ""
}) => /* @__PURE__ */ React4.createElement(Html4, { lang: "he", dir: "rtl" }, /* @__PURE__ */ React4.createElement(Head4, null), /* @__PURE__ */ React4.createElement(Preview4, null, "\u05D4\u05D6\u05DE\u05E0\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8 \u05D7\u05D3\u05E9\u05D4 | PadZone #", orderNumber), /* @__PURE__ */ React4.createElement(Body4, { style: main4 }, /* @__PURE__ */ React4.createElement(Container4, { style: container4 }, /* @__PURE__ */ React4.createElement(Section4, { style: header4 }, /* @__PURE__ */ React4.createElement(Text4, { style: logoText4 }, "PadZone \u2014 \u05D4\u05D6\u05DE\u05E0\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8")), /* @__PURE__ */ React4.createElement(Section4, { style: content4 }, /* @__PURE__ */ React4.createElement(Heading4, { style: h14 }, "\u05D4\u05D6\u05DE\u05E0\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8 \u05D7\u05D3\u05E9\u05D4"), /* @__PURE__ */ React4.createElement(Section4, { style: detailBox2 }, /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05DE\u05E1\u05E4\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4: ", /* @__PURE__ */ React4.createElement("strong", null, orderNumber)), /* @__PURE__ */ React4.createElement(Hr4, { style: divider4 }), /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ", /* @__PURE__ */ React4.createElement("strong", null, designId || "\u2014")), /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05E9\u05DD \u05E2\u05D9\u05E6\u05D5\u05D1: ", designName), /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05D2\u05D5\u05D3\u05DC: ", dimensions), /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05DB\u05DE\u05D5\u05EA: ", quantity), /* @__PURE__ */ React4.createElement(Hr4, { style: divider4 }), /* @__PURE__ */ React4.createElement(Text4, { style: detail2 }, "\u05E9\u05DD \u05DC\u05E7\u05D5\u05D7: ", customerName))))));
var template4 = {
  component: FactoryOrderEmail,
  subject: (data) => `\u05D4\u05D6\u05DE\u05E0\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8 \u05D7\u05D3\u05E9\u05D4 | PadZone #${data.orderNumber || ""}`,
  displayName: "\u05D4\u05D6\u05DE\u05E0\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8 \u05DC\u05DE\u05E4\u05E2\u05DC",
  previewData: {
    orderNumber: "PZ-00042",
    designId: "cyber-red-blaze",
    designName: "Cyber Red Blaze",
    dimensions: '90x40 \u05E1"\u05DE',
    quantity: 1,
    customerName: "\u05D9\u05E9\u05E8\u05D0\u05DC \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9"
  }
};
var main4 = { backgroundColor: "#ffffff", fontFamily: "'Arial', 'Helvetica Neue', sans-serif" };
var container4 = { margin: "0 auto", maxWidth: "600px" };
var header4 = { backgroundColor: "#0a0a0a", padding: "20px", textAlign: "center", borderRadius: "8px 8px 0 0" };
var logoText4 = { fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "0", letterSpacing: "2px" };
var content4 = { padding: "25px" };
var h14 = { fontSize: "22px", fontWeight: "bold", color: "#0a0a0a", margin: "0 0 16px", textAlign: "right" };
var detailBox2 = { backgroundColor: "#f7f7f7", borderRadius: "8px", padding: "18px", margin: "16px 0", border: "1px solid #e0e0e0" };
var divider4 = { borderColor: "#e0e0e0", margin: "10px 0" };
var detail2 = { fontSize: "14px", color: "#555555", margin: "5px 0", textAlign: "right" };

// supabase/functions/_shared/transactional-email-templates/registry.ts
var TEMPLATES = {
  "order-confirmation": template,
  "admin-order-notification": template2,
  "payment-confirmed": template3,
  "factory-order": template4
};

// supabase/functions/send-transactional-email/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
var json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" }
});
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("RESEND_API_KEY is not set");
    return json({ error: "Email is not configured" }, 500);
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON in request body" }, 400);
  }
  const templateName = body.templateName || body.template_name;
  const recipientEmail = body.recipientEmail || body.recipient_email;
  const idempotencyKey = body.idempotencyKey || body.idempotency_key;
  const templateData = body.templateData && typeof body.templateData === "object" ? body.templateData : {};
  const template5 = templateName ? TEMPLATES[templateName] : void 0;
  if (!template5) {
    return json(
      {
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`
      },
      404
    );
  }
  const to = template5.to || recipientEmail;
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return json({ error: "A valid recipientEmail is required" }, 400);
  }
  const subject = typeof template5.subject === "function" ? template5.subject(templateData) : template5.subject;
  const element = React5.createElement(template5.component, templateData);
  const html = await renderAsync(element);
  const text4 = await renderAsync(element, { plainText: true });
  const headers = {
    Authorization: `Bearer ${resendKey}`,
    "Content-Type": "application/json"
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey.slice(0, 256);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: Deno.env.get("EMAIL_FROM") || "PadZone <orders@padzone.co.il>",
      reply_to: Deno.env.get("EMAIL_REPLY_TO") || "evyatardery@gmail.com",
      to: [to],
      subject,
      html,
      text: text4
    })
  });
  const result = await res.json().catch(() => ({}));
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );
    await supabase.from("email_send_log").insert({
      message_id: result?.id ?? null,
      template_name: templateName,
      recipient_email: to,
      status: res.ok ? "sent" : "failed",
      error_message: res.ok ? null : JSON.stringify(result).slice(0, 1e3)
    });
  } catch (_) {
  }
  if (!res.ok) {
    console.error("Resend error", res.status, result);
    return json({ error: "Failed to send email", details: result }, 502);
  }
  console.log("Email sent", { templateName, to, id: result?.id });
  return json({ success: true, id: result?.id });
});
