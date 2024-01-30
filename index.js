import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import flash from "connect-flash";
import varMiddleware from "./middleware/var.js";
import cookieParser from "cookie-parser";

// ROUTES
import ProductsRouter from "./routes/products.js";
import AuthRouter from "./routes/auth.js";
import session from "express-session";

dotenv.config();

const app = express();
const hbs = create({ defaultLayout: "main", extname: "hbs" });

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "Otabek", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(varMiddleware);

app.use(ProductsRouter);
app.use(AuthRouter);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
