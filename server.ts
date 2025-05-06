import { createServer, IncomingMessage, ServerResponse } from "http";
import { hrtime } from "process";
import { Readable } from "stream";

const clients: Array<{ id: string; response: any }> = [];

const server = createServer((req, res) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log("request received: ", pathname);
  if (pathname === "/stream") {
    handle_stream(req, res);
  } else if (req.url === "/sse") {
    handle_sse(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});

function handle_stream(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const urlParams = new URLSearchParams(req.url?.split("?")[1]);
  const id = urlParams.get("id") ?? "1";

  console.log("stream requested with id:", id);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new Readable({
    read() {
      setInterval(() => {
        this.push(`${id}`);
      }, 1000);
    },
  });

  req.on("close", () => {
    console.log("client disconnected ", id);
    stream.destroy();
    res.end();
  });

  stream.pipe(res);
}

function handle_sse(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const client = {
    id: `${hrtime.bigint()}`,
    response: res,
  };

  clients.push(client);

  const interval = setInterval(() => {
    for (const client of clients) {
      const data = `data: ${client.id}\n\n`;
      client.response.write(data);
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
    clients.splice(clients.indexOf(client), 1);
    res.end();
  });
}
