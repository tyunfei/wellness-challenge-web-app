// Maps pet species name from database → image file name
// Used to dynamically load correct pet image on dashboard
const petImages = {
  Dog: "dog.webp",
  Cat: "cat.webp",
  Otter: "otter.webp",
  Slug: "slug.webp",
  "Hammerhead shark": "hammerhead_shark.webp",
  Dolphin: "dolphin.webp",
  Zebra: "zebra.webp",
  Gorilla: "gorilla.webp",
  Shrimp: "shrimp.webp",
  Panda: "panda.webp",
  Partridge: "partridge.webp",
  Toucan: "toucan.webp",
  Unicorn: "unicorn.webp",
  Dragon: "dragon.webp",
  Giraffe: "giraffe.webp"
};

document.addEventListener("DOMContentLoaded", () => {

  // Get JWT token from browser storage
  const token = getToken();

  // Load leaderboard and progress immediately
  loadLeaderboard();
  loadProgress();

  // If user not logged in, redirect to login page
  if (!token) {
    window.location.href = "auth.html";
    return;
  }

  // Fetch logged-in user's profile data
  fetch("/auth/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => {

    // If token invalid or expired
    if (!response.ok) {
      removeToken();
      window.location.href = "auth.html";
      return;
    }

    return response.json();
  })
  .then(data => {

    if (!data) return;

    // Display user info on dashboard
    document.getElementById("username").textContent = data.username;
    document.getElementById("points").textContent = data.points;
    document.getElementById("coins").textContent = data.coins;

  })
  .catch(error => {
    console.error("Dashboard load error:", error);
    removeToken();
    window.location.href = "auth.html";
  });

});






//////////////////////////////////////////////////////
// LOAD ADOPTED PETS
//////////////////////////////////////////////////////
loadDashboardPets();

function loadDashboardPets() {

  // Request user's pets from backend
  fetch("/pets/user", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  .then(res => res.json())
  .then(pets => {

    const activeBox = document.getElementById("activePetBox");
    const petsGrid = document.getElementById("dashboardPets");

    // Clear previous UI
    activeBox.innerHTML = "";
    petsGrid.innerHTML = "";

    pets.forEach(pet => {

      // Calculate pet level and XP bar %
      const level = Math.floor(pet.xp / 100);
      const xpPercent = pet.xp % 100;

      // Get image filename from mapping
      const imageFile = petImages[pet.species_name];

      // Convert rarity to CSS class name
      const rarityClass = pet.rarity.toLowerCase().replace(" ", "-");


      // ============================
      // ACTIVE PET DISPLAY
      // ============================
      if (pet.is_active) {

    
        activeBox.innerHTML = `
          <div class="active-pet-card">

            <h4>Active Pet</h4>

            <img 
              src="images/pets/${imageFile}"
              class="pet-image"
              alt="${pet.species_name}"
            >

            <p><strong>${pet.pet_name}</strong></p>

            <!-- RARITY BADGE -->
            <div class="rarity-badge">
              <span class="rarity-dot rarity-${rarityClass}"></span>
              <span class="rarity-text">${pet.rarity}</span>
            </div>

            <!-- XP BAR -->
            <div class="xp-bar-container">
              <div 
                class="xp-bar-fill xp-${rarityClass}"
                style="width: ${xpPercent}%">
              </div>
            </div>

            <p><strong>Level ${level}</strong></p>
            <p>${xpPercent} / 100 XP</p>
            <p class="total-xp">Total XP: ${pet.xp}</p>

          </div>
        `;



      } 
      
      // ============================
      // OTHER PETS DISPLAY
      // ============================
      else {

        const div = document.createElement("div");
        div.classList.add("pet-card");

        div.innerHTML = `
          <img 
            src="images/pets/${imageFile}"
            class="pet-image"
            alt="${pet.species_name}"
          >

          <h4>${pet.pet_name}</h4>
        `;

        petsGrid.appendChild(div);

      }

    });

  })
  .catch(err => {
    console.error("Dashboard pets error:", err);
  });

}

//////////////////////////////////////////////////////
// LOAD LEADERBOARD
//////////////////////////////////////////////////////

function loadLeaderboard() {

  const token = getToken();
  const leaderboardDiv = document.getElementById("leaderboardList");

  if (!leaderboardDiv) return;

  fetch("/users/leaderboard/top", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {

      leaderboardDiv.innerHTML = "";

      data.forEach(user => {

        let medalClass = "";
        let rankIcon = `#${user.rank}`;

        // Assign medal emoji for top 3
        if (user.rank === 1) {
          medalClass = "gold";
          rankIcon = "🥇";
        } else if (user.rank === 2) {
          medalClass = "silver";
          rankIcon = "🥈";
        } else if (user.rank === 3) {
          medalClass = "bronze";
          rankIcon = "🥉";
        }

        const row = document.createElement("div");
        row.classList.add("leaderboard-row");

        row.innerHTML = `
          <span class="rank-badge ${medalClass}">
            ${rankIcon} ${user.username}
          </span>
          <span>
            ${user.points} pts
          </span>
        `;

        leaderboardDiv.appendChild(row);

      });

    })
    .catch(err => {
      console.error(err);
      leaderboardDiv.innerHTML = "Failed to load leaderboard";
    });

}


//////////////////////////////////////////////////////
// LOAD PROGRESS TRACKING
//////////////////////////////////////////////////////

function loadProgress() {

  const token = getToken();

  fetch("/challenges/progress/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {

    // Update stats
    document.getElementById("totalCompleted").textContent = data.total_completed;
    document.getElementById("todayCompleted").textContent = data.today_completed;
    document.getElementById("weeklyCompleted").textContent = data.weekly_completed;

    // Activity history list
    const historyBox = document.getElementById("completionHistory");
    historyBox.innerHTML = "";

    if (data.recent_activity.length === 0) {
      historyBox.innerHTML = "<p>No completed challenges yet.</p>";
      return;
    }

    // Display recent activities
    data.recent_activity.forEach(item => {

      const div = document.createElement("div");
      div.classList.add("history-item");

      const date = new Date(item.completed_at).toLocaleString();

      div.innerHTML = `
        <span>${item.description}</span>
        <span>${date}</span>
      `;

      historyBox.appendChild(div);

    });

    // Render weekly bar chart
    renderActivityChart(data.daily_activity);

  })
  .catch(err => {
    console.error("Progress load error:", err);
  });

  


}


//////////////////////////////////////////////////////
// ACTIVITY BAR CHART
//////////////////////////////////////////////////////

let activityChartInstance = null;

function renderActivityChart(dailyData) {

  const ctx = document.getElementById("activityChart");
  if (!ctx) return;

  // Weekday labels \
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Initialize counts (7 days)
  const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

  // Map backend data into weekday buckets
  dailyData.forEach(item => {

    const date = new Date(item.day);

    // Convert JS Sunday=0 into Monday=0 system
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;

    weeklyCounts[dayIndex] += item.count;
  });

  // Destroy old chart if exists
  if (activityChartInstance) {
    activityChartInstance.destroy();
  }

  // Create new bar chart
  activityChartInstance = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,
      datasets: [{
        label: "Challenges Completed",
        data: weeklyCounts
      }]
    },

    options: {
      responsive: true,

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

}


 

