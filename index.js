// server.js
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");


//Enviromental variables
dotenv.config();
const app = express();


// Your CORS setup
const cors = require("cors");

const allowedOrigins = [
  process.env.CLIENT_URL,               // your Render frontend
  process.env.CLIENT_URL + "/",         // same but with trailing slash
  "http://localhost:4000",              // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static folder for images
app.use("/images", express.static(path.join(__dirname, "upload/images")));


// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// Multer Setup for Images
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });



//Mongoose schema for product
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const User = mongoose.model("User", {
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});


//Routes entry
app.get("/", (req, res) => {
  res.send("Ecommerce API is running 🚀");
});

// Upload image endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: true,
    image_url: `${process.env.BASE_URL || `http://localhost:${PORT}`}/images/${req.file.filename}`,
  });
});

// Add product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 0;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Remove product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, message: "Product removed" });
});

// Get all products
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({}, "-_id id name image category new_price old_price available");
  res.json(products);
});

// Signup
app.post("/signup", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already in use" });
  }

  let cart = {};
  for (let i = 0; i <= 300; i++) {
    cart[i] = 0;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    cartData: cart,
  });

  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
  res.json({ success: true, token });
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, message: "Invalid email" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.json({ success: false, message: "Invalid password" });

  const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
  res.json({ success: true, token });
});

// Middleware to verify token
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  const itemId = Number(req.body.itemId);
  let user = await User.findById(req.user.id);

  if (!user.cartData[itemId]) user.cartData[itemId] = 0;
  user.cartData[itemId] += 1;

  await User.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.json({ success: true, message: "Item added to cart" });
});

// Remove from cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  const itemId = Number(req.body.itemId);
  let user = await User.findById(req.user.id);

  if (user.cartData[itemId] > 0) user.cartData[itemId] -= 1;

  await User.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.json({ success: true, message: "Item removed from cart" });
});

// Get cart data
app.post("/getcart", fetchUser, async (req, res) => {
  let user = await User.findById(req.user.id);
  res.json(user.cartData);
});

// New collection
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(-8);
  res.send(newcollection);
});

// Popular in women
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
