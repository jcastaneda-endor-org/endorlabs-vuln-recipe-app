import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Intentionally vulnerable endpoint: performs unvalidated outbound HTTP request from user-provided URL.
// axios@0.21.0 has known issues and this usage demonstrates an SSRF sink.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  try {
    const resp = await axios.get(target);
    return NextResponse.json({ status: resp.status, headers: resp.headers, snippet: String(resp.data).slice(0, 200) });
  } catch (error: any) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}


