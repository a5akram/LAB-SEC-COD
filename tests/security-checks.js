console.log(`
Manual Security Demonstration Checklist
======================================

This lab intentionally does not require automated tests yet.
Use this checklist to prepare visual before/after evidence.

1. Baseline valid user
   - Submit a normal student check-in with CYSE-STUDENT-2026.
   - Expected vulnerable behavior: general access is granted.

2. localStorage VIP manipulation
   - In DevTools Console, run:
     localStorage.setItem("campusSession", JSON.stringify({ name: "Mallory", role: "vip" }));
     location.reload();
   - Expected vulnerable behavior: VIP panel appears.

3. Direct function call
   - Leave the terms checkbox unchecked.
   - In DevTools Console, run:
     submitCheckin();
   - Expected vulnerable behavior: the UI check is bypassed.

4. Forged fetch request
   - In DevTools Console, run:
     fetch("/api/checkin", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         name: "Mallory",
         email: "mallory@gmu.edu",
         ticketType: "student",
         role: "vip",
         inviteCode: "anything"
       })
     }).then(r => r.json()).then(console.log);
   - Expected vulnerable behavior: server trusts client-supplied role.

5. Coercion bug
   - In DevTools Console, run:
     fetch("/api/checkin", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         name: "Mallory",
         email: "mallory@gmu.edu",
         ticketType: "student",
         inviteCode: false
       })
     }).then(r => r.json()).then(console.log);
   - Expected vulnerable behavior: false may be treated like 0.

6. Unsafe DOM rendering
   - Enter this as the name:
     <b>Fake VIP User</b>
   - Expected vulnerable behavior: input is rendered as HTML.

After fixing the application, repeat at least two demonstrations and show that
those abuse cases no longer succeed.
`);
