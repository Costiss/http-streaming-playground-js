import { EventSource } from "eventsource";

for (let i = 0; i < 10; i++) {
  const eventSource = new EventSource("http://localhost:3000/events");

  eventSource.onmessage = (event) => {
    console.log("Client ", i, "New message from server", event.data);
  };

  eventSource.onerror = (error) => {
    console.error("Error occurred:", error);
    eventSource.close();
  };
}
console.log("SSE clients connected to /events endpoint.");
