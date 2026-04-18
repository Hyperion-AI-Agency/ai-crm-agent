"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/server/auth/auth-client";
import { useTranslations } from "next-intl";

interface Order {
  id: string;
  product?: { name: string };
  createdAt: string;
  totalAmount: number;
  currency: string;
  status: string;
}

interface OrdersResponse {
  result: { items: Order[] };
}

export function SettingsBillingSection() {
  const t = useTranslations("dashboard.settings.billing");
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await authClient.customer.orders.list({});
        if (ordersResponse.data) {
          setOrders(ordersResponse.data as unknown as OrdersResponse);
        } else {
          setOrders(null);
        }
      } catch (orderError) {
        console.log("Orders fetch failed:", orderError);
        setOrders(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenPortal = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency?.toLowerCase() === "eur" ? "€" : "$";
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      paid: "Paid",
      canceled: "Canceled",
      refunded: "Refunded",
    };
    return map[status] ?? status;
  };

  if (loading) {
    return (
      <section>
        <h2 className="mb-4 text-base font-semibold">
          {t("invoices", { defaultMessage: "Invoices" })}
        </h2>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div
              key={i}
              className="h-5 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      </section>
    );
  }

  const items = orders?.result?.items ?? [];

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold">
        {t("invoices", { defaultMessage: "Invoices" })}
      </h2>
      {items.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="pb-2 font-normal">{t("invoiceDate", { defaultMessage: "Date" })}</th>
              <th className="pb-2 font-normal">{t("invoiceTotal", { defaultMessage: "Total" })}</th>
              <th className="pb-2 font-normal">
                {t("invoiceStatus", { defaultMessage: "Status" })}
              </th>
              <th className="pb-2 font-normal">
                {t("invoiceActions", { defaultMessage: "Actions" })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {items.map(order => (
              <tr key={order.id}>
                <td className="py-3">{formatDate(order.createdAt)}</td>
                <td className="py-3">{formatAmount(order.totalAmount, order.currency)}</td>
                <td className="py-3">{formatStatus(order.status)}</td>
                <td className="py-3">
                  <button
                    onClick={handleOpenPortal}
                    className="text-foreground underline underline-offset-2 hover:no-underline"
                  >
                    {t("invoiceView", { defaultMessage: "View" })}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted-foreground text-sm">
          {orders === null ? t("noOrdersLoadFailed") : t("noOrdersDescription")}
        </p>
      )}
    </section>
  );
}
