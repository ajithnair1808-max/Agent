# Security Findings - Agent Frontend Demo App

This report contains only high-confidence findings (>= 8/10). Each finding includes file references, evidence, impact, and remediation steps.

## Alert 1
**File:** D:\Agent\src\components\Navbar.tsx
**Category:** SensitiveDataLeak
**Severity: HIGH | Confidence: 9/10**
**Problem:** The Gemini API key (config.geminiApiKey) is captured and kept in client-side React state. UI text claims: "Keys are stored safely in local memory only." Storing API keys in page context (React state) exposes them to the full renderer environment: any XSS (third-party script, malicious extension, injected script) can read and exfiltrate the key. Browser memory, console, and developer tools are accessible to local attackers; client-side keys cannot be protected with HttpOnly/secure cookies.

**Evidence:** Snippet from D:\Agent\src\components\Navbar.tsx:
```js
const [showApiModal, setShowApiModal] = useState(false);
const [tempApiKey, setTempApiKey] = useState(config.geminiApiKey);

const handleSaveApiKey = () => {
  onUpdateConfig({
    ...config,
    geminiApiKey: tempApiKey,
    useLiveApi: tempApiKey.trim().length > 0,
  });
  setShowApiModal(false);
};
// UI text: "Keys are stored safely in local memory only." (no persistence code shown)
```

**Impact:** An attacker that achieves XSS or can run JS in the page context can read the API key and use it to make calls against the upstream generative API tied to the user's quota and data. This can lead to data exfiltration, quota theft, and secondary attacks (prompt injection, data leakage).

**Suggested fix:**
- Do not place long-lived secrets in client-side state when possible. Prefer a server-side proxy that stores credentials securely server-side and mints short-lived tokens for the client.
- If a client-side API key is unavoidable for demos, make it clearly opt-in and display prominent warnings; treat it as ephemeral and avoid persistence.
- Never store keys in localStorage/sessionStorage/cookies readable by JS. Use HttpOnly, Secure cookies or native OS secure storage when persistence is required.
- Mitigate XSS across the app (CSP, sanitize third-party content, avoid dangerouslySetInnerHTML, lock down dependencies).

---

## Alert 2
**File:** D:\Agent\src\services\automationPipeline.ts
**Category:** AuthenticationFailure / DataIntegrityFailure
**Severity: HIGH | Confidence: 9/10**
**Problem:** AutomationPipeline.dispatchToWebhook posts raw payloads (including deliverables) using fetch() without any signing, authentication token, or integrity mechanism. Receiving endpoints cannot verify payload origin or integrity. If the webhook URL is sensitive (contains secrets) or if the payload contains user data or API keys, these are dispatched without protection and can be forged or replayed by an attacker.

**Evidence:** Implementation summary in D:\Agent\src\services\automationPipeline.ts: "dispatchToWebhook() uses fetch() to POST payloads. dispatchToWebhook will POST raw payload or Discord embed. It catches errors and returns failure message. No auth or signature added to webhook requests." (file provided with full implementation in project artifacts)

**Impact:** Without a signature or shared secret verification, an attacker can:
- Forge webhook payloads to downstream systems, triggering unintended workflows.
- Replay or modify payloads (integrity not ensured).
- If client-side code includes API keys or PII in payloads, these can be leaked to third parties.

**Suggested fix:**
- Move webhook dispatch to a server-side component that holds the webhook secret and performs the POSTs.
- If client must call webhooks, implement a signed payload scheme: compute HMAC(payload||timestamp) with a server-held secret and verify server-side. Include a timestamp and short validity window to prevent replay.
- Ensure sensitive fields (API keys, PII) are redacted before dispatching. Prefer sending a reference/ID that the recipient can use to fetch the real data from a secure server (with access control).
- Add robust error handling, logging, and retry/backoff for transient failures (but do not retry in a way that leaks secrets).

---

## Alert 3
**File:** D:\Agent\src\services\automationPipeline.ts
**Category:** SensitiveDataLeak / BrokenAccessControl
**Severity: HIGH | Confidence: 8/10**
**Problem:** dispatchToWebhook and generatePaymentInvoiceLink appear to be invoked from client-side code (AgentExecutor / App.tsx). Client-side POSTs to arbitrary webhook URLs (or creation of payment links) will expose webhook URLs and payment link templates to the browser environment and any page-level attacker. If webhook URLs embed secrets (common for services like Discord/Slack), exposing them to the browser leaks those secrets.

**Evidence:** Project structure shows automationPipeline.ts under src/services; AgentExecutor (src/services/agentExecutor.ts) runs in the frontend and "calls AutomationPipeline.generatePaymentInvoiceLink and AutomationPipeline.dispatchToWebhook". App.tsx holds webhookConfig and when webhookConfig.enabled AutomationPipeline.dispatchToWebhook is called during handleRunTask.

