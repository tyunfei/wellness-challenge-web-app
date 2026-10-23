// PET IMAGE MAPPING
// Maps species name from backend to image filename
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


//////////////////////////////////////////////////////
// PET SYSTEM FRONTEND LOGIC 
//////////////////////////////////////////////////////
// Load available pets + user's owned pets

document.addEventListener("DOMContentLoaded", () => {
  loadPetSpecies();
  loadMyPets();
});

//////////////////////////////////////////////////////
// LOAD PET SPECIES (shop)
//////////////////////////////////////////////////////
function loadPetSpecies() {

  // Call backend API to fetch all pet species
  fetch("/pets/species", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  .then(res => res.json())
  .then(data => {

    const speciesList = document.getElementById("speciesList");
    speciesList.innerHTML = "";

    // Loop through all pet species
    data.forEach(pet => {

      // Get image filename
      const imageFile = petImages[pet.species_name];

      // Convert rarity to CSS class format
      const rarityClass = pet.rarity.toLowerCase().replace(" ", "-");

      // Create pet card
      const card = document.createElement("div");
      card.classList.add("pet-card");

      // Insert pet HTML
      card.innerHTML = `
      <img 
        src="images/pets/${imageFile}" 
        class="pet-image"
        alt="${pet.species_name}"
      >

      <h4>${pet.species_name}</h4>

      <div class="rarity-badge">
        <span class="rarity-dot rarity-${rarityClass}"></span>
        <span class="rarity-text">${pet.rarity}</span>
      </div>

      <!-- PRICE DISPLAY -->
      <div class="pet-price">
        🪙 ${pet.cost} Coins
      </div>

      <div class="pet-action">
        <button onclick="adoptPet(${pet.species_id})">
          Adopt
        </button>
      </div>

    `;


      speciesList.appendChild(card);
    });

  })
  .catch(err => {
    console.error(err);
  });
}



//////////////////////////////////////////////////////
// ADOPT PET
//////////////////////////////////////////////////////
function adoptPet(speciesId) {

  // Ask user to name their pet
  const petName = prompt("Enter a name for your pet:");

  // Validate input
  if (!petName || petName.trim() === "") {
    alert("Pet name is required.");
    return;
  }

  // Send adopt request to backend
  fetch("/pets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      species_id: speciesId,
      pet_name: petName.trim()
    })
  })
  .then(response => {

    return response.json().then(data => {

      // Handle insufficient coins
      if (!response.ok) {
        throw new Error(data.message || "Failed to adopt pet");
      }

      return data;
    });

  })
  .then(() => {

     // Success message
    alert("Pet adopted successfully!");
    loadMyPets();

  })
  .catch(error => {

    console.error(error);

    // Show backend error message
    alert(error.message);

  });

}



//////////////////////////////////////////////////////
// LOAD USER PETS (owned)
//////////////////////////////////////////////////////
function loadMyPets() {

  // Fetch user's pets from backend
  fetch("/pets/user", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  .then(res => res.json())
  .then(pets => {

    const myPetsList = document.getElementById("myPetsList");
    myPetsList.innerHTML = "";

    pets.forEach(pet => {

        const card = document.createElement("div");

        // IMAGE
        // Get pet image
        const imageFile = petImages[pet.species_name];

        // XP + LEVEL
        const level = Math.floor(pet.xp / 100);
        const xpPercent = pet.xp % 100;

        // RARITY 
        const rarityClass = pet.rarity.toLowerCase().replace(" ", "-");

        card.classList.add("pet-card");

        // Display pet card
        card.innerHTML = `
          <img 
            src="images/pets/${imageFile}" 
            class="pet-image"
            alt="${pet.species_name}"
          >


          <h4>${escapeHTML(pet.pet_name)}</h4>

          <div class="rarity-badge">
            <span class="rarity-dot rarity-${rarityClass}"></span>
            <span class="rarity-text">${pet.rarity}</span>
          </div>


          <div class="xp-bar-container">
            <div 
              class="xp-bar-fill xp-${rarityClass}"
              style="width: ${xpPercent}%">
            </div>
          </div>

          <p><strong>Level ${level}</strong></p>
          <p>${xpPercent} / 100 XP</p>
          <p class="total-xp">Total XP: ${pet.xp}</p>

          <p>Status: ${pet.is_active ? "Active" : "Inactive"}</p>

          <button class="equip-btn" onclick="equipPet(${pet.pet_id})">
            Equip
          </button>

        `;

        myPetsList.appendChild(card);

      });


      })
      .catch(err => {
        console.error(err);
        alert("Error loading pets.");
      });

    }



//////////////////////////////////////////////////////
// EQUIP PET
//////////////////////////////////////////////////////
function equipPet(petId) {
  // Send equip request to backend
  fetch(`/pets/${petId}/equip`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  })
    .then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.message || "Failed to equip pet");
        }
        return data;
      });
    })
    .then(() => {

      alert("Pet equipped!");

      // Reload pet list so UI updates
      loadMyPets();
    })
    .catch(error => {
      console.error(error);
      alert("Error equipping pet.");
    });
}





















