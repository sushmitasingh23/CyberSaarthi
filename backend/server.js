require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const Scan = require("./models/scan");
const calculateRisk = require("./riskEngine");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "CyberSaarthi backend is running!"
    });
});

// ===============================
// Health Check
// ===============================
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

// ===============================
// Scan Route
// ===============================
app.post("/api/scan", async (req, res) => {
    try {
        const { target } = req.body;

        // Check target
        if (!target) {
            return res.status(400).json({
                success: false,
                error: "Target is required"
            });
        }

        console.log("Starting scan for:", target);

        // ===============================
        // 1. Send target to Python Scanner
        // ===============================
        const scannerResponse = await axios.post(
            "http://localhost:5001/scan",
            {
                target: target
            }
        );

        const scannerData = scannerResponse.data;

        console.log("Scanner response received");

        // ===============================
        // 2. Calculate Risk
        // ===============================
        const risk = calculateRisk(scannerData.findings);

        console.log("Risk calculated:", risk);

        // ===============================
        // 3. Save Scan to MongoDB
        // ===============================
        const savedScan = await Scan.create({
            target: target,
            securityScore: risk.securityScore,
            riskLevel: risk.riskLevel,
            findings: scannerData.findings
        });

        console.log("Scan saved to MongoDB:", savedScan._id);

        // ===============================
        // 4. Send Result to Frontend
        // ===============================
        res.json({
            success: true,
            target: target,
            securityScore: risk.securityScore,
            riskLevel: risk.riskLevel,
            findings: scannerData.findings,
            scanId: savedScan._id
        });

    } catch (error) {
        console.error("Scan error:", error.message);

        res.status(500).json({
            success: false,
            error: "Scan failed",
            details: error.message
        });
    }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log(
        `CyberSaarthi backend running on http://localhost:${PORT}`
    );
});