from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()

    target = data.get("target")

    if not target:
        return jsonify({
            "success": False,
            "error": "Target is required"
        }), 400

    # Prototype findings
    findings = [
        {
            "title": "Missing Security Header",
            "severity": "HIGH",
            "category": "Web Security"
        },
        {
            "title": "Weak Cookie Configuration",
            "severity": "MEDIUM",
            "category": "Web Security"
        },
        {
            "title": "Information Disclosure",
            "severity": "LOW",
            "category": "Configuration"
        }
    ]

    return jsonify({
        "success": True,
        "target": target,
        "findings": findings
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)