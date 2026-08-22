from flask import Flask, request, jsonify
import requests
from urllib.parse import urlparse

app = Flask(__name__)


def scan_website(target):
    findings = []

    try:
        # Make sure URL has a scheme
        if not target.startswith(("http://", "https://")):
            target = "https://" + target

        response = requests.get(
            target,
            timeout=10,
            allow_redirects=True,
            verify=True
        )

        headers = response.headers

        # ==========================================
        # 1. HTTPS CHECK
        # ==========================================

        if response.url.startswith("https://"):
            pass
        else:
            findings.append({
                "title": "Website Not Using HTTPS",
                "severity": "HIGH",
                "category": "HTTPS",
                "description": "The website is not using a secure HTTPS connection.",
                "recommendation": "Configure HTTPS and redirect all HTTP traffic to HTTPS."
            })

        # ==========================================
        # 2. CONTENT SECURITY POLICY
        # ==========================================

        if "Content-Security-Policy" not in headers:
            findings.append({
                "title": "Missing Content-Security-Policy Header",
                "severity": "HIGH",
                "category": "Security Headers",
                "description": "The website does not define a Content Security Policy.",
                "recommendation": "Configure a suitable Content-Security-Policy header."
            })

        # ==========================================
        # 3. X-FRAME-OPTIONS
        # ==========================================

        if "X-Frame-Options" not in headers:
            findings.append({
                "title": "Missing X-Frame-Options Header",
                "severity": "MEDIUM",
                "category": "Security Headers",
                "description": "The website does not specify X-Frame-Options.",
                "recommendation": "Set X-Frame-Options to DENY or SAMEORIGIN."
            })

        # ==========================================
        # 4. X-CONTENT-TYPE-OPTIONS
        # ==========================================

        if "X-Content-Type-Options" not in headers:
            findings.append({
                "title": "Missing X-Content-Type-Options Header",
                "severity": "MEDIUM",
                "category": "Security Headers",
                "description": "The website does not prevent MIME-type sniffing.",
                "recommendation": "Set X-Content-Type-Options to nosniff."
            })

        # ==========================================
        # 5. STRICT TRANSPORT SECURITY
        # ==========================================

        if response.url.startswith("https://"):
            if "Strict-Transport-Security" not in headers:
                findings.append({
                    "title": "Missing Strict-Transport-Security Header",
                    "severity": "MEDIUM",
                    "category": "Security Headers",
                    "description": "The website does not use HSTS.",
                    "recommendation": "Configure a suitable Strict-Transport-Security header."
                })

        # ==========================================
        # 6. REFERRER POLICY
        # ==========================================

        if "Referrer-Policy" not in headers:
            findings.append({
                "title": "Missing Referrer-Policy Header",
                "severity": "LOW",
                "category": "Security Headers",
                "description": "The website does not define a Referrer Policy.",
                "recommendation": "Configure a restrictive Referrer-Policy."
            })

        # ==========================================
        # 7. PERMISSIONS POLICY
        # ==========================================

        if "Permissions-Policy" not in headers:
            findings.append({
                "title": "Missing Permissions-Policy Header",
                "severity": "LOW",
                "category": "Security Headers",
                "description": "The website does not define a Permissions Policy.",
                "recommendation": "Configure Permissions-Policy to restrict unnecessary browser features."
            })

        # ==========================================
        # 8. SERVER INFORMATION DISCLOSURE
        # ==========================================

        if "Server" in headers:
            findings.append({
                "title": "Server Information Disclosure",
                "severity": "LOW",
                "category": "Information Disclosure",
                "description": "The server response exposes server information.",
                "recommendation": "Consider minimizing or removing detailed Server header information."
            })

        # ==========================================
        # 9. COOKIE SECURITY
        # ==========================================

        set_cookie = headers.get("Set-Cookie")

        if set_cookie:
            cookie_lower = set_cookie.lower()

            if "secure" not in cookie_lower:
                findings.append({
                    "title": "Cookie Missing Secure Flag",
                    "severity": "MEDIUM",
                    "category": "Cookie Security",
                    "description": "A cookie does not appear to use the Secure flag.",
                    "recommendation": "Set the Secure flag on sensitive cookies."
                })

            if "httponly" not in cookie_lower:
                findings.append({
                    "title": "Cookie Missing HttpOnly Flag",
                    "severity": "MEDIUM",
                    "category": "Cookie Security",
                    "description": "A cookie does not appear to use the HttpOnly flag.",
                    "recommendation": "Set HttpOnly on cookies that should not be accessible through JavaScript."
                })

        # ==========================================
        # 10. IF NOTHING FOUND
        # ==========================================

        if len(findings) == 0:
            findings.append({
                "title": "No Common Security Issues Detected",
                "severity": "INFO",
                "category": "General",
                "description": "No common issues checked by this scanner were detected.",
                "recommendation": "Continue monitoring and perform deeper security testing."
            })

        return findings

    except requests.exceptions.SSLError:
        return [{
            "title": "SSL/TLS Certificate Problem",
            "severity": "HIGH",
            "category": "SSL/TLS",
            "description": "The website has an SSL/TLS certificate validation problem.",
            "recommendation": "Install and maintain a valid SSL/TLS certificate."
        }]

    except requests.exceptions.Timeout:
        return [{
            "title": "Website Request Timeout",
            "severity": "MEDIUM",
            "category": "Availability",
            "description": "The website did not respond within the scanner timeout.",
            "recommendation": "Check whether the website is reachable and responding normally."
        }]

    except requests.exceptions.RequestException as error:
        return [{
            "title": "Website Connection Error",
            "severity": "MEDIUM",
            "category": "Connectivity",
            "description": str(error),
            "recommendation": "Verify that the target URL is reachable."
        }]


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "JSON body is required"
        }), 400

    target = data.get("target")

    if not target:
        return jsonify({
            "success": False,
            "error": "Target is required"
        }), 400

    print("Scanning:", target)

    findings = scan_website(target)

    return jsonify({
        "success": True,
        "target": target,
        "findings": findings
    })


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CyberSaarthi Python Scanner is running"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )