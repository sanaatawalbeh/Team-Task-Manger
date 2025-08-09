const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = require("express").Router();
const routeGuard = require("../middleware/verifytoken");

// POST /:taskId
router.post("/create/:taskId",routeGuard, async (req, res) => {
  const { taskId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id; 

  if (!comment) return res.status(400).json({ error: "Comment is required." });

  try {
    await pool.query(
      `INSERT INTO task_comments (task_id, user_id, comment)
       VALUES ($1, $2, $3)`,
      [taskId, userId, comment]
    );

    res.status(201).json({ message: "Comment added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// GET /comments/:taskId
router.get("/showAll/:taskId",routeGuard, async (req, res) => {
  const { taskId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT 
          c.id,
          c.comment,
          c.created_at,
          u.full_name,
          u.profile_image
       FROM task_comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [taskId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// PUT /comments/:commentId
router.put("/editComment/:commentId",routeGuard , async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  if (!comment) return res.status(400).json({ error: "Comment is required." });

  try {
    const { rowCount } = await pool.query(
      `UPDATE task_comments
       SET comment = $1
       WHERE id = $2 AND user_id = $3`,
      [comment, commentId, userId]
    );

    if (rowCount === 0)
      return res
        .status(403)
        .json({ error: "You can only edit your own comments." });

    res.json({ message: "Comment updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment." });
  }
});

// DELETE /comments/:commentId
router.delete("/deleteComment/:commentId", routeGuard, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM task_comments
       WHERE id = $1 AND user_id = $2`,
      [commentId, userId]
    );

    if (rowCount === 0)
      return res
        .status(403)
        .json({ error: "You can only delete your own comments." });

    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});


module.exports = router;