**Impact:** An attacker able to run script in the page (XSS) or a malicious extension can read webhook and payment URLs from memory/config and exfiltrate them. Leaked webhook URLs can be abused to post arbitrary content to receivers. Payment URLs containing identifiers/queries could be used for phishing or to link transactions to user accounts.

**Suggested fix:**
- Do not store or call sensitive webhook URLs from purely client-side code. Perform webhook calls from a server where secrets are stored securely.
- If the user must provide webhook URLs in the client for configuration, only store an opaque identifier client-side and map it to the real URL server-side (or encrypt it and require user authentication to retrieve it).
- On the server, validate and sanitize user-supplied webhook targets to avoid SSRF or blind data exfiltration.

---

## Alert 4
**File:** D:\Agent\src\services\automationPipeline.ts
**Category:** StringInjection (Payment link construction)
**Severity: MEDIUM | Confidence: 8/10**
**Problem:** generatePaymentInvoiceLink constructs payment URLs for multiple providers (Stripe, PayPal, UPI, crypto, custom). If user input (invoice id, amount, return URLs) is embedded into these URLs without proper validation or encoding, an attacker can inject characters that alter the link target (open redirect), cause phishing, or produce malformed links that leak data to third parties.

**Evidence:** File summary: "generatePaymentInvoiceLink() builds payment URLs (stripe, paypal, upi, crypto, custom)". The code appears in src/services/automationPipeline.ts and is called by AgentExecutor.

**Impact:** Malformed or attacker-controlled payment links can be used in phishing campaigns, redirect users to attacker-controlled payment collectors, or leak transaction metadata. If links include sensitive query parameters, those will be exposed to referrers and logs.

**Suggested fix:**
- Properly validate and URL-encode all user-supplied fields used in URL construction.
- For custom URLs, restrict allowed URL schemes to https and disallow javascript:, data:, file: and similar schemes.
- Canonicalize and validate hostnames when embedding return/notify URLs; avoid allowing arbitrary redirect targets (use an allowlist).
- Avoid placing secrets or PII in query parameters; use server-side state referenced by short opaque IDs instead.

---

## Alert 5
**File:** D:\Agent\src\App.tsx
**Category:** Authorization / SensitiveDataLeak
**Severity: MEDIUM | Confidence: 8/10**
**Problem:** Auto-pilot/autodispatch features can run handleRunTask automatically (autoIntervalMinutes default 1). When combined with webhookConfig.enabled, the app may auto-dispatch deliverables without per-deliverable user confirmation, potentially sending sensitive data (including user-provided prompts, search results, or API responses) to configured webhooks.

**Evidence:** App.tsx excerpts: config.geminiApiKey stored in state; webhookConfig and paymentConfig state exist; AutomationPipeline.dispatchToWebhook called in handleRunTask when webhookConfig.enabled; Auto-pilot default inactive but can be enabled and autoIntervalMinutes default 1.

**Impact:** If a user enables autopilot, the app could automatically disclose sensitive or private data to configured webhook endpoints without explicit, moment-of-action consent. Automated frequency (1 minute) increases exposure and the blast radius of any misconfiguration.

**Suggested fix:**
- Require explicit opt-in for autopilot + auto-dispatch and surface a clear confirmation dialog that enumerates what gets dispatched (fields, any included PII, API results).
- Implement per-deliverable review workflows, or require server-side gating/approval for any webhook dispatches that include sensitive fields.
- Add a clear audit log (server-side) of automatically dispatched items so users can review and revoke access if needed.

---

# Overall recommendation (priority order)
1. Stop storing and using long-lived API keys in client-side code; move secret handling to server-side proxies.
2. Prevent client-side webhook dispatch to arbitrary URLs; perform webhook posting server-side and sign payloads.
3. Sanitize and encode all user input used to construct external URLs (payments, webhooks). Disallow non-HTTPS schemes.
4. Harden the UI and application against XSS (CSP, input sanitization) to reduce risk of client-side secret exfiltration.
5. Add explicit UI confirmations and server-side audit/logging for any automated dispatch/autopilot features.

# Notes on scope and confidence
- Findings are limited to the code paths provided: Navbar.tsx, App.tsx, AutomationPipeline and AgentExecutor references. Where full file content exists (automationPipeline.ts), the finding references its documented behaviors (raw POSTs via fetch(), link generation). All issues reported have confidence >= 8/10 unless noted otherwise.

# Artifact
- Report saved to: D:\Agent\security_findings.md

