# Secure Campus Event Check-in Portal

## CYSE 411 In-Class Lab

This repository contains a deliberately vulnerable web application for a secure software engineering lab. The goal is not to build a new application from scratch. The goal is to analyze a small existing system, demonstrate insecure client-side assumptions, implement targeted security fixes, and explain the security reasoning behind those fixes.

## Scenario

A university is using a small web portal to check participants into a cybersecurity event. The portal decides whether a participant receives general access or access to a restricted VIP briefing room.

The original development team placed several security decisions in JavaScript running in the browser. Your team has been hired to review the application, demonstrate the weaknesses, and correct the implementation.

The core lesson is:

> The browser is not a security boundary. The UI supports usability. The server enforces security decisions.

## Learning Objectives

By the end of this lab, students should be able to:

- Explain why browser-side JavaScript is observable, modifiable, and untrusted.
- Demonstrate how DOM, event handlers, `fetch()`, and browser storage can be manipulated.
- Identify JavaScript security issues related to coercion, `==`, truthy/falsy values, unsafe rendering, and weak error handling.
- Distinguish between client-side usability checks and server-side security enforcement.
- Use Git commits to document secure software engineering decisions.

## Required Setup

Install:

- Node.js
- Git
- A modern browser with DevTools

## Group Workflow

Each group must fork the instructor-provided repository before starting the lab. The original repository must remain unchanged. All work must be completed in the group fork, preferably in a branch named `security-fixes`.

```bash
git clone <group-fork-url>
cd secure-campus-checkin
npm install
npm start
```

Open the application at:

```text
http://localhost:3000
```

Create a working branch:

```bash
git checkout -b security-fixes
```

## Valid Invitation Codes

The application includes the following sample invitation codes:

```text
CYSE-STUDENT-2026
CYSE-GUEST-2026
VIP-SECURE-2026
```

## In-Class Schedule

| Time | Activity |
|---|---|
| 1:30 – 1:40 | Instructor briefing: scenario, team roles, expected deliverables, and grading criteria |
| 1:40 – 3:00 | Group technical lab work |
| 3:00 – 3:10 | Presentation preparation |
| 3:10 – 3:30 | Five lightning presentations, 4 minutes per group |

## Milestone 1 — Fork, Setup, and Baseline Execution

**1:40 – 1:50, 10 minutes**

Each group must first create its own working copy of the lab repository.

Tasks:

1. One student in the group creates a fork of the instructor-provided repository.
2. The group clones the forked repository, not the original repository.
3. The group installs dependencies and starts the application.
4. The group opens the application in the browser.
5. The group creates a working branch named `security-fixes`.
6. The group confirms that the vulnerable version runs correctly before making changes.
7. The group adds a short note to this README confirming baseline execution.
8. The group makes the first commit.

Example:

```bash
git add README.md
git commit -m "Document baseline execution"
```

Baseline execution note:

```text
Group name:
Team members:
Baseline application executed successfully: yes/no
Browser used:
Initial observations:
```

## Milestone 2 — Controlled Vulnerability Demonstration

**1:50 – 2:10, 20 minutes**

Each group must demonstrate at least two vulnerabilities before implementing any fixes.

The goal of this milestone is not to perform advanced hacking. The goal is to prove that client-side controls are not reliable security controls because the browser is controlled by the user.

Groups may demonstrate vulnerabilities such as:

- Modifying `localStorage` to appear as a VIP user.
- Calling `submitCheckin()` directly from the browser console.
- Sending a forged `fetch()` request without using the user interface.
- Injecting HTML into the name field to test unsafe DOM rendering.
- Sending JSON with unexpected types or fields.

Document findings using the table below:

| Vulnerability | How It Was Demonstrated | Security Impact |
|---|---|---|
|  |  |  |
|  |  |  |

Suggested DevTools commands are available by running:

```bash
npm run demo-checklist
```

This command prints a manual checklist only. Automated tests are not required in this lab.

## Milestone 3 — Security Fixes

**2:10 – 2:40, 30 minutes**

Each group must implement security fixes for at least three vulnerabilities discovered during the previous milestone.

