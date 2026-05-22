import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface FactoryOrderProps {
  orderNumber?: string
  designId?: string
  designName?: string
  dimensions?: string
  quantity?: number
  customerName?: string
}

const FactoryOrderEmail = ({
  orderNumber = '',
  designId = '',
  designName = '',
  dimensions = '',
  quantity = 1,
  customerName = '',
}: FactoryOrderProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>הזמנת ייצור חדשה | PadZone #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>PadZone — הזמנת ייצור</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>הזמנת ייצור חדשה</Heading>

          <Section style={detailBox}>
            <Text style={detail}>מספר הזמנה: <strong>{orderNumber}</strong></Text>
            <Hr style={divider} />
            <Text style={detail}>מספר קטלוגי: <strong>{designId || '—'}</strong></Text>
            <Text style={detail}>שם עיצוב: {designName}</Text>
            <Text style={detail}>גודל: {dimensions}</Text>
            <Text style={detail}>כמות: {quantity}</Text>
            <Hr style={divider} />
            <Text style={detail}>שם לקוח: {customerName}</Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: FactoryOrderEmail,
  subject: (data: Record<string, any>) =>
    `הזמנת ייצור חדשה #${data.orderNumber || ''}`,
  displayName: 'הזמנת ייצור למפעל',
  previewData: {
    orderNumber: 'PZ-00042',
    designId: 'cyber-red-blaze',
    designName: 'Cyber Red Blaze',
    dimensions: '90x40 ס"מ',
    quantity: 1,
    customerName: 'ישראל ישראלי',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }
const container = { margin: '0 auto', maxWidth: '600px' }
const header = { backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center' as const, borderRadius: '8px 8px 0 0' }
const logoText = { fontSize: '20px', fontWeight: '800' as const, color: '#ffffff', margin: '0', letterSpacing: '2px' }
const content = { padding: '25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 16px', textAlign: 'right' as const }
const detailBox = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '18px', margin: '16px 0', border: '1px solid #e0e0e0' }
const divider = { borderColor: '#e0e0e0', margin: '10px 0' }
const detail = { fontSize: '14px', color: '#555555', margin: '5px 0', textAlign: 'right' as const }
