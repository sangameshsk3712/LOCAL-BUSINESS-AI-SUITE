/**
 * CommonJS entry point for Cloud Run / Production deployment
 */
process.env.PORT = process.env.PORT || 3000;

try {
  module.exports = require("./dist/server.cjs");
} catch (err) {
  console.log("Loading server via dynamic import fallback...");
  import("./server.ts").catch((e) => {
    console.error("Failed to start server fallback:", e);
  });
}

