-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('stripe', 'liqpay');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('success', 'failed', 'processing', 'pending', 'refunded');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('pending', 'cancelled', 'active', 'paused', 'expired');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('monthly', 'annualy');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('subscription', 'order');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "customerId" TEXT,
    "stripeCustomerId" TEXT,
    "isAutoRenewal" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "paymentProvider" "PaymentProvider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billingPeriod" "BillingPeriod",
    "amount" DECIMAL(65,30) NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "externalId" TEXT,
    "subscriptionId" TEXT,
    "orderId" TEXT,
    "transactionType" "TransactionType" NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyPrice" DECIMAL(65,30) NOT NULL,
    "annualyPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingPeriod" "BillingPeriod" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionId" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanProvider" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "planId" TEXT NOT NULL,
    "externalPriceId" TEXT,
    "billingPeriod" "BillingPeriod" NOT NULL,

    CONSTRAINT "PlanProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_externalId_key" ON "Transactions"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "UserSubscription"("userId");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "UserSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanProvider" ADD CONSTRAINT "PlanProvider_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
