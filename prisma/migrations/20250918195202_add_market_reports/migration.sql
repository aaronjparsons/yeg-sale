-- CreateTable
CREATE TABLE "MarketReports" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marketId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "MarketReports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketReports_marketId_idx" ON "MarketReports"("marketId");

-- AddForeignKey
ALTER TABLE "MarketReports" ADD CONSTRAINT "MarketReports_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
