const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = require("express").Router();
const routeGuard = require("../middleware/verifytoken");

//register new user
router.post("/register", async (req, res) => {
  const { full_name, email, password, birth_date, gender, phone_number } =
    req.body;

  if (!full_name || !email || !password || !birth_date || !gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedpassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, birth_date, gender, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email,password`,
      [full_name, email, hashedpassword, birth_date, gender, phone_number]
    );

    res.json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      res.status(409).send("email already exist ");
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

//login exist user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: "Email is not found" });

    //campare the enter password with the hashed password

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({ token });
  } catch (error) {
    console.log("Error logging in ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//git profile
router.get("/profile", routeGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, full_name, email, birth_date, gender, phone_number, profile_image FROM users WHERE id = $1",
      [userId]
    );

    res.json(result.rows[0]);
    console.log(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//edit profile
router.put("/profile", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { full_name, email, birth_date, gender, phone_number, profile_image } =
    req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET full_name = $1,
          email = $2,
          birth_date = $3,
          gender = $4,
          phone_number = $5,
          profile_image = $6
      WHERE id = $7
      RETURNING id, full_name, email, birth_date, gender, phone_number, profile_image;
      `,
      [
        full_name,
        email,
        birth_date,
        gender,
        phone_number,
        profile_image,
        userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

//change password
router.put("/changePassword", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { old_password, new_password } = req.body;

  if (!old_password || !new_password) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required." });
  }

  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = result.rows[0].password;

    const isMatch = await bcrypt.compare(old_password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      newHashedPassword,
      userId,
    ]);

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password." });
  }
});

//edit profile picture
router.put("/editpicture", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const { profile_image } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      RETURNING id,email,profile_image;
      `,
      [profile_image, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Failed to update profile image." });
  }
});

module.exports = router;
