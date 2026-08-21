function calculateRisk(findings) {

    let score = 100;

    findings.forEach((finding) => {

        if (finding.severity === "CRITICAL") {
            score -= 25;
        }

        if (finding.severity === "HIGH") {
            score -= 15;
        }

        if (finding.severity === "MEDIUM") {
            score -= 8;
        }

        if (finding.severity === "LOW") {
            score -= 3;
        }

    });

    score = Math.max(score, 0);

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