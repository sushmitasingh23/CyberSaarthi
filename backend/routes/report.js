const express = require("express");
const Scan = require("../models/scan");

const router = express.Router();

// ===============================
// Test Report Route
// ===============================

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Report route is working"
    });
});

// ===============================
// Get Single Scan Report
// ===============================

router.get("/:id", async (req, res) => {
    try {
        const scan = await Scan.findById(req.params.id);

        if (!scan) {
            return res.status(404).json({
                success: false,
                error: "Scan not found"
            });
        }

        res.json({
            success: true,
            scan
        });

    } catch (error) {
        console.error("Report error:", error.message);

        res.status(500).json({
            success: false,
            error: "Could not load report"
        });
    }
});

// ===============================
// Export Router
// ===============================

module.exports = router;