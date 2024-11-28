const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authenticate = require("./middleware/auth");
const Site = require("./models/Site");
const User = require("./models/User");
const Notification = require("./models/Notification");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://matindev:Matin@cluster0.lcv6xlw.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch(err => console.error(err));

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sites", authenticate, async (req, res) => {
  const { url } = req.body;
  try {
    const site = new Site({ url, userId: req.user.userId });
    await site.save();
    res.status(201).json(site);

    const notification = new Notification({
      message: `New site added: ${url}`,
      userId: req.user.userId,
    });
    await notification.save();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sites", authenticate, async (req, res) => {
  try {
    const sites = await Site.find({ userId: req.user.userId });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/notifications", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));