import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { supplierName, createdBy } = req.body;

    if (!supplierName || !createdBy) {
      return res.status(400).json({
        error:
          "Incomplete: 'Supplier Name' and 'Created By' are required fields",
      });
    }

    const shipment = await prisma.shipment.create({
      data: {
        supplierName,
        createdBy,
      },
    });

    res.status(200).json(shipment);
  } catch (err) {
    res.status(500).json({ error: "OOps, Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        level1Check: true,
        units: true,
      },
    });

    res.json(shipments);
  } catch (err) {
    console.error("Error - ", err);
    return res.status(500).json("OOps, Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid shipment ID" });
  }
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        level1Check: true,
        units: true,
      },
    });
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: "OOps, Internal Server Error" });
  }
});

export default router;
