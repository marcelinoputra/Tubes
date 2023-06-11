const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  document.getElementById("searchPopup").style.display = "grid";
});
document.getElementById("searchCloseButton").addEventListener("click", () => {
  searchResults.innerHTML = "";
  document.getElementById("searchPopup").style.display = "none";
});
searchInput.addEventListener("input", function () {
  const searchQuery = searchInput.value.trim().toLowerCase();

  // Clear previous search results
  searchResults.innerHTML = "";

  // Perform search and display results
  if (searchQuery !== "") {
    performSearch(searchQuery);
  } else if(!searchInput){
    // Clear search results if search bar is empty
    clearSearchResults();
  }
});

// Function to perform the search
function performSearch(query) {
  fetch(`/search?query=${query}`)
    .then((response) => response.json())
    .then((data) => displaySearchResults(data))
    .catch((error) => console.log(error));
}

// Function to display the search results
function displaySearchResults(results) {
  if (results.length === 0) {
    const noResultsItem = document.createElement("li");
    noResultsItem.textContent = "No results found.";
    noResultsItem.classList.add("no-results");
    searchResults.appendChild(noResultsItem);
  } else {
    results.forEach((result) => {
      const listItem = document.createElement("li");
      listItem.classList.add("search-result");
      listItem.classList.add("playable");
      listItem.id = result.idMusik;
      console.log(listItem)
      const title = document.createElement("span");
      title.textContent = result.judul;
      listItem.appendChild(title);

      const artist = document.createElement("span");
      artist.textContent = result.artis;
      listItem.appendChild(artist);
    
      listItem.addEventListener("click", async () => {
        // Ambil ID dari elemen yang diklik
        const id = listItem.id;
        try {
          // Lakukan permintaan ke server untuk mendapatkan path audio berdasarkan ID
          const response = await fetch(`/api/get-audio-path?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            const audioPath = data.path;
            // Ubah src audio dengan path yang baru
            document.getElementById("musicPlayer").setAttribute("src", audioPath);

            // Play audio
            document.getElementById("musicPlayer").play();
          } else {
            console.log("Gagal mendapatkan path audio dari server");
          }
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }
      });

      searchResults.appendChild(listItem); 
    });
  }
}


// Function to clear search results
function clearSearchResults() {
  searchResults.innerHTML = "";
}

document
  .getElementById("premium-button")
  .addEventListener("click", function () {
    // Function buat popup premium
    // function showPremiumPopup() {
    document.getElementById("premiumPopup").style.display = "flex";
  });
document.getElementById("cancelButton").addEventListener("click", function () {
  // Function buat popup premium
  // function showPremiumPopup() {
  document.getElementById("premiumPopup").style.display = "none";
});

var musicPlayer = document.getElementById("musicPlayer");
var playButton = document.getElementById("playButton");
var pauseButton = document.getElementById("pauseButton");

playButton.addEventListener("click", function () {
  musicPlayer.play();
});

pauseButton.addEventListener("click", function () {
  musicPlayer.pause();
});

document.getElementById("profile-btn").addEventListener("click", function () {
  document.getElementById("logOutPopup").classList.toggle("hidden");
});

// Ambil semua elemen dengan class "playable"
const playableElements = document.querySelectorAll(".playable");
// Tambahkan event listener pada setiap elemen
playableElements.forEach((element) => {
  element.addEventListener("click", async () => {
    // Ambil ID dari elemen yang diklik
    const id = element.id;
    try {
      // Lakukan permintaan ke server untuk mendapatkan path audio berdasarkan ID
      const response = await fetch(`/api/get-audio-path?id=${id}`);
      const data = await response.json();

      if (response.ok) {
        const audioPath = data.path;
        // Ubah src audio dengan path yang baru
        document.getElementById("musicPlayer").setAttribute("src", audioPath);

        // Play audio
        document.getElementById("musicPlayer").play();
      } else {
        console.log("Gagal mendapatkan path audio dari server");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  });
});



