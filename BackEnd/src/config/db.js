const dns = require("dns");
const mongoose = require("mongoose");

const configureDns = () => {
  const servers = process.env.DNS_SERVERS;

  if (!servers) {
    return;
  }

  dns.setServers(
    servers
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  );
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  configureDns();

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
