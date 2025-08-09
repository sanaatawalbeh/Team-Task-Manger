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

    const valid = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (valid.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team." });
    }

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
    const roleCheck = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [created_by, team_id]
    );

    if (roleCheck.rowCount === 0 || roleCheck.rows[0].role !== "leader") {
      return res
        .status(403)
        .json({ error: "Only team leaders can assign tasks." });
    }

    const memberCheck = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [assigned_to, team_id]
    );

    if (memberCheck.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "Assigned user is not a member of this team." });
    }

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

    const valid = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (valid.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team." });
    }

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


//get task by id
router.get("/:taskId", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const taskRes = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
      taskId,
    ]);

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = taskRes.rows[0];

    const roleRes = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, task.team_id]
    );

    if (roleRes.rowCount === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//delete tasks , member can only delete the tasks that who assign it to themselves
//leader can delete any task in the team
router.delete("/:taskId", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const taskRes = await pool.query(
      `SELECT team_id, created_by, assigned_to FROM tasks WHERE id = $1`,
      [taskId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { team_id, created_by, assigned_to } = taskRes.rows[0];

    const roleRes = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, team_id]
    );

    if (roleRes.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team" });
    }

    const role = roleRes.rows[0].role;

    if (role === "leader") {
      await pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
      return res.json({ message: "Task deleted by leader" });
    }

    const isCreatedByHim = created_by === userId;
    const isAssignedToHim = assigned_to === userId;

    if (isCreatedByHim && isAssignedToHim) {
      await pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
      return res.json({
        message: "Task deleted (created by you and assigned to you)",
      });
    }

    return res
      .status(403)
      .json({ error: "You are not allowed to delete this task" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//edit tasks
router.put("/:taskId", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const { title, description, due_date, priority, status } = req.body;

  try {
    const taskRes = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
      taskId,
    ]);

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = taskRes.rows[0];
    const teamId = task.team_id;

    const roleRes = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (roleRes.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team" });
    }

    const role = roleRes.rows[0].role;

    const isLeader = role === "leader";
    const isOwner = task.created_by === userId;

    if (!isLeader && !isOwner) {
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this task" });
    }

    await pool.query(
      `INSERT INTO task_edits (
        task_id, edited_by,
        old_title, new_title,
        old_description, new_description,
        old_due_date, new_due_date,
        old_priority, new_priority,
        old_status, new_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        taskId,
        userId,
        task.title,
        title,
        task.description,
        description,
        task.due_date,
        due_date,
        task.priority,
        priority,
        task.status,
        status,
      ]
    );

    await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           due_date = $3,
           priority = $4,
           status = $5
       WHERE id = $6`,
      [title, description, due_date, priority, status, taskId]
    );

    return res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//view edit history
router.get("/:taskId/edits", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const taskRes = await pool.query(
      `SELECT team_id FROM tasks WHERE id = $1`,
      [taskId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { team_id } = taskRes.rows[0];

    const memberRes = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, team_id]
    );

    if (memberRes.rowCount === 0) {
      return res.status(403).json({ error: "You're not part of this team" });
    }

    const editsRes = await pool.query(
      `SELECT te.*, u.full_name AS editor_name
       FROM task_edits te
       LEFT JOIN users u ON te.edited_by = u.id
       WHERE te.task_id = $1
       ORDER BY te.edited_at DESC`,
      [taskId]
    );

    return res.json({ edits: editsRes.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//edit status
router.patch("/:taskId/status", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const allowedStatuses = ["todo", "in_progress", "done"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const taskRes = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
      taskId,
    ]);
    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = taskRes.rows[0];


    const roleRes = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, task.team_id]
    );
    if (roleRes.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team" });
    }


    await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [
      status,
      taskId,
    ]);

    return res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:taskId/editstatus", routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const { status } = req.body;

  try {
    const taskRes = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
      taskId,
    ]);
    if (taskRes.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const task = taskRes.rows[0];
    const teamId = task.team_id;

    const roleRes = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (roleRes.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not a member of this team" });
    }

    const role = roleRes.rows[0].role;

    const isLeader = role === "leader";
    const isAssigned = task.assigned_to === userId;

    if (!isLeader && !isAssigned) {
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this task status" });
    }

    await pool.query(
      `INSERT INTO task_edits (
        task_id, edited_by,
        old_status, new_status
      ) VALUES ($1,$2,$3,$4)`,
      [taskId, userId, task.status, status]
    );

    await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [
      status,
      taskId,
    ]);

    return res.json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
