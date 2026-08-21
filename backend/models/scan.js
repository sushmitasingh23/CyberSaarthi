const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
    {
        target: {
            type: String,
            required: true
        },

        securityScore: {
            type: Number
        },

        riskLevel: {
            type: String
        },

        findings: [
            {
                title: {
                    type: String
                },

                severity: {
                    type: String
                },

                category: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Scan = mongoose.model("Scan", scanSchema);

module.exports = Scan;