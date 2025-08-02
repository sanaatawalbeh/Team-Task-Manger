const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = require("express").Router();
const routeGuard = require("../middleware/verifytoken");

//create new team
router.post("/create", routeGuard, async (req, res) => {
  const { name, code } = req.body;
  const createdBy = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO teams (name, code, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, created_by, created_at`,
      [name, code, createdBy]
    );

    const createdTeam = result.rows[0];

    await pool.query(
      `INSERT INTO team_members (user_id, team_id, role)
       VALUES ($1, $2, 'leader')`,
      [createdBy, createdTeam.id]
    );

    const userResult = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [createdTeam.created_by]
    );

    createdTeam.created_by = userResult.rows[0]?.email || null;

    res.status(201).json(createdTeam);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Team code already exists." });
    }
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

//join existing team 
router.post("/join", routeGuard, async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  try {

    const teamResult = await pool.query(
      "SELECT id FROM teams WHERE code = $1",
      [code]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: "Team not found with this code." });
    }

    const teamId = teamResult.rows[0].id;

    const checkMember = await pool.query(
      "SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2",
      [teamId, userId]
    );

    if (checkMember.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "You are already a member of this team." });
    }

    const insert = await pool.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'member')
       RETURNING *`,
      [teamId, userId]
    );

    res
      .status(200)
      .json({
        message: "Successfully joined the team.",
        joined: insert.rows[0],
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/myteam", routeGuard, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.name,
        t.code,
        tm.role,
        t.created_at
      FROM 
        team_members tm
      JOIN 
        teams t ON tm.team_id = t.id
      WHERE 
        tm.user_id = $1
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching user's teams:", err);
    res.status(500).json({ error: "Server error." });
  }
});



module.exports = router;
