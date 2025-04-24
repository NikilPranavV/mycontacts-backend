const express = require("express");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); //middleware for the client to req to parse json

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.use(errorHandler); //using for handling error



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});