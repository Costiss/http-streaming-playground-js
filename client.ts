async function fetchAndLogStream(url: string, id: number): Promise<void> {
  console.log(`Connection ${id} established`);
  const response = await fetch(`${url}?id=${id}`);

  if (!response.body) {
    console.error(`Connection ${id} failed - no response body`);
    return;
  }

  const reader = response.body.getReader();

  let msg = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log(`Connection ${id} done`);
    }

    const chunk = new TextDecoder().decode(value, { stream: true });
    if (chunk) {
      msg += chunk;
      console.log(`Connection ${id} chunk: ${chunk}`);
      console.log(`Connection ${id} msg: ${msg}`);
    }
  }
}

async function main() {
  const url = "http://localhost:3000/stream";

  const requests = Array.from({ length: 10 }, (_, i) =>
    fetchAndLogStream(url, i),
  );

  await Promise.all(requests);
}

main().catch(console.error);
