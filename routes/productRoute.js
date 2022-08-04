const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post('/', (req, res) => {
  const {sku, name, price, weight, descriptions, thumbnail, image, category, create_date, stock} = req.body
  try {
    con.query(`INSERT INTO  products (sku, name, price, weight, descriptions, thumbnail, image, category, create_date, stock) values ("${sku}",'${name}','${price}','${weight}','${descriptions}','${thumbnail}','${image}', '${category}','${create_date}','${stock}')`,

      (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(err)
  }
})

module.exports = router;