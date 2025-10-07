import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";

// Intentionally vulnerable endpoint: merges untrusted input into a base object.
// Using lodash.merge on attacker-controlled keys like __proto__ can result in prototype pollution (CVE-2020-8203 range versions).
export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseConfig = { featureFlags: { recommendations: true }, pantry: {}, user: { role: "guest" } } as Record<string, unknown>;

  // VULNERABLE: merge untrusted payload into baseConfig without sanitization
  const merged = _.merge({}, baseConfig, payload as Record<string, unknown>);

  // Demonstrate potential pollution effect
  // If client sends {"__proto__": {"polluted": "yes"}}, objects created afterwards may inherit polluted properties
  const testObject: Record<string, unknown> = {};

  return NextResponse.json({ merged, inheritedPolluted: (testObject as any).polluted ?? null });
}


