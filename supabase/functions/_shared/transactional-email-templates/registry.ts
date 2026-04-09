/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as adminOrderNotification } from './admin-order-notification.tsx'
import { template as paymentConfirmed } from './payment-confirmed.tsx'
import { template as factoryOrder } from './factory-order.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'admin-order-notification': adminOrderNotification,
  'payment-confirmed': paymentConfirmed,
  'factory-order': factoryOrder,
}
