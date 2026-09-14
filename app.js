import express from "express";
import path from "node:path";
const app = express();
const PORT = process.env.PORT || 8000;

// routers
import indexRouter from "./routes/indexRouter.js";
import productsRouter from "./routes/productsRouter.js";

// parse url data
app.use(express.urlencoded({extended: true}));

// setup view engine
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

// setup public folder routing for static assets
app.use(express.static(path.join(import.meta.dirname, "public")));

// wire routers
app.use("/", indexRouter);
app.use("/products", productsRouter);

// catch all router
app.all(/.*/, (req, res, next) => {
    res.status(500).render("error");
})

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error");
});


app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running on http://localhost:${PORT}`);
});   