import express from "express";
import { create } from "express-handlebars";
import ProductsRouter from "./routes/products.js";
import AuthRouter from "./routes/auth.js";

const app = express();
const hbs = create({ defaultLayout: "main", extname: "hbs" });
// const pass = "LWHo74NDMEEM2GID"

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(ProductsRouter);
app.use(AuthRouter);

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
