//////////////////////////////////////////////////////
// LOGIN USER
//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

   // Get the login form element from HTML
  const loginForm = document.getElementById("loginForm");

  // Safety check: If form doesn't exist, stop execution
  if (!loginForm) return;

  // Listen for form submission
  loginForm.addEventListener("submit", (event) => {

    // Prevent default page refresh behaviour
    event.preventDefault();

    // Get user input values
    const username = document
      .getElementById("loginUsername")
      .value.trim();

    const password = document
      .getElementById("loginPassword")
      .value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Send login request to backend
    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      // Send username and password as JSON
      body: JSON.stringify({ username, password })
    })

    // Convert response into JSON while keeping HTTP status
      .then(response =>
        response.json().then(data => ({ response, data }))
      )
      .then(({ response, data }) => {
        // If login failed
        if (!response.ok) {
          alert(data.message || "Login failed.");
          return;
        }

        // Save JWT token
        saveToken(data.token);

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});


