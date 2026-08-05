import PaymentClient from "@/sections/pembayaran/payment-client";

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams: Promise<{
    projectId?: string,
    listingId?: string,
    tons?: string
  }>;
}) {
  const params = await searchParams;
  
  return <PaymentClient searchParams={params} />
}