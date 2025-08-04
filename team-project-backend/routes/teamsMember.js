const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = require("express").Router();
const routeGuard = require("../middleware/verifytoken");

// Get members of a specific team
router.get("/:teamId", routeGuard, async (req, res) => {
  const { teamId } = req.params;

  try {
    const result = await pool.query(
      `SELECT u.full_name, tm.role, tm.user_id
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1`,
      [teamId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//add exiting user for existing team
router.post("/:teamId/addmember", routeGuard, async (req, res) => {
  const { teamId } = req.params;
  const { user_email, role } = req.body;
  const requestingUserId = req.user.id;

  try {
    const checkLeader = await pool.query(
      `SELECT 1 FROM team_members
       WHERE team_id = $1 AND user_id = $2 AND role = 'leader'`,
      [teamId, requestingUserId]
    );

    if (checkLeader.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "Only team leaders can add members." });
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [user_email]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const newUserId = userResult.rows[0].id;

    const exists = await pool.query(
      `SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, newUserId]
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({ error: "User is already a member." });
    }

    await pool.query(
      `INSERT INTO team_members (user_id, team_id, role)
       VALUES ($1, $2, $3)`,
      [newUserId, teamId, role || "member"]
    );

    res.json({ message: "Member added successfully." });
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//remove member from a team
router.delete("/:teamId/removemember", routeGuard, async (req, res) => {
  const { teamId } = req.params;
  const { user_email } = req.body;
  const requestingUserId = req.user.id;

  try {
    const isLeader = await pool.query(
      `SELECT 1 FROM team_members
       WHERE team_id = $1 AND user_id = $2 AND role = 'leader'`,
      [teamId, requestingUserId]
    );

    if (isLeader.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "Only team leaders can remove members." });
    }

    const userRes = await pool.query(`SELECT id FROM users WHERE email = $1`, [
      user_email,
    ]);

    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const targetUserId = userRes.rows[0].id;

    const membership = await pool.query(
      `SELECT role FROM team_members
       WHERE user_id = $1 AND team_id = $2`,
      [targetUserId, teamId]
    );

    if (membership.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "User is not a member of the team." });
    }

    if (targetUserId === requestingUserId) {
      return res
        .status(400)
        .json({ error: "Leaders cannot remove themselves." });
    }

    await pool.query(
      `DELETE FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [targetUserId, teamId]
    );

    res.json({ message: "Member removed successfully." });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//leave team
router.delete("/:teamId/leave", routeGuard, async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;

  try {
    const membership = await pool.query(
      `SELECT role FROM team_members
       WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (membership.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "You're not a member of this team." });
    }

    const userRole = membership.rows[0].role;

    if (userRole === "leader") {
      const otherLeaders = await pool.query(
        `SELECT COUNT(*) FROM team_members
         WHERE team_id = $1 AND role = 'leader' AND user_id != $2`,
        [teamId, userId]
      );

      const leaderCount = parseInt(otherLeaders.rows[0].count);

      if (leaderCount === 0) {
        return res.status(400).json({
          error:
            "You are the only leader. Assign another leader before leaving.",
        });
      }
    }

    await pool.query(
      `DELETE FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    res.json({ message: "You have left the team." });
  } catch (err) {
    console.error("Error leaving team:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Change role for exisisting member
router.put("/:teamId/changerole", routeGuard, async (req, res) => {
  const { teamId } = req.params;
  const { user_email, new_role } = req.body;
  const requesterId = req.user.id;

  if (!["leader", "member"].includes(new_role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  try {
    const requester = await pool.query(
      `SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [requesterId, teamId]
    );

    if (requester.rowCount === 0 || requester.rows[0].role !== "leader") {
      return res
        .status(403)
        .json({ error: "Only team leaders can change roles." });
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [user_email]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User with this email not found." });
    }

    const targetUserId = userResult.rows[0].id;

    if (targetUserId === requesterId) {
      return res
        .status(400)
        .json({ error: "You cannot change your own role." });
    }

    const isInTeam = await pool.query(
      `SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2`,
      [targetUserId, teamId]
    );

    if (isInTeam.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "This user is not a member of the team." });
    }

    await pool.query(
      `UPDATE team_members SET role = $1 WHERE user_id = $2 AND team_id = $3`,
      [new_role, targetUserId, teamId]
    );

    res.json({ message: "Role updated successfully." });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get the leaders of the team
router.get("/:teamId/leaders", routeGuard, async (req, res) => {
  const { teamId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.full_name, u.email, u.profile_image 
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = $1 AND tm.role = 'leader'
      `,
      [teamId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching leaders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//git the member of the team
router.get("/:teamId/members", routeGuard, async (req, res) => {
  const { teamId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.full_name, u.email,u.profile_image, tm.role
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = $1 AND tm.role = 'member'
      `,
      [teamId]
    );

    if (result.rowCount === 0) {
      return res.json({
        message: "No members yet in this team.",
        data: [],
      });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
