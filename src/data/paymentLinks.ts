/**
 * Payment Links per size.
 * Replace the placeholder URLs with your actual Stripe/PayPal payment links.
 */
export const paymentLinks: Record<string, string> = {
  "M 22.5x18.5": "https://REPLACE_WITH_ACTUAL_PAYMENT_LINK_M",
  "L 60x30": "https://REPLACE_WITH_ACTUAL_PAYMENT_LINK_L",
  "XL 80x30": "https://REPLACE_WITH_ACTUAL_PAYMENT_LINK_XL",
};

export function getPaymentLink(sizeLabel: string): string {
  return paymentLinks[sizeLabel] || "";
}
