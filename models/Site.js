const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "unknown" },
});

module.exports = mongoose.model("Site", siteSchema);