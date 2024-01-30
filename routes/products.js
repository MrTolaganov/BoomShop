import { Router } from "express";
import Product from "../models/Product.js";
import loginPage from "../middleware/login-page.js";
import userMiddleware from "../middleware/user.js";

const router = Router();

// Home route
router.get("/", async (req, res) => {
  const products = await Product.find().lean();

  res.render("index", {
    title: "Boom Shop",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});

// Product(s) routes
router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();

  res.render("product", { product });
});

router.get("/edit-product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();

  res.render("edit-product", { product, editError: req.flash("editError") });
});

router.post("/edit-product/:id", async (req, res) => {
  const { title, description, image, price } = req.body;
  const id = req.params.id;

  if (!title || !description || !image || !price) {
    req.flash("editError", "All fields are required");
    res.redirect(`/edit-product/${id}`);
    return;
  }

  await Product.findByIdAndUpdate(id, req.body, { new: true });

  res.redirect("/products");
});

router.post("/delete-product/:id", async (req, res) => {
  const id = req.params.id;

  await Product.findByIdAndDelete(id);
  res.redirect("/");
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProducts = await Product.find({ user }).populate("user").lean();

  res.render("products", {
    title: "Products",
    isProducts: true,
    myProducts,
  });
});

// Add routes
router.get("/add", loginPage, (req, res) => {
  res.render("add", {
    title: "Add product",
    isAdd: true,
    addError: req.flash("addError"),
  });
});

router.post("/add", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("addError", "All fields are required");
    res.redirect("/add");
    return;
  }
  await Product.create({ ...req.body, user: req.userId });
  res.redirect("/");
});

export default router;
