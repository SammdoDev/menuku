import "server-only";

export function pakasirConfig() {
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG?.trim();
  const apiKey = process.env.PAKASIR_API_KEY?.trim();

  if (!projectSlug || !apiKey) {
    throw new Error("Pakasir belum dikonfigurasi. Isi project slug dan API key di environment.");
  }

  return { projectSlug, apiKey };
}

type CreateTransactionResponse = {
  txn_id?: unknown;
  payment_link?: unknown;
};

export async function createPakasirPayment(input: {
  orderId: string;
  amount: number;
  returnUrl: string;
}) {
  const { projectSlug, apiKey } = pakasirConfig();
  const endpoint =
    "https://app.pakasir.com/api/v2/create-transaction/" +
    encodeURIComponent(projectSlug) +
    "/" +
    encodeURIComponent(input.orderId);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ method: "payment_link", amount: input.amount }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await response.json().catch(() => null)) as CreateTransactionResponse | null;

  if (
    !response.ok ||
    !data ||
    typeof data.txn_id !== "string" ||
    typeof data.payment_link !== "string"
  ) {
    throw new Error(
      "Pakasir belum dapat membuat transaksi. Periksa project, API key, dan nominal.",
    );
  }

  const paymentUrl = new URL(data.payment_link);
  if (paymentUrl.protocol !== "https:" || paymentUrl.hostname !== "app.pakasir.com") {
    throw new Error("Pakasir mengembalikan payment link yang tidak valid.");
  }
  paymentUrl.searchParams.set("qris_only", "1");
  paymentUrl.searchParams.set("redirect", input.returnUrl);

  return { txnId: data.txn_id, paymentUrl: paymentUrl.toString() };
}

export type PakasirTransactionStatus = {
  txnId: string;
  orderId: string;
  amount: number;
  status: "pending" | "completed" | "canceled";
};

export async function getPakasirTransactionStatus(
  txnId: string,
): Promise<PakasirTransactionStatus> {
  const { projectSlug, apiKey } = pakasirConfig();
  const endpoint =
    "https://app.pakasir.com/api/v2/transaction-status/" +
    encodeURIComponent(projectSlug) +
    "/" +
    encodeURIComponent(txnId);
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "x-api-key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await response.json().catch(() => null)) as {
    txn_id?: unknown;
    order_id?: unknown;
    amount?: unknown;
    status?: unknown;
  } | null;

  if (
    !response.ok ||
    !data ||
    typeof data.txn_id !== "string" ||
    typeof data.order_id !== "string" ||
    (typeof data.amount !== "number" &&
      !(typeof data.amount === "string" && /^\d+$/.test(data.amount))) ||
    !Number.isInteger(Number(data.amount)) ||
    (data.status !== "pending" && data.status !== "completed" && data.status !== "canceled")
  ) {
    throw new Error("Status transaksi Pakasir belum dapat diverifikasi.");
  }

  return {
    txnId: data.txn_id,
    orderId: data.order_id,
    amount: Number(data.amount),
    status: data.status,
  };
}

export async function cancelPakasirTransaction(txnId: string) {
  const { projectSlug, apiKey } = pakasirConfig();
  const endpoint =
    "https://app.pakasir.com/api/v2/cancel-transaction/" +
    encodeURIComponent(projectSlug) +
    "/" +
    encodeURIComponent(txnId);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error("Pakasir belum dapat membatalkan transaksi.");
  }
  return true;
}
