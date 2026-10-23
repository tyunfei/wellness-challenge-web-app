//////////////////////////////////////////////////////
// AUTH GUARD
// Protects frontend pages from unauthenticated access
//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

    // If user is NOT logged in, redirect to login page
    if (!isLoggedIn()) {
        window.location.href = "auth.html";
    }

});
