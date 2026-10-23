//////////////////////////////////////////////////////
// CHALLENGES FRONTEND LOGIC 
//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

  // Load all available challenges when page loads
  loadChallenges();

  // Setup create challenge modal + buttons
  setupCreateChallenge();
});


function loadChallenges() {

  // Get JWT token from localStorage
  const token = getToken();

  // Get container where challenges will be displayed
  const challengeList = document.getElementById("challengeList");

  // Safety check, stop if missing token or HTML element
  if (!token || !challengeList) return;

  // Fetch challenges API
  fetch("/challenges", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // Check HTTP status
    .then(response => {

      if (!response.ok) {
        throw new Error("Failed to load challenges");
      }
      return response.json();
    })

    // Display challenges on page
    .then(challenges => {

      // Clear old content
      challengeList.innerHTML = "";

      challenges.forEach(challenge => {

        // Create card container
        const card = document.createElement("div");
        card.classList.add("challenge-card");

        // Mark completed challenge visually
        if (challenge.completed) {
          card.classList.add("completed");
        }

        // Build HTML for challenge card
        card.innerHTML = `
          <span class="challenge-badge">QUEST</span>

        
          <p class="challenge-title-text">${escapeHTML(challenge.description)}</p>


          <div class="challenge-rewards">
            <div class="reward">
              <i class="bi bi-star-fill"></i>
              ${challenge.points} pts
            </div>
            <div class="reward">
              <i class="bi bi-coin"></i>
              ${challenge.coins}
            </div>
            <div class="reward">
              <i class="bi bi-heart-pulse-fill"></i>
              ${challenge.pet_xp || 0} XP
            </div>
          </div>

          <button
            class="challenge-btn ${challenge.completed ? "completed" : "complete"}"
            ${challenge.completed ? "disabled" : ""}
            data-id="${challenge.challenge_id}">
            ${challenge.completed ? "QUEST COMPLETED" : "COMPLETE QUEST 🚀"}
          </button>
        `;

        // Get button inside card
        const button = card.querySelector("button");

        // Only allow click if challenge NOT completed
        if (!challenge.completed) {
          button.addEventListener("click", function () {
            completeChallenge(challenge.challenge_id, button, card);
          });
        }

        // Add card into page
        challengeList.appendChild(card);
      });
    })

    // Error handling
    .catch(error => {

      console.error("Error loading challenges:", error);
      challengeList.innerHTML = "<p>Error loading challenges.</p>";
    });
}

//////////////////////////////////////////////////////
// COMPLETE CHALLENGE
//////////////////////////////////////////////////////
function completeChallenge(challengeId, button, card) {
  const token = getToken();

  // Send completion request to backend
  fetch(`/challenges/${challengeId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },

    // Required backend field
    body: JSON.stringify({ details: "completed" })
  })
    .then(response => {

      // Extract JSON even if error
      return response.json().then(data => {

        if (!response.ok) {
          throw new Error(data.message || "Failed to complete challenge");
        }
        return data;
      });
    })
    
    .then(data => {
    // Update button + card
    button.textContent = "QUEST COMPLETED";
    button.classList.remove("complete");
    button.classList.add("completed");
    button.disabled = true;

    // Update card UI
    card.classList.add("completed");

    // Celebration animation
    launchConfetti();

    // Show reward popup
    showRewardPopup(data);
})

}

//////////////////////////////////////////////////////
// REWARD POPUP
//////////////////////////////////////////////////////
function showRewardPopup(data) {
  const popup = document.getElementById("rewardPopup");
  const text = document.getElementById("rewardText");

  text.innerHTML = `
    ⭐ Points: +${data.points_earned}<br>
    🪙 Coins: +${data.coins_earned}<br>
    ❤️ Pet XP: +${data.pet_xp_earned || 0}
  `;

  // Make popup visible
  popup.classList.remove("hidden");
}

// Close popup when user clicks close button
function closeRewardPopup() {
  document.getElementById("rewardPopup").classList.add("hidden");
}


//////////////////////////////////////////////////////
// CONFETTI
//////////////////////////////////////////////////////
function launchConfetti() {
  const container = document.getElementById("confettiContainer");

  // Create 40 falling confetti pieces
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

     // Random horizontal position
    confetti.style.left = Math.random() * 100 + "vw";
    
    // Random color
    confetti.style.backgroundColor = randomColor();

    // Random animation speed
    confetti.style.animationDuration = Math.random() * 1.5 + 1 + "s";

    container.appendChild(confetti);

    // Remove confetti after animation ends
    setTimeout(() => confetti.remove(), 2000);
  }
}

// Returns random color
function randomColor() {
  const colors = ["#4CAF50", "#FFC107", "#FF5722", "#03A9F4"];
  return colors[Math.floor(Math.random() * colors.length)];
}


//////////////////////////////////////////////////////
// CREATE CHALLENGE 
//////////////////////////////////////////////////////

function setupCreateChallenge() {

  const openBtn = document.getElementById("openCreateModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("createModal");
  const createBtn = document.getElementById("createChallengeBtn");

  // Safety check
  if (!openBtn) return;

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

   // Submit challenge
  createBtn.addEventListener("click", submitChallenge);
}


function submitChallenge() {

  // Read user input
  const desc = document.getElementById("newDesc").value.trim();
  const points = document.getElementById("newPoints").value;
  const coins = document.getElementById("newCoins").value;
  const petXP = document.getElementById("newPetXP").value;

  if (!desc || !points) {
    alert("Description and points required");
    return;
  }

  const token = getToken();

  // Send new challenge to backend
  fetch("/challenges", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      description: desc,
      points: points,
      coins_reward: coins,
      pet_xp_reward: petXP
    })
  })
  .then(res => res.json().then(data => ({ res, data })))
  .then(({ res, data }) => {

    if (!res.ok) {
      alert(data.error || "Failed to create challenge");
      return;
    }

    // Close popup
    document.getElementById("createModal").classList.add("hidden");

    // Reset form
    document.getElementById("newDesc").value = "";
    document.getElementById("newPoints").value = "";
    document.getElementById("newCoins").value = "";
    document.getElementById("newPetXP").value = "";

    // Reload challenges
    loadChallenges();

  })
  .catch(err => {
    console.error(err);
    alert("Error creating challenge");
  });

}
