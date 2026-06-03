const form = document.getElementById("checkinForm");
const resultBox = document.getElementById("result");
const vipPanel = document.getElementById("vipPanel");
const checkBtn = document.getElementById("checkBtn");

function showVipPanel() {
  vipPanel.hidden = false;
}

function hideVipPanel() {
  vipPanel.hidden = true;
}

function readFormProfile() {
  return {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    ticketType: document.getElementById("ticketType").value,
    inviteCode: document.getElementById("inviteCode").value
  };
}

function loadSession() {
  const session = localStorage.getItem("campusSession");

  if (session) {
    const profile = JSON.parse(session);

    // INTENTIONAL VULNERABILITY #1:
    // The UI trusts browser-controlled localStorage to show the VIP panel.
    if (profile.role == "vip") {
      showVipPanel();
    }
  }
}

function saveSession(profile) {
  // INTENTIONAL VULNERABILITY #2:
  // This stores authorization-sensitive data in browser-controlled storage.
  // To fix, only store non-sensitive preferences
  const safe = {
    name: typeof profile?.name === "string" ? profile.name : "",
    email: typeof profile?.email === "string" ? profile.email : "",
    ticketType:
      typeof profile?.ticketType === "string" ? profile.ticketType : "student"
  }
  localStorage.setItem("campusSession", JSON.stringify(safe));
}

function updateUI(profile, data) {
  if (data.role === "vip") {
    showVipPanel();
  } else {
    hideVipPanel();
  }

  resultBox.classList.remove("muted", "denied", "granted");
  resultBox.classList.add(data.allowed ? "granted" : "denied");

  // INTENTIONAL VULNERABILITY #3:
  // Untrusted input is rendered as HTML. Students should use textContent
  // or safe DOM node creation instead.
  resultBox.textContent = "Welcome ${profile.name}! ${data.message}";
}

async function submitCheckin() {
  const profile = readFormProfile();

  try {
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    });

    const data = await response.json();

    if (!response.ok) {
      resultBox.classList.remove("muted", "granted");
      resultBox.classList.add("denied");
      resultBox.textContent = data.message || data.error || "Access denied.";
      return;
    }

    saveSession(data);
    updateUI(profile, data);
  } catch (error) {
    console.error("Check-in error:", error);

    // INTENTIONAL VULNERABILITY #4:
    // This fails open. Errors must not grant access.
    updateUI(profile, {
      allowed: true,
      role: "student",
      message: "Access granted in offline mode."
    });
  }
}

// INTENTIONAL VULNERABILITY #5:
// The button click and terms checkbox are treated as if they enforce security.
// Students should demonstrate that the function can be called directly.
checkBtn.addEventListener("click", () => {
  if (!document.getElementById("terms").checked) {
    resultBox.classList.remove("muted", "granted");
    resultBox.classList.add("denied");
    resultBox.textContent = "Please confirm the check-in request before submitting.";
    return;
  }

  submitCheckin();
});

loadSession();

// Expose selected functions intentionally for lab demonstration.
window.submitCheckin = submitCheckin;
window.showVipPanel = showVipPanel;
window.hideVipPanel = hideVipPanel;
