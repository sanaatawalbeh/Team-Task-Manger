# Team-Task-Manger#

## Overview

**Team Task Manager** is a web application designed to simplify teamwork with a clean and intuitive user interface.  
It allows teams to organize tasks, manage members, and collaborate efficiently.

---

## 🚀 Features

### User Management

- Create an account
- Log in
- View profile
- Edit profile and password

### Team Management

- Create or join a team
- Two roles available: **Leader** and **Member**

### Leader Capabilities

- Add or remove members (must have an account)
- Change member roles
- Create tasks and assign them to team members or self
- Manage personal tasks (edit, delete, change status)
- View & manage all team tasks:
  - Edit or delete tasks
  - Add comments
  - Edit or delete comments

### Member Capabilities

- View all team members
- Create personal tasks (edit, delete, change status)
- View tasks assigned by the Leader
- View & comment on team tasks:
  - Edit or delete own comments

---

### Tech Stack (Example)

- **Frontend:** HTML, CSS, JavaScript (React.js)
- **Backend:** Node.js, Express.js
- **Database:** PostGress DB
- **Authentication:** JWT-based

---

## Project Structure (Example)

Manager/
│
├── team-project-backend/ # Backend API
│ ├── node_modules/
│ ├── middleware/
│ │ └── verifytoken.js
│ ├── routes/
│ │ ├── teams.js
│ │ ├── users.js
│ │ └── teamMembers.js
│ ├── .env
│ ├── .gitignore
│ ├── package-lock.json
│ ├── package.json
│ └── server.js
│
├── team-project-frontend/ # Frontend Application
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── assets/ # For images
│ │ ├── components/
│ │ │ ├── Home/
│ │ │ ├── About/
│ │ │ ├── Login/
│ │ │ ├── Register/
│ │ │ ├── Public_Layout_components/
│ │ │ │ ├── Footer/
│ │ │ │ ├── Navbar/
│ │ │ │ └── Public-Layout/
│ │ │ ├── Dashboard_Layout_components/
│ │ │ │ ├── Dashboard_Layout/
│ │ │ │ ├── MainPage/
│ │ │ │ ├── MyProfile/
│ │ │ │ ├── EditProfile/
│ │ │ │ ├── ChangePassword/
│ │ │ │ ├── MyTeams/
│ │ │ │ ├── CreateTeam/
│ │ │ │ └── JoinTeam/
│ │ │ ├── Leader_Layout_components/
│ │ │ │ ├── LeaderLayout/
│ │ │ │ ├── AddMember/
│ │ │ │ ├── RemoveMember/
│ │ │ │ └── ChangeRole/
│ │ │ ├── Member_Layout_components/
│ │ │ │ └── MemberLayout/
│ │ │ ├── Mutual_components/
│ │ │ │ ├── AllTeamTasks/
│ │ │ │ ├── CreateTask/
│ │ │ │ └── MyTasks/
│
└── README.md