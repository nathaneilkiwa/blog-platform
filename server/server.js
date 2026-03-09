const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ✅ MUST be BEFORE routes
app.use(cors());
app.use(express.json());  // THIS LINE IS CRITICAL

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Blog API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});