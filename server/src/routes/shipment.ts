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

export default router;
