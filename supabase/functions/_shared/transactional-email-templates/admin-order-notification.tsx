import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PadZone"
const ADMIN_EMAIL = "evyatardery@gmail.com"
const TIKTOK_URL = "https://www.tiktok.com/@padzone.il"

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bit: '💙 ביט',
  paybox: '🟢 פייבוקס',
  credit: '💳 אשראי',
}

interface AdminOrderNotificationProps {
  orderNumber?: string
  designName?: string
  designId?: string
  dimensions?: string
  quantity?: number
  totalPrice?: number
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  shippingAddress?: string
  paymentMethod?: string
  paymentLink?: string
  printFileUrl?: string
  orderFormUrl?: string
}

const AdminOrderNotificationEmail = ({
  orderNumber = '',
  designName = '',
  designId = '',
  dimensions = '',
  quantity = 1,
  totalPrice = 0,
  customerName = '',
  customerPhone = '',
  customerEmail = '',
  shippingAddress = '',
  paymentMethod = '',
  paymentLink = '',
  printFileUrl = '',
  orderFormUrl = '',
}: AdminOrderNotificationProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>הזמנה חדשה באתר PadZone! #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>
            PAD<span style={logoAccent}>Z</span>ONE — הזמנה חדשה!
          </Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>🎉 אביתר, יש עבודה!</Heading>

          <Text style={text}>לקוח חדש ביצע הזמנה.</Text>

          <Section style={detailBox}>
            <Text style={sectionTitle}>פרטי ההזמנה</Text>
            <Hr style={divider} />
            <Text style={detail}>מספר הזמנה: <strong>{orderNumber}</strong></Text>
            <Text style={detail}>דגם: <strong>{designName}</strong></Text>
            {designId ? <Text style={detail}>מספר קטלוגי: {designId}</Text> : null}
            <Text style={detail}>גודל: {dimensions}</Text>
            <Text style={detail}>כמות: {quantity}</Text>
            <Text style={detailHighlight}>סה"כ: ₪{totalPrice}</Text>
          </Section>

          <Section style={detailBox}>
            <Text style={sectionTitle}>פרטי לקוח</Text>
            <Hr style={divider} />
            <Text style={detail}>שם: {customerName}</Text>
            <Text style={detail}>טלפון: {customerPhone}</Text>
            {customerEmail ? <Text style={detail}>מייל: {customerEmail}</Text> : null}
            <Text style={detail}>כתובת למשלוח: {shippingAddress}</Text>
          </Section>

          <Section style={detailBox}>
            <Text style={sectionTitle}>תשלום</Text>
            <Hr style={divider} />
            <Text style={detail}>אמצעי תשלום: {PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || 'לא נבחר'}</Text>
            {paymentLink ? (
              <Text style={detail}>
                לינק תשלום: <Link href={paymentLink} style={fileLink}>{paymentLink}</Link>
              </Text>
            ) : null}
          </Section>

          {(printFileUrl || orderFormUrl) && (
            <Section style={detailBox}>
              <Text style={sectionTitle}>קבצים</Text>
              <Hr style={divider} />
              {printFileUrl ? (
                <Text style={detail}>
                  קובץ הדפסה: <Link href={printFileUrl} style={fileLink}>הורד PDF</Link>
                </Text>
              ) : null}
              {orderFormUrl ? (
                <Text style={detail}>
                  טופס הזמנה: <Link href={orderFormUrl} style={fileLink}>הורד PDF</Link>
                </Text>
              ) : null}
            </Section>
          )}
        </Section>

        <Section style={footer}>
          <Text style={footerLogo}>
            PAD<span style={footerLogoAccent}>Z</span>ONE
          </Text>
          <Text style={footerTagline}>שדרוג העמדה שלך מתחיל כאן</Text>
          <Section style={socialRow}>
            <Link href={TIKTOK_URL} style={socialLink}>TikTok</Link>
          </Section>
          <Hr style={footerDivider} />
          <Link href="https://padzone.co.il" style={footerLink}>padzone.co.il</Link>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminOrderNotificationEmail,
  subject: (data: Record<string, any>) =>
    `הזמנה חדשה באתר PadZone! #${data.orderNumber || ''}`,
  displayName: 'התראת הזמנה לאדמין',
  to: ADMIN_EMAIL,
  previewData: {
    orderNumber: 'PZ-00042',
    designName: 'Cyber Red Blaze',
    designId: 'cyber-red-blaze',
    dimensions: '90x40 ס"מ',
    quantity: 1,
    totalPrice: 129,
    customerName: 'ישראל ישראלי',
    customerPhone: '050-1234567',
    customerEmail: 'test@example.com',
    shippingAddress: 'רחוב הרצל 1, תל אביב',
    paymentMethod: 'bit',
    paymentLink: 'https://app.onelink.me/lmJd/bit?phone=0524796790',
    printFileUrl: 'https://example.com/print.pdf',
    orderFormUrl: 'https://example.com/order-form.pdf',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }
const container = { margin: '0 auto', maxWidth: '600px' }

const header = {
  backgroundColor: '#0a0a0a',
  padding: '25px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
}

const logoText = {
  fontSize: '22px',
  fontWeight: '800' as const,
  color: '#ffffff',
  margin: '0',
  letterSpacing: '2px',
}

const logoAccent = { color: '#00d4ff' }
const content = { padding: '25px' }

const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 16px',
  textAlign: 'right' as const,
}

const text = {
  fontSize: '15px',
  color: '#333333',
  lineHeight: '1.6',
  margin: '0 0 16px',
  textAlign: 'right' as const,
}

const detailBox = {
  backgroundColor: '#f7f7f7',
  borderRadius: '8px',
  padding: '18px',
  margin: '16px 0',
  border: '1px solid #e0e0e0',
}

const sectionTitle = {
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 8px',
  textAlign: 'right' as const,
}

const divider = { borderColor: '#e0e0e0', margin: '10px 0' }

const detail = {
  fontSize: '14px',
  color: '#555555',
  margin: '5px 0',
  textAlign: 'right' as const,
}

const detailHighlight = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#00b8d9',
  margin: '8px 0 0',
  textAlign: 'right' as const,
}

const fileLink = { color: '#00b8d9', textDecoration: 'underline' }

const footer = {
  backgroundColor: '#0a0a0a',
  padding: '25px',
  textAlign: 'center' as const,
  borderRadius: '0 0 8px 8px',
}

const footerLogo = {
  fontSize: '18px',
  fontWeight: '800' as const,
  color: '#ffffff',
  margin: '0 0 6px',
  letterSpacing: '2px',
}

const footerLogoAccent = { color: '#00d4ff' }
const footerTagline = { fontSize: '11px', color: '#aaaaaa', margin: '0 0 10px' }

const socialRow = { textAlign: 'center' as const, margin: '6px 0 10px' }
const socialLink = { color: '#00d4ff', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' as const }

const footerDivider = { borderColor: '#333333', margin: '10px 0' }
const footerLink = { fontSize: '11px', color: '#00d4ff', textDecoration: 'none' }
