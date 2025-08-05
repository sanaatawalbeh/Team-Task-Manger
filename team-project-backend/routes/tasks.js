const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = require("express").Router();
const routeGuard = require("../middleware/verifytoken");

// create new task for login user
router.post("/create", routeGuard, async (req, res) => {
  const { team_id, title, description, due_date, priority } = req.body;
  const user_id = req.user.id;
  const assigned_to = req.body.assigned_to || user_id;

  try {
    await pool.query(
      `INSERT INTO tasks (team_id, title, description, due_date, priority, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [team_id, title, description, due_date, priority, user_id, assigned_to]
    );

    res.status(201).json({ message: "Task created successfully." });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// show all team tasks
router.get("/teamtasks", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const teamId = req.query.team_id;

  try {
    if (!teamId) {
      return res.status(400).json({ error: "Missing team_id" });
    }

    // ✅ Check if user is part of this team
    const valid = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (valid.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team." });
    }

    // ✅ Get tasks for this team
    const tasksResult = await pool.query(
      `
      SELECT 
        tasks.*,
        assigned_user.full_name AS assigned_to_name,
        assigned_user.profile_image AS assigned_to_image,
        creator_user.full_name AS created_by_name,
        creator_user.profile_image AS created_by_image
      FROM tasks
      JOIN users AS assigned_user ON tasks.assigned_to = assigned_user.id
      JOIN users AS creator_user ON tasks.created_by = creator_user.id
      WHERE tasks.team_id = $1
      ORDER BY tasks.due_date ASC
      `,
      [teamId]
    );

    res.json(tasksResult.rows);
  } catch (err) {
    console.error("Error fetching team tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create task for someone else in the team
router.post("/taskto", routeGuard, async (req, res) => {
  const { team_id, title, description, due_date, priority, assigned_to } =
    req.body;
  const created_by = req.user.id;

  try {
    // تحقق: هل المستخدم قائد؟
    const roleCheck = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [created_by, team_id]
    );

    if (roleCheck.rowCount === 0 || roleCheck.rows[0].role !== "leader") {
      return res
        .status(403)
        .json({ error: "Only team leaders can assign tasks." });
    }

    // تحقق: هل الشخص المعين عضو بالفريق؟
    const memberCheck = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [assigned_to, team_id]
    );

    if (memberCheck.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "Assigned user is not a member of this team." });
    }

    // أضف المهمة
    await pool.query(
      `INSERT INTO tasks (team_id, title, description, due_date, priority, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [team_id, title, description, due_date, priority, created_by, assigned_to]
    );

    res
      .status(201)
      .json({ message: "Task created and assigned successfully." });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get my tasks in the current team 
router.get("/mytasks", routeGuard, async (req, res) => {
  const userId = req.user.id;
  const teamId = req.query.team_id;

  try {
    if (!teamId) {
      return res.status(400).json({ error: "Missing team_id" });
    }

    // ✅ تأكد إنه المستخدم فعلاً ضمن الفريق الحالي
    const valid = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (valid.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team." });
    }

    // ✅ جيب المهام التابعة لهاليوزر ضمن الفريق الحالي
    const tasksResult = await pool.query(
      `
      SELECT 
        tasks.*,
        assigned_user.full_name AS assigned_to_name,
        assigned_user.profile_image AS assigned_to_image,
        creator_user.full_name AS created_by_name,
        creator_user.profile_image AS created_by_image
      FROM tasks
      JOIN users AS assigned_user ON tasks.assigned_to = assigned_user.id
      JOIN users AS creator_user ON tasks.created_by = creator_user.id
      WHERE tasks.team_id = $1 AND tasks.assigned_to = $2
      ORDER BY tasks.due_date ASC
      `,
      [teamId, userId]
    );

    res.json(tasksResult.rows);
  } catch (err) {
    console.error("Error fetching my tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
