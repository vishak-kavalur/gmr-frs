import { NextResponse } from "next/server";

// Mappings for target URLs and their respective API keys
const TARGET_URLS = {
  frs: process.env.FACE_API_GMR,
};

const API_KEYS = {
  frs: process.env.FACE_API_GMR_KEY,
};

// Helper function to validate service and endpoint
const resolveTarget = (service, endpoint) => {
  if (!service || !endpoint) {
    throw new Error('Missing "service" or "endpoint" query parameter');
  }

  const targetUrl = TARGET_URLS[service];
  const apiKey = API_KEYS[service];

  if (!targetUrl || !apiKey) {
    throw new Error(`Unknown service or missing API key: ${service}`);
  }

  return { targetUrl, apiKey };
};

// Handle GET requests
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const endpoint = searchParams.get("endpoint");
    const { targetUrl, apiKey } = resolveTarget(service, endpoint);
    // Initialize the target URL
    const url = new URL(`${targetUrl}${endpoint}`);

    

    // Check if there are additional query parameters
    if (searchParams.size > 2) {
      // Iterate over all search parameters
      searchParams.forEach((value, key) => {
        if (key !== "service" && key !== "endpoint") {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handle POST requests
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const endpoint = searchParams.get("endpoint");
    const { targetUrl, apiKey } = resolveTarget(service, endpoint);

    const body = await req.json();
    console.log("endpoint", targetUrl + endpoint);
    console.log("apiKey", apiKey);
    console.log("body", body);
    const response = await fetch(`${targetUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handle PATCH requests
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const endpoint = searchParams.get("endpoint");
    const { targetUrl, apiKey } = resolveTarget(service, endpoint);

    const body = await req.json();

    const response = await fetch(`${targetUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
