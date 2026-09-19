import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed",
};

export default function OrderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
