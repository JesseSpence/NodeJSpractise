const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post('/', (req, res) => {
  const {category_id, name, description, thumbnail} = req.body
  try {
    con.query(`INSERT INTO categories (category_id, name, description, thumbnail) values ('${category_id}','${name}','${description}','${thumbnail}')`,

      (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(err)
  }
})

module.exports = router;