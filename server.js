// var atatus = require("atatus-nodejs");

// atatus.start({
//   licenseKey: "lic_apm_aecd5ae2c88c4f14a3ac92d1e6833608",
//   appName: "nodetcp",
// });
// This line must come before importing any instrumented module.
const tracer = require('dd-trace').init()

const net = require("net");
const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017/auth"; // Replace with your MongoDB URI if needed
const DATABASE_NAME = "admin";
const COLLECTION_NAME = "items";

// Create MongoDB client
const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(DATABASE_NAME).collection(COLLECTION_NAME);
  } catch (err) {
    console.log("error");

    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// TCP Server setup
const PORT = 5000;
const server = net.createServer();

// Handle incoming connections
server.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("data", async (data) => {
    const collection = await connectToDatabase();
    const message = data.toString();
    let response;

    try {
      const parsedMessage = JSON.parse(message);

      const { action, payload } = parsedMessage;
      switch (action) {
        case "CREATE":
          const createResult = await collection.insertOne(payload);
          response = {
            status: "success",
            message: "Data created",
            id: createResult.insertedId,
          };
          break;

        case "READ":
          const readResult = await collection.find(payload).toArray();
          response = { status: "success", data: readResult };
          break;

        case "UPDATE":
          const { filter, update } = payload;
          const updateResult = await collection.updateOne(filter, {
            $set: update,
          });
          response = {
            status: "success",
            message: `Matched ${updateResult.matchedCount}, Modified ${updateResult.modifiedCount}`,
          };
          break;

        case "DELETE":
          const deleteResult = await collection.deleteOne(payload);
          response = {
            status: "success",
            message: `Deleted ${deleteResult.deletedCount} document(s)`,
          };
          break;

        default:
          response = { status: "error", message: "Invalid action" };
      }
    } catch (err) {
      response = {
        status: "error",
        message: "Error processing request",
        details: err.message,
      };
    }

    // Send response back to client
    socket.write(JSON.stringify(response));
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`TCP server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down server...");
  await client.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
