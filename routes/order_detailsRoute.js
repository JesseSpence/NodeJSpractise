const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM order_details", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post('/', (req, res) => {
  const {order_detail_id, product_id, order_id, price, sku, quantity} = req.body
  try {
    con.query(`INSERT INTO  order_details (order_detail_id, product_id, order_id, price, sku, quantity) values ('${order_detail_id}','${product_id}','${order_id}','${price}','${sku}','${quantity}')`,

      (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(err)
  }
})

module.exports = router;