require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());
// app.use(express.static("public"));
//routes
const userRoute = require("./routes/users");
const teamRoute = require("./routes/teams");
const teamsMemberRoute = require("./routes/teamsMember");
const tasksRoute = require("./routes/tasks");

//routes use
app.use("/user", userRoute);
app.use("/team", teamRoute);
app.use("/teamsmember", teamsMemberRoute);
app.use("/task", tasksRoute);


// -----------------------------------------------------------------------------------------------
const port = process.env.PORT || 3000;

pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;

        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );

        console.log(`App listening on port http://localhost:${port}`);
      });
  })
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });

// -----------------------------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).send('Page not found <a href="/"> Get back home</a>');
});
