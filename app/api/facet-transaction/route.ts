import { NextResponse } from "next/server";
export const revalidate = 2;

const fetchTransaction = async (txHash: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URI}/transactions/${txHash}`
  );
  const { result } = await fetch(url.href, { cache: "no-store" })
    .then((res) => res.json())
    .catch(() => ({
      result: null,
    }));
  return result ?? null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const txn = searchParams.get("txn")!.toLowerCase();
    const res = await fetchTransaction(txn);
    return NextResponse.json(res);
  } catch (error: any) {
    const status = error?.response?.status || 400;
    const message = error?.response?.statusText || error?.message || `${error}`;
    return NextResponse.json({ message }, { status });
  }
}
