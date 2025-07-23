import Router from "express";
import prisma from "../lib/prisma";

const router = Router();

// POST - QC
router.post("/level1/:shipmentId", async (req, res) => {
  const shipmentId = parseInt(req.params.shipmentId);
  const {
    packagingOk,
    sealOk,
    unitCountOk,
    damageNotes,
    photos,
    status,
    doneBy,
  } = req.body;

  if (isNaN(shipmentId)) {
    return res.status(400).json({ error: "Invalid Shipment Id" });
  }

  if (
    typeof packagingOk !== "boolean" ||
    typeof sealOk !== "boolean" ||
    typeof unitCountOk !== "boolean" ||
    !status ||
    !doneBy
  ) {
    return res.status(400).json({ error: "Missing or invalid QC fields" });
  }

  try {
    const shipment = await prisma.shipment.findUnique({
      where: {
        id: shipmentId,
      },
    });

    if (!shipment) {
      res.status(400).json({
        error:
          "Shipment doesn' exist, please create new shipment or recheck shipment Id",
      });
    }

    const alreadyChecked = await prisma.level1Check.findUnique({
      where: {
        shipmentId,
      },
    });

    if (alreadyChecked) {
      return res.status(409).json({ error: "Level 1 QC already submitted" });
    }

    const qc = await prisma.level1Check.create({
      data: {
        shipmentId,
        packagingOk,
        sealOk,
        unitCountOk,
        damageNotes,
        photos,
        status,
        doneBy,
      },
    });

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: "level1_Done" },
    });

    res.status(201).json(qc);
  } catch (err) {
    console.error("Error - ", err);
    res.status(500).json("OOps, Internal Server Error");
  }
});

router.post("/level2/:shipmentId", async (req, res) => {
  const shipmentId = parseInt(req.params.shipmentId);
  const { unitCode, qcStatus, issueNotes, photo, checkedBy } = req.body;

  if (isNaN(shipmentId)) {
    return res.status(400).json({ error: "Invalid Shipment Id" });
  }

  if (!unitCode || !qcStatus || !checkedBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["pass", "fail"].includes(qcStatus)) {
    return res.status(400).json({ error: "qcStatus must be 'pass' or 'fail'" });
  }

  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { level1Check: true },
    });

    if (!shipment) {
      return res.status(400).json({
        error:
          "Shipment doesn' exist, please create new shipment or recheck shipment Id",
      });
    }

    if (!shipment.level1Check) {
      return res
        .send(400)
        .json({ error: "Level 1 QC must be completed before Level 2 QC" });
    }

    const alreadyChecked = await prisma.unitCheck.findUnique({
      where: {
        id: shipmentId,
        unitCode: unitCode,
      },
    });

    if (alreadyChecked) {
      return res.status(409).json({ error: "Level 2 QC already submitted" });
    }

    const unit = await prisma.unitCheck.create({
      data: {
        shipmentId,
        unitCode,
        qcStatus,
        issueNotes,
        photo,
        checkedBy,
      },
    });

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: "level2_Done" },
    });

    res.status(201).json(unit);
  } catch (err) {
    console.error("Error - ", err);
    res.status(500).json({ error: "OOps, Internal Server Error" });
  }
});

// GET - QC Status
router.get("/level1/:shipmentId", async (req, res) => {
  const shipmentId = parseInt(req.params.shipmentId);

  try {
    const level1 = await prisma.level1Check.findUnique({
      where: { shipmentId },
    });

    if (!level1) {
      return res.status(404).json({ message: "Level 1 QC not found" });
    }

    res.json(level1);
  } catch (err) {
    res.status(500).json({ error: "OOps, Internal Server Error" });
  }
});

router.get("/level2/:shipmentId", async (req, res) => {
  const shipmentId = parseInt(req.params.shipmentId);

  try {
    const unitChecks = await prisma.unitCheck.findMany({
      where: { shipmentId },
    });

    res.json(unitChecks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOps, Internal Server Error" });
  }
});

export default router;
