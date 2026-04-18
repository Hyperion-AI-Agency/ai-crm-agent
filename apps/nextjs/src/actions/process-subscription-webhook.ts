"use server";

import config from "@payload-config";
import { Benefit } from "@polar-sh/sdk/models/components/benefit.js";
import { BenefitGrantWebhook } from "@polar-sh/sdk/models/components/benefitgrantwebhook.js";
import { Checkout } from "@polar-sh/sdk/models/components/checkout.js";
import { Customer } from "@polar-sh/sdk/models/components/customer.js";
import { CustomerSeat } from "@polar-sh/sdk/models/components/customerseat.js";
import { CustomerState } from "@polar-sh/sdk/models/components/customerstate.js";
import { Order } from "@polar-sh/sdk/models/components/order.js";
import { Product } from "@polar-sh/sdk/models/components/product.js";
import { Refund } from "@polar-sh/sdk/models/components/refund.js";
import { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { Organization } from "better-auth/plugins/organization";
import { getPayload } from "payload";

import type { UserSubscription } from "@/types/payload-types";

// Utility function to safely parse dates
function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

export async function processSubscriptionWebhook(
  data:
    | Checkout
    | Benefit
    | BenefitGrantWebhook
    | Order
    | Organization
    | Product
    | Refund
    | Subscription
    | Customer
    | CustomerState
    | CustomerSeat,
  type: string
) {
  // Check if this is a subscription webhook type
  if (
    type !== "subscription.created" &&
    type !== "subscription.active" &&
    type !== "subscription.canceled" &&
    type !== "subscription.revoked" &&
    type !== "subscription.uncanceled" &&
    type !== "subscription.updated"
  ) {
    return;
  }

  // Type assertion - we know this is a Subscription at this point
  const subscriptionData = data as Subscription;

  console.log("🎯 Processing subscription webhook:", type);
  console.log("📦 Payload data:", JSON.stringify(subscriptionData, null, 2));

  try {
    // STEP 1: Extract user ID from customer data
    const userId = subscriptionData.customer?.externalId;

    // STEP 2: Build subscription data
    const processedData = {
      id: subscriptionData.id,
      createdAt: new Date(subscriptionData.createdAt),
      modifiedAt: safeParseDate(subscriptionData.modifiedAt),
      amount: subscriptionData.amount,
      currency: subscriptionData.currency,
      recurringInterval: subscriptionData.recurringInterval,
      status: subscriptionData.status,
      currentPeriodStart: safeParseDate(subscriptionData.currentPeriodStart) || new Date(),
      currentPeriodEnd: safeParseDate(subscriptionData.currentPeriodEnd) || new Date(),
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd || false,
      canceledAt: safeParseDate(subscriptionData.canceledAt),
      startedAt: safeParseDate(subscriptionData.startedAt) || new Date(),
      endsAt: safeParseDate(subscriptionData.endsAt),
      endedAt: safeParseDate(subscriptionData.endedAt),
      customerId: subscriptionData.customerId,
      productId: subscriptionData.productId,
      discountId: subscriptionData.discountId || null,
      checkoutId: subscriptionData.checkoutId || "",
      customerCancellationReason: subscriptionData.customerCancellationReason || null,
      customerCancellationComment: subscriptionData.customerCancellationComment || null,
      metadata: subscriptionData.metadata ? JSON.stringify(subscriptionData.metadata) : null,
      customFieldData: subscriptionData.customFieldData
        ? JSON.stringify(subscriptionData.customFieldData)
        : null,
      userId: userId as string | null,
    };

    console.log("💾 Final subscription data:", {
      id: processedData.id,
      status: processedData.status,
      userId: processedData.userId,
      amount: processedData.amount,
    });

    // STEP 3: Use Payload CMS to upsert subscription
    const payload = await getPayload({ config });

    try {
      // Try to find existing subscription
      await payload.findByID({
        collection: "user_subscriptions",
        id: processedData.id,
      });

      // Update if exists
      const updateData: Partial<UserSubscription> = {
        modifiedAt: processedData.modifiedAt?.toISOString() || new Date().toISOString(),
        amount: processedData.amount,
        currency: processedData.currency as UserSubscription["currency"],
        recurringInterval: processedData.recurringInterval as UserSubscription["recurringInterval"],
        status: processedData.status as UserSubscription["status"],
        currentPeriodStart: processedData.currentPeriodStart.toISOString(),
        currentPeriodEnd: processedData.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: processedData.cancelAtPeriodEnd,
        canceledAt: processedData.canceledAt?.toISOString() || null,
        startedAt: processedData.startedAt.toISOString(),
        endsAt: processedData.endsAt?.toISOString() || null,
        endedAt: processedData.endedAt?.toISOString() || null,
        customerId: processedData.customerId,
        productId: processedData.productId,
        discountId: processedData.discountId,
        checkoutId: processedData.checkoutId,
        customerCancellationReason: processedData.customerCancellationReason,
        customerCancellationComment: processedData.customerCancellationComment,
        metadata: processedData.metadata,
        customFieldData: processedData.customFieldData,
        userId: processedData.userId,
      };

      await payload.update({
        collection: "user_subscriptions",
        id: processedData.id,
        data: updateData,
      });

      console.log("✅ Updated subscription:", subscriptionData.id);
    } catch (findError: any) {
      // If not found, create new subscription
      if (findError.status === 404 || findError.message?.includes("not found")) {
        const createData: Omit<UserSubscription, "updatedAt" | "createdAt"> & {
          id: string;
          createdAt?: string;
        } = {
          id: processedData.id,
          createdAt: processedData.createdAt.toISOString(),
          modifiedAt: processedData.modifiedAt?.toISOString() || new Date().toISOString(),
          amount: processedData.amount,
          currency: processedData.currency as UserSubscription["currency"],
          recurringInterval:
            processedData.recurringInterval as UserSubscription["recurringInterval"],
          status: processedData.status as UserSubscription["status"],
          currentPeriodStart: processedData.currentPeriodStart.toISOString(),
          currentPeriodEnd: processedData.currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: processedData.cancelAtPeriodEnd,
          canceledAt: processedData.canceledAt?.toISOString() || null,
          startedAt: processedData.startedAt.toISOString(),
          endsAt: processedData.endsAt?.toISOString() || null,
          endedAt: processedData.endedAt?.toISOString() || null,
          customerId: processedData.customerId,
          productId: processedData.productId,
          discountId: processedData.discountId,
          checkoutId: processedData.checkoutId,
          customerCancellationReason: processedData.customerCancellationReason,
          customerCancellationComment: processedData.customerCancellationComment,
          metadata: processedData.metadata,
          customFieldData: processedData.customFieldData,
          userId: processedData.userId,
        };

        await payload.create({
          collection: "user_subscriptions",
          data: createData,
        });

        console.log("✅ Created subscription:", subscriptionData.id);
      } else {
        throw findError;
      }
    }
  } catch (error) {
    console.error("💥 Error processing subscription webhook:", error);
    // Don't throw - let webhook succeed to avoid retries
  }
}
