# HTTP Streaming Playground

This project serves as a playground for experimenting with **Server-Sent Events (SSE)** and **HTTP Streaming**. It includes examples and utilities to explore these technologies in a practical way.

## Features

- **SSE (Server-Sent Events):** Demonstrates real-time data streaming from the server to the client.
- **HTTP Streaming:** Explore techniques for streaming data over HTTP.
- **Lightweight Setup:** Built with minimal dependencies for ease of use.

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your system.

### Running the Examples

1. **Start the Server:**

   ```bash
   bun run server.ts
   ```

2. **Run the Client:**

   ```bash
   bun run client.ts
   ```

3. **Test SSE:**
   ```bash
   bun run sse.ts
   ```

## Project Structure

The project includes various modules and dependencies for HTTP streaming and SSE. Below are some key files:

- `server.ts`: Contains the server implementation for streaming.
- `client.ts`: A client-side script to consume streamed data.
- `sse.ts`: Demonstrates Server-Sent Events.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Feel free to fork this repository and submit pull requests to improve the examples or add new features.
