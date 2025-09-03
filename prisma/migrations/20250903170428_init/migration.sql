-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" VARCHAR(255) NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "tags" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "session" VARCHAR(255) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Days" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Markets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "open" VARCHAR(255) NOT NULL,
    "days" VARCHAR(255) NOT NULL,

    CONSTRAINT "Markets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Days_saleId_idx" ON "Days"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Markets_name_key" ON "Markets"("name");

-- AddForeignKey
ALTER TABLE "Days" ADD CONSTRAINT "Days_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
