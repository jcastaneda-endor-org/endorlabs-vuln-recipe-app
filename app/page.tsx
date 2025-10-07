"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [mergeResult, setMergeResult] = useState<any>(null);
  const [ssrfResult, setSsrfResult] = useState<any>(null);

  useEffect(() => {
    // Trigger the vulnerable merge API with a payload that attempts prototype pollution
    fetch("/api/vuln-merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ __proto__: { polluted: "yes" }, pantry: { oil: 1 } })
    })
      .then((r) => r.json())
      .then(setMergeResult)
      .catch((e) => setMergeResult({ error: String(e) }));

    // Trigger the SSRF-like endpoint with a public URL (to avoid failures offline)
    const url = encodeURIComponent("http://example.com");
    fetch(`/api/ssrf?url=${url}`)
      .then((r) => r.json())
      .then(setSsrfResult)
      .catch((e) => setSsrfResult({ error: String(e) }));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1>Vulnerable Recipe Hub</h1>
      <p>Intentional vulnerable demo for Endor Labs scanning.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Prototype Pollution via lodash.merge</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 6 }}>
{JSON.stringify(mergeResult, null, 2)}
        </pre>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Unvalidated Outbound Request via axios</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 6 }}>
{JSON.stringify(ssrfResult, null, 2)}
        </pre>
      </section>
    </main>
  );
}