The goal is not to rewrite the application or add new features. The goal is to correct insecure trust assumptions and move security decisions to the appropriate place in the system.

Groups should prioritize the following fixes:

1. Move authorization decisions to the server. The frontend may display information, but it must not decide whether a user is authorized.
2. Validate all input types and required fields on the server. The server should reject malformed, missing, or unexpected data.
3. Replace unsafe equality checks. Avoid security-sensitive comparisons using `==`. Use explicit type checks and `===`.
4. Remove unsafe DOM rendering. Do not use `innerHTML` for untrusted user input. Use `textContent` or safe DOM creation methods.
5. Fail closed when errors occur. A `catch` block must not grant access or silently continue in an insecure state.
6. Do not trust browser-controlled storage. `localStorage` or `sessionStorage` may be used for non-sensitive preferences, but not for roles, authorization status, or access decisions.

Example commit messages:

```bash
git commit -m "Move VIP authorization to server"
git commit -m "Validate check-in request fields"
git commit -m "Replace unsafe innerHTML rendering"
git commit -m "Fail closed on API errors"
```

By the end of this milestone, the corrected application should still function normally for legitimate users, but the demonstrated abuse cases should no longer work.

Document fixes using the table below:

| Fix Implemented | File(s) Changed | Why This Improves Security |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

## Milestone 4 — Visual Verification and Before/After Demo

**2:40 – 2:55, 15 minutes**

Each group must visually verify that the corrected application still works for legitimate users and that the previously demonstrated vulnerabilities no longer succeed.

The goal of this milestone is not to run automated tests. The goal is to prepare a clear before/after demonstration showing the security impact of the original bug and the effectiveness of the fix.

Each group should prepare visual evidence for at least two corrected vulnerabilities.

Suggested demonstrations:

| Demonstration | Expected Result After the Fix |
|---|---|
| Normal user submits valid information | General access is granted |
| User modifies `localStorage` to appear as VIP | VIP access is not granted by the server |
| User sends JSON with `role: "vip"` | The role field is ignored or rejected |
| User sends `inviteCode: false` | The request is rejected |
| User enters HTML in the name field | The input is displayed as text, not interpreted as HTML |
| API or parsing error occurs | Access is denied or a neutral error message is shown |

Evidence may include screenshots, console commands, modified storage values, forged requests, or a short live demo using DevTools.

## Milestone 5 — Presentation Preparation

**3:00 – 3:10, 10 minutes**

Each group must prepare a short presentation summarizing its security analysis, fixes, and visual evidence.

The presentation should be concise. The goal is not to explain every line of code, but to clearly communicate the security problem, the demonstrated abuse case, and why the corrected version is safer.

Each group should prepare three slides maximum.

### Slide 1 — Problem and Security Risk

Explain what the application does and what security assumption was broken.

Answer:

```text
What was the system supposed to do?
What security decision was incorrectly trusted to the browser?
What could a malicious or unauthorized user do?
```

### Slide 2 — Vulnerabilities Demonstrated

Show at least two vulnerabilities demonstrated during the lab.

Include simple evidence such as a browser console command, DevTools screenshot, modified `localStorage` value, forged `fetch()` request, or before-fix screenshot.

### Slide 3 — Fixes and Before/After Evidence

Explain what was changed and why the fix improves security.

Answer:

```text
What did we change?
Was the fix implemented on the client side or server side?
Why does the corrected version stop the same abuse case?
```

## Presentation Rule

At the end of the lab, selected groups will present their work. Each selected group must demonstrate both the vulnerable behavior and the corrected behavior of the application.

Groups are free to decide how to structure their presentation, but participation by all team members is expected. The presentation may not be delivered by a single speaker only.

## Submission Checklist

Each group should submit or provide access to:

- The group fork URL.
- The `security-fixes` branch or merged final version.
- Meaningful Git commits.
- Updated README tables.
- A short presentation using `docs/presentation-template.pptx` or equivalent slides.
- Visual before/after evidence.

## Instructor Note

This repository is intentionally vulnerable. Do not deploy it outside a controlled instructional environment.
