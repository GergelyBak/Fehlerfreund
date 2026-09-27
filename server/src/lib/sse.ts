import type { Response } from "express";

// Server-Sent Events over a POST response. The browser reads it with
// fetch + a stream reader, because EventSource only supports GET.
export function initSse(res: Response) {
  res.status(200).set({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    // Stops reverse proxies (nginx, some PaaS) from buffering the stream.
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();
}

export function sendEvent(res: Response, event: string, data: unknown) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
