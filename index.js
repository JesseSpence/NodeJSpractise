// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally

// Import routes
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const categoryRoute = require("./routes/categoryRoute");
const order_detailsRoute = require("./routes/order_detailsRoute");
const registerRoute = require("./routes/userRoute");

// Configure Server
const app = express(); // Initialize express as an app variable

app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors

//import to html 
app.use(express.static("Public"));

// This is where we check URLs and Request methods to create functionality
// GET '/' is always what will be displayed on the home page of your application
// app.get("/", (req, res) => {
//   res.json({ msg: "Welcome" });
// });
app.get("/" , function(req , res){
  res.sendFile(__dirname + "/users" + "index.html");
})
// Use individual routes when visiting these URLS
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/categories", categoryRoute);
app.use("/order_details", order_detailsRoute);
app.use("/register", registerRoute);

// Set up server to start listening for requests
app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
