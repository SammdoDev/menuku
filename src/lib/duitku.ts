import crypto from "node:crypto";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} belum diatur.`);
  return value;
}

export function duitkuConfig() {
  const environment = process.env.DUITKU_ENV === "production" ? "production" : "sandbox";
  return {
    merchantCode: required("DUITKU_MERCHANT_CODE"),
    apiKey: required("DUITKU_API_KEY"),
    paymentMethod: process.env.DUITKU_PAYMENT_METHOD?.trim().toUpperCase() || null,
    endpoint:
      process.env.DUITKU_API_URL?.trim() ||
      (environment === "production"
        ? "https://api-prod.duitku.com/api/merchant/createInvoice"
        : "https://api-sandbox.duitku.com/api/merchant/createInvoice"),
  };
}

export function duitkuSignature(value: string, apiKey: string) {
  return crypto.createHmac("sha256", apiKey).update(value).digest("hex");
}

export function duitkuRequestSignature(merchantCode: string, timestamp: string, apiKey: string) {
  return crypto.createHash("sha256").update(`${merchantCode}${timestamp}${apiKey}`).digest("hex");
}

export function verifyDuitkuSignature(value: string, signature: string, apiKey: string) {
  const expected = duitkuSignature(value, apiKey);
  const actual = signature.trim().toLowerCase();
  return actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export type DuitkuInvoice = {
  paymentUrl: string;
  reference?: string;
  statusCode?: string;
  statusMessage?: string;
};

export async function createDuitkuInvoice(input: {
  orderId: string;
  amount: number;
  email: string;
  customerName: string;
  productDetails: string;
  returnUrl: string;
  callbackUrl: string;
}) {
  const config = duitkuConfig();
  const timestamp = Date.now().toString();
  const body = {
    paymentAmount: input.amount,
    ...(config.paymentMethod ? { paymentMethod: config.paymentMethod } : {}),
    merchantOrderId: input.orderId,
    productDetails: input.productDetails,
    email: input.email,
    merchantUserInfo: input.email,
    customerVaName: input.customerName.slice(0, 20),
    returnUrl: input.returnUrl,
    callbackUrl: input.callbackUrl,
    expiryPeriod: 60,
  };
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-duitku-signature": duitkuRequestSignature(config.merchantCode, timestamp, config.apiKey),
      "x-duitku-timestamp": timestamp,
      "x-duitku-merchantcode": config.merchantCode,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as DuitkuInvoice | null;
  if (!response.ok || !data || data.statusCode !== "00" || !data.paymentUrl) {
    throw new Error(data?.statusMessage || "Invoice Duitku belum dapat dibuat.");
  }
  return data;
}
