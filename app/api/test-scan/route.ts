import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import _ from "lodash";

// Test endpoint for PR scan testing
// Uses axios and lodash to test dependency scanning
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "default";
  
  // Test lodash usage
  const data = { test: "value", nested: { key: "value" } };
  const cloned = _.cloneDeep(data);
  const merged = _.merge({}, data, { newKey: "newValue" });
  
  // Test axios usage (but with safe default)
  let axiosTest = null;
  if (action === "fetch") {
    try {
      const response = await axios.get("https://httpbin.org/json");
      axiosTest = response.data;
    } catch (error) {
      axiosTest = { error: "Request failed" };
    }
  }
  
  return NextResponse.json({ 
    message: "PR scan test endpoint",
    cloned,
    merged,
    axiosTest,
    timestamp: new Date().toISOString()
  });
}

