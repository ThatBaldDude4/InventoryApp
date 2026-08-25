const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// parse url data
app.use(express.urlencoded({extended: true}));

// setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// setup public folder routing for static assets
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running on port ${PORT}`);
});