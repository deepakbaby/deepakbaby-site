import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("hearts");
  const url = new URL(req.url);
  const issueId = url.searchParams.get("id");

  if (!issueId) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const count = await store.get(issueId);
    return new Response(JSON.stringify({ count: parseInt(count || "0", 10) }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const delta = body.action === "unlike" ? -1 : 1;
    const current = parseInt((await store.get(issueId)) || "0", 10);
    const next = Math.max(0, current + delta);
    await store.set(issueId, String(next));
    return new Response(JSON.stringify({ count: next }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/.netlify/functions/hearts",
};
