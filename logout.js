//////////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

  // Get logout button from the page
  const logoutBtn = document.getElementById("logoutBtn");

  // Safety check: If button does not exist, stop script
  if (!logoutBtn) return;

  // Listen for user clicking logout
  logoutBtn.addEventListener("click", (e) => {
    // Prevent default button behaviour
    e.preventDefault();

    // Remove JWT
    // This effectively logs the user out
    localStorage.removeItem("token");

    // Redirect to home page
    window.location.href = "index.html";
  });
});
