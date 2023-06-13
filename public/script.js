const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchButton = document.getElementById("searchButton");
let artis = "";
let judul = "";
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
  } else if (!searchInput) {
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
      listItem.id = `searchResult-${result.idMusik}`;

      const title = document.createElement("span");
      title.textContent = result.judul;
      title.id = `searchResult-songTitle-${result.idMusik}`;
      listItem.appendChild(title);

      const artist = document.createElement("span");
      artist.textContent = result.artis;
      artist.id = `searchResult-songArtist-${result.idMusik}`;
      listItem.appendChild(artist);

      const cover = document.createElement("img");
      const coverData = new Uint8Array(result.cover.data);
      const blob = new Blob([coverData], { type: "image/jpeg" });
      const coverURL = URL.createObjectURL(blob);
      cover.src = coverURL;
      cover.id = `searchResult-songCover-${result.idMusik}`;
      cover.onerror = function () {
        console.log(`Failed to load cover for search result ${result.idMusik}`);
      };
      listItem.appendChild(cover);

      listItem.addEventListener("click", async () => {
        const id = listItem.id.split("-")[1];
        try {
          const response = await fetch(`/api/get-audio-path?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            const audioPath = data.path;
            const coverEl = document.getElementById("sidebar-cover");
            coverEl.src = coverURL;

            document.querySelector(".song-info span:nth-child(1)").textContent = data.title;
            document.querySelector(".song-info span:nth-child(2)").textContent = data.artist;

            document.getElementById("musicPlayer").setAttribute("src", audioPath);
            document.getElementById("musicPlayer").play();
          } else {
            console.log("Failed to get audio path from the server");
          }
        } catch (error) {
          console.log("An error occurred:", error);
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
        const coverData = new Uint8Array(data.cover.data);
        const blob = new Blob([coverData], { type: "image/jpeg" });
        const coverURL = URL.createObjectURL(blob);
        console.log(data.artist)
        document.querySelector(".song-info span:nth-child(1)").textContent = data.title;
        const coverEl = document.getElementById("sidebar-cover");
        coverEl.src = coverURL;
        console.log(coverEl);
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
const discoverElement = document.getElementById('sidebar-discover');

discoverElement.addEventListener('click', () => {
  window.location.href = '/discoverUser'; // Replace with the actual URL of the discoverUser page
});


const sidebarHome = document.getElementById('sidebar-home');

sidebarHome.addEventListener('click', () => {
  window.location.href = '/'; // Replace with the actual URL of the discoverUser page
});

const sidebarSubgenre = document.getElementById('sidebar-subgenre');

sidebarSubgenre.addEventListener('click', () => {
  window.location.href = '/subgenreUser'; // Replace with the actual URL of the discoverUser page
});

const sidebarGenre = document.getElementById('sidebar-genre');

sidebarGenre.addEventListener('click', () => {
  window.location.href = '/genreUser'; // Replace with the actual URL of the discoverUser page
});



