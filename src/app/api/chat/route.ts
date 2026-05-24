export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, baseUrl, apiKey, model } = body;

  if (!baseUrl || !apiKey || !model) {
    return Response.json(
      { error: "Missing API configuration. Please configure settings first." },
      { status: 400 }
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    if (!response.body) {
      return Response.json({ error: "No response body" }, { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
