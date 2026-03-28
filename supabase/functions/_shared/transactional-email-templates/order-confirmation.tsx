import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PadZone"

interface OrderConfirmationProps {
  customerName?: string
  orderNumber?: string
  designName?: string
  dimensions?: string
  quantity?: number
  totalPrice?: number
  paymentLink?: string
}

const OrderConfirmationEmail = ({
  customerName = 'לקוח/ה יקר/ה',
  orderNumber = '',
  designName = '',
  dimensions = '',
  quantity = 1,
  totalPrice = 0,
  paymentLink = '',
}: OrderConfirmationProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>הזמנתך מ-PadZone התקבלה — לחצו לתשלום מאובטח 🎮</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo */}
        <Section style={header}>
          <Text style={logoText}>
            PAD<span style={logoAccent}>Z</span>ONE
          </Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>הזמנתך התקבלה! 🎮</Heading>

          <Text style={text}>
            היי {customerName}, כאן אסף מ-PadZone.
          </Text>

          <Text style={text}>
            תודה רבה שבחרת בנו! ההזמנה שלך נרשמה בהצלחה.
            כדי להתחיל להכין את הפד החדש שלך במפעל — יש לבצע את התשלום דרך הכפתור למטה.
          </Text>

          {/* Payment CTA Button */}
          {paymentLink && (
            <Section style={ctaSection}>
              <Button href={paymentLink} style={ctaButton}>
                💳 לחצו כאן לתשלום מאובטח
              </Button>
            </Section>
          )}

          {/* Order details */}
          <Section style={orderBox}>
            <Text style={orderTitle}>פרטי ההזמנה</Text>
            <Hr style={divider} />
            <Text style={orderDetail}>מספר הזמנה: <strong>{orderNumber}</strong></Text>
            <Text style={orderDetail}>דגם: {designName}</Text>
            <Text style={orderDetail}>גודל: {dimensions}</Text>
            <Text style={orderDetail}>כמות: {quantity}</Text>
            <Hr style={divider} />
            <Text style={orderTotal}>סה"כ: ₪{totalPrice}</Text>
          </Section>

          <Text style={text}>
            ברגע שהתשלום יושלם, נתחיל מיד בייצור ותקבל ממני עדכון.
          </Text>

          <Text style={text}>
            יש שאלה? אני כאן בשבילך — פשוט תשלח הודעה.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerLogo}>
            PAD<span style={footerLogoAccent}>Z</span>ONE
          </Text>
          <Text style={footerTagline}>שדרוג העמדה שלך מתחיל כאן</Text>
          <Hr style={footerDivider} />
          <Link href="https://padzone.co.il" style={footerLink}>padzone.co.il</Link>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: 'הזמנתך מ-PadZone התקבלה — לחצו לתשלום 🎮',
  displayName: 'אישור הזמנה ללקוח',
  previewData: {
    customerName: 'ישראל ישראלי',
    orderNumber: 'PZ-00042',
    designName: 'Cyber Red Blaze',
    dimensions: '90x40 ס"מ',
    quantity: 1,
    totalPrice: 129,
    paymentLink: 'https://example.com/pay',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }

const container = { margin: '0 auto', maxWidth: '600px' }

const header = {
  backgroundColor: '#0a0a0a',
  padding: '30px 25px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
}

const logoText = {
  fontSize: '28px',
  fontWeight: '800' as const,
  color: '#ffffff',
  margin: '0',
  letterSpacing: '3px',
}

const logoAccent = { color: '#00d4ff' }

const content = { padding: '30px 25px' }

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 20px',
  textAlign: 'right' as const,
}

const text = {
  fontSize: '15px',
  color: '#333333',
  lineHeight: '1.7',
  margin: '0 0 16px',
  textAlign: 'right' as const,
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const ctaButton = {
  backgroundColor: '#00b8d9',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  padding: '16px 40px',
  borderRadius: '10px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}

const orderBox = {
  backgroundColor: '#f7f7f7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  border: '1px solid #e0e0e0',
}

const orderTitle = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 10px',
  textAlign: 'right' as const,
}

const divider = { borderColor: '#e0e0e0', margin: '12px 0' }

const orderDetail = {
  fontSize: '14px',
  color: '#555555',
  margin: '6px 0',
  textAlign: 'right' as const,
}

const orderTotal = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#00b8d9',
  margin: '6px 0',
  textAlign: 'right' as const,
}

const footer = {
  backgroundColor: '#0a0a0a',
  padding: '25px',
  textAlign: 'center' as const,
  borderRadius: '0 0 8px 8px',
}

const footerLogo = {
  fontSize: '20px',
  fontWeight: '800' as const,
  color: '#ffffff',
  margin: '0 0 6px',
  letterSpacing: '2px',
}

const footerLogoAccent = { color: '#00d4ff' }

const footerTagline = {
  fontSize: '12px',
  color: '#aaaaaa',
  margin: '0 0 12px',
}

const footerDivider = { borderColor: '#333333', margin: '12px 0' }

const footerLink = {
  fontSize: '12px',
  color: '#00d4ff',
  textDecoration: 'none',
}
