import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.shipment.create({
    data: {
      supplierName: "GraffitiHut Supplies",
      status: "pending",
      createdBy: "qc_operator_1",
    },
  });

  console.log("Sample shipment seeded for testing");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
