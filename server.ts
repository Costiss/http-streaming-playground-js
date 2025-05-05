import fastify, { FastifyReply } from "fastify";
import { Readable } from "stream";

const app = fastify();

app.get("/stream", async (request, reply) => {
  // Set headers for streaming
  reply.header("Content-Type", "text/event-stream");
  reply.header("Cache-Control", "no-cache");
  reply.header("Connection", "keep-alive");

  const id = (request.query as { id: string }).id ?? "1";
  console.log("stream requested with id:", id);

  const stream = new Readable({
    read() {
      setInterval(() => {
        this.push(`${id}`);
      }, 1000); // Push data every second
    },
  });

  request.raw.on("close", () => {
    console.log("client disconnected ", id);
    stream.destroy();
    reply.raw.end();
  });

  return reply.send(stream);
});

let clients: Array<{ id: string; reply: FastifyReply }> = [];
app.get("/sse", async (request, reply) => {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
  reply.raw.writeHead(200, headers);

  const client = {
    id: request.id,
    reply,
  };

  clients.push(client);

  const interval = setInterval(() => {
    for (const client of clients) {
      const data = `data: ${client.id}\n\n`;
      client.reply.raw.write(data);
    }
  }, 1000);

  request.raw.on("close", () => {
    clearInterval(interval);
    clients = clients.filter((c) => c !== client);
    reply.raw.end();
  });
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
