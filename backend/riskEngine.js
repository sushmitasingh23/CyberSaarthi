function calculateRisk(findings) {

    let score = 100;

    // Severity-based penalties
    const severityPenalty = {
        CRITICAL: 25,
        HIGH: 15,
        MEDIUM: 8,
        LOW: 3,
        INFO: 0
    };

    // Apply penalty for every finding
    findings.forEach((finding) => {

        const severity = finding.severity?.toUpperCase();

        if (severityPenalty[severity] !== undefined) {
            score -= severityPenalty[severity];
        }
    });

    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine overall risk
    let riskLevel;

    if (score >= 80) {
        riskLevel = "LOW";
    }
    else if (score >= 60) {
        riskLevel = "MEDIUM";
    }
    else if (score >= 40) {
        riskLevel = "HIGH";
    }
    else {
        riskLevel = "CRITICAL";
    }

    return {
        securityScore: score,
        riskLevel: riskLevel
    };
}

module.exports = calculateRisk;