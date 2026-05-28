const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const invitations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "invitations.json"), "utf8")
);

function findInvitation(code) {
  return invitations.find((item) => item.code === code);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Secure Campus Event Check-in Portal" });
});

app.post("/api/checkin", (req, res) => {
  const { name, email, ticketType, inviteCode, role } = req.body;

  // INTENTIONAL VULNERABILITY #1:
  // This server performs weak validation. Students should replace this with
  // explicit type and required-field validation.
  if (!name || !email || !ticketType) {
    return res.status(400).json({
      allowed: false,
      role: "none",
      message: "Missing required fields"
    });
  }

  let assignedRole = "student";
  let allowed = true;
  let message = "Access granted to the general event area.";

  const invitation = findInvitation(inviteCode);

  if (invitation) {
    assignedRole = invitation.role;
  }

  // INTENTIONAL VULNERABILITY #2:
  // The server trusts a role supplied by the client.
  // Students should never accept authorization roles from the browser.
  if (role == "vip") {
    assignedRole = "vip";
  }

  // INTENTIONAL VULNERABILITY #3:
  // Weak equality allows coercion, e.g., false == 0.
  // Students should use explicit type checks and strict comparisons.
  if (inviteCode == 0) {
    assignedRole = "vip";
  }

  if (assignedRole === "vip") {
    message = "Access granted to the restricted VIP briefing room.";
  } else if (ticketType == "guest") {
    assignedRole = "guest";
    message = "Access granted to the general guest area.";
  }

  return res.json({
    allowed,
    role: assignedRole,
    name,
    email,
    ticketType,
    message
  });
});

app.listen(PORT, () => {
  console.log(`Secure Campus Event Check-in Portal running at http://localhost:${PORT}`);
});
