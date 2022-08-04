const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post('/', (req, res) => {
  const {order_id, user_id, amount, shipping_address, order_email, order_date, order_status} = req.body
  try {
    con.query(`INSERT INTO  orders (order_id, user_id, amount, shipping_address, order_email, order_date, order_status) values ('${order_id}','${user_id}','${amount}','${shipping_address}','${order_email}','${order_date}','${order_status}')`,

      (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(err)
  }
})

module.exports = router;