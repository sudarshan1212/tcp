const net = require("net");

const PORT = 5000;
const HOST = "127.0.0.1";

// Create TCP client
const client = new net.Socket();

// Connect to the server
client.connect(PORT, HOST, () => {
  console.log("Connected to the server");

  // Send a CREATE request every 5 seconds
  setInterval(() => {
    const createRequest = JSON.stringify({
      action: "CREATE",
      payload: {
        name: `Item${Date.now()}`, // Unique name based on timestamp
        value: Math.floor(Math.random() * 1000), // Random value between 0-999
      },
    });

    console.log("Sending CREATE request:", createRequest);
    client.write(createRequest);
  }, 5000); // 5 seconds interval
});

// Listen for data from the server
client.on("data", (data) => {
  console.log("Received from server:", data.toString());
});

// Handle client close
client.on("close", () => {
  console.log("Connection closed");
});

// Handle errors
client.on("error", (err) => {
  console.error("Client error:", err);
});

// const net = require("net");

// const PORT = 5000;
// const HOST = "127.0.0.1";

// // Create TCP client
// const client = new net.Socket();

// // Connect to the server
// // client.connect(PORT, HOST, () => {
// //   console.log("Connected to the server");

// //   // Example: Send a CREATE request
// // //   const createRequest = JSON.stringify({
// // //     action: "CREATE",
// // //     payload: { name: "Item1", value: 100 },
// // //   });
// // //   const readRequest = JSON.stringify({
// // //     action: "READ",
// // //     payload: { name: "Item1" }, // Replace with your filter query
// // //   });
// // //   const updateRequest = JSON.stringify({
// // //     action: "UPDATE",
// // //     payload: {
// // //       filter: { name: "Item1" }, // Filter to find the item
// // //       update: { value: 200 } // Update the item's value
// // //     },
// // //   });

// // //   // DELETE: Remove an item from the database
// // //   const deleteRequest = JSON.stringify({
// // //     action: "DELETE",
// // //     payload: { name: "Item1" }, // Filter to find the item
// // //   });
// //   client.write(createRequest);
// // });
// client.connect(PORT, HOST, () => {
//   console.log("Connected to the server");

//   // Send a CREATE request every 5 seconds
//   setInterval(() => {
//     const createRequest = JSON.stringify({
//       action: "CREATE",
//       payload: {
//         name: `Item${Date.now()}`, // Unique name based on timestamp
//         value: Math.floor(Math.random() * 1000), // Random value between 0-999
//       },
//     });

//     console.log("Sending CREATE request:", createRequest);
//     client.write(createRequest);
//   }, 5000); // 5 seconds interval
// });
// // Listen for data from the server
// client.on("data", (data) => {
//   console.log("Received from server:", data.toString());

//   // Close the client after receiving response
//   client.destroy();
// });

// // Handle client close
// client.on("close", () => {
//   console.log("Connection closed");
// });

// // Handle errors
// client.on("error", (err) => {
//   console.error("Client error:", err);
// });
