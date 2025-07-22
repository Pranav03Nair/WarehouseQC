-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "supplierName" TEXT NOT NULL,
    "checkedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level1Check" (
    "id" SERIAL NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "packagingOk" BOOLEAN NOT NULL,
    "sealOk" BOOLEAN NOT NULL,
    "unitCountOk" BOOLEAN NOT NULL,
    "damageNotes" TEXT,
    "photos" TEXT[],
    "status" TEXT NOT NULL,
    "doneBy" TEXT NOT NULL,
    "doneAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Level1Check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCheck" (
    "id" SERIAL NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "unitCode" TEXT NOT NULL,
    "qcStatus" TEXT NOT NULL,
    "issueNotes" TEXT,
    "photo" TEXT,
    "checkedBy" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnitCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Level1Check_shipmentId_key" ON "Level1Check"("shipmentId");

-- AddForeignKey
ALTER TABLE "Level1Check" ADD CONSTRAINT "Level1Check_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCheck" ADD CONSTRAINT "UnitCheck_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
