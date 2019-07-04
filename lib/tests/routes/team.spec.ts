


// Tests

// CREATE
// Unauthenticated users cannot create team
// Authenticated users can create team
// Authenticated user creates team where they're admin and the rest is empty

// UPDATE
// Unauthenticated users cannot update team
// Only team admin can edit team
// New admin must be a member
// Switching admin replaces new admin, moves him to members, removes new admin from members
// Changing team members only changes team members only
// Changing 