const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "CyberSaarthi backend is running!"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

// Scan endpoint
app.post("/api/scan", async (req, res) => {
    const { target, type } = req.body;

    if (!target) {
        return res.status(400).json({
            error: "Target is required"
        });
    }

    console.log("Scan requested:", target);

    // Scanner will be connected here later.

    res.json({
    success: true,
    target: target,
    type: type || "website",

    securityScore: 72,

    summary: {
        critical: 0,
        high: 1,
        medium: 1,
        low: 1
    },

    findings: [
        {
            id: 1,
            title: "Missing Security Header",
            severity: "HIGH",
            category: "Web Security",
            description: "A recommended security header is missing.",
            recommendation: "Configure the appropriate security header."
        },
        {
            id: 2,
            title: "HTTP Redirect Issue",
            severity: "MEDIUM",
            category: "Configuration",
            description: "The website does not properly enforce HTTPS.",
            recommendation: "Configure HTTPS and redirect HTTP traffic."
        },
        {
            id: 3,
            title: "Open Port Detected",
            severity: "LOW",
            category: "Network Security",
            description: "An unnecessary network port appears to be accessible.",
            recommendation: "Review the exposed port and close it if unnecessary."
        }
    ]
});
});

app.listen(PORT, () => {
    console.log(`CyberSaarthi backend running on http://localhost:${PORT}`);
});