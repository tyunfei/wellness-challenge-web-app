//////////////////////////////////////////////////////
// REGISTER USER
//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

  // Get the register form element
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  // Listen for form submission
  registerForm.addEventListener("submit", (event) => {
    // Prevent default page reload
    event.preventDefault();

    // Get input values from form
    const username = document
      .getElementById("registerUsername")
      .value.trim();

    const password = document
      .getElementById("registerPassword")
      .value.trim();

    const confirmPassword = document
      .getElementById("registerConfirmPassword")
      .value.trim();


    // INPUT VALIDATION (FRONTEND)
    // Check if any field is empty
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // Check password confirmation matches
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }


    // SEND REGISTER REQUEST TO BACKEND
    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // Send username and password to backend
      body: JSON.stringify({ username, password })
    })
    // Convert response to JSON + keep response status
      .then(response =>
        response.json().then(data => ({ response, data }))
      )
      // Handle backend response
      .then(({ response, data }) => {
        // If backend returns error
        if (!response.ok) {
          alert(data.message || "Registration failed.");
          return;
        }

        // SUCCESS HANDLING
        alert("Registration successful! Please log in.");

        // Flip back to login card
        document.querySelector(".toggle").checked = false;

        // Clear form
        registerForm.reset();
      })
      // Catch network or unexpected errors
      .catch(error => {
        console.error("Registration error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});


