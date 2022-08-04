const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');

// MIDDLEWARE
router.get("/",  (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// GET ALL USERS
// router.get("/", (req, res) => {
//   try {
//     con.query("SELECT * FROM users", (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

//ADD A USER
router.post("/", (req, res) => {
  const {
    email,
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    phone,
    user_type,
  } = req.body;
  try {
    con.query(
      `INSERT INTO users (email, password, full_name, billing_address, default_shipping_address, country, phone, user_type) values ("${email}","${password}","${full_name}","${billing_address}","${default_shipping_address}","${country}","${phone}", "${user_type}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// GET SINGLE USER
router.get("/", middleware, (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id= ${req.user.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//EDIT A USER
router.put("/:id", (req, res) => {
  const {
    email,
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    phone,
    user_type,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET email="${email}", password="${hash}", full_name="${full_name}", billing_address="${billing_address}", default_shipping_address="${default_shipping_address}", country="${country}", phone="${phone}", user_type="${user_type}" WHERE user_id= ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE A USER
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "Delete from users WHERE ?";
      let users = { user_id: req.params.id };
      con.query(sql, users, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
});

// LOGIN
// router.patch("/", (req, res) => {
//   const { email, password } = req.body;
//   try {
//     con.query(
//       `SELECT * FROM users WHERE email="${email}" AND password="${password}"`,
//       (err, result) => {
//         if (err) throw err;
//         res.send(result);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

// Register
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      full_name,
      email,
      phone,
      user_type,
      country,
      billing_address,
      default_shipping_address,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let user = {
      full_name,
      email,
      // We sending the hash value to be stored witin the table
      password: hash,
      user_type,
      phone,
      country,
      billing_address,
      default_shipping_address,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json({
        status: 'ok',
        data: "User added"
      })
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
//Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        //Decryption
        //Accepts the password stored in the db and the password given by the user(req.body)
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        //If the password does not match
        if (!isMatch) {
          res.send("Password is Incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              full_name: result[0].full_name,
              email: result[0].email,
              user_type: result[0].user_type,
              phone: result[0].phone,
              country: result[0].country,
              billing_address: result[0].billing_address,
              default_shipping_address: result[0].default_shipping_address,
            },
          };
          //Creating a token and setting an expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});



// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

// Update user
router.put("/update-user", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.user.user_id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE user_id = ${req.user.user_id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          full_name: req.body.full_name,
          email: req.body.email,
          password: hash,
          user_type: req.body.user_type,
          phone: req.body.phone,
          country: req.body.country,
          billing_address: req.body.billing_address,
          default_shipping_address: req.body.default_shipping_address,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

module.exports = router;
