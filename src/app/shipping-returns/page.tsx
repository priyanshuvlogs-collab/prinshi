import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and returns",
  description: "Shipping and returns for Prinshi Trades orders in India and Canada.",
  alternates: { canonical: "/shipping-returns" },
};

/** ADD POLICY TEXT for India and Canada. Until the owner supplies it, the page states the current status honestly. */
export default function ShippingReturnsPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Shipping and returns</h1>
      <p className="mt-4">Checkout is not open yet. The shipping fees, delivery windows and return rules for India and Canada will be published here before the first order can be placed.</p>
      <p className="mt-4">For orders shipped from India to Canada, duties and taxes will be shown before payment. Any final-sale item will say so before payment.</p>
    </div>
  );
}
