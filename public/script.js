const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function () {
    const searchQuery = searchInput.value.trim().toLowerCase();

    // Clear previous search results
    searchResults.innerHTML = "";

    // Perform search and display results
    if (searchQuery !== "") {
        const searchData = performSearch(searchQuery);
        displaySearchResults(searchData);
    }
});

// Function to perform the search (dummy implementation)
function performSearch(query) {
    // Replace this with your actual search logic
    const data = ["Result 1", "Result 2", "Result 3"];

    // Filter the data based on the search query
    const filteredData = data.filter((item) =>
        item.toLowerCase().includes(query)
    );

    return filteredData;
}

// Function to display the search results
function displaySearchResults(results) {
    if (results.length === 0) {
        const noResultsItem = document.createElement("li");
        noResultsItem.textContent = "No results found.";
        searchResults.appendChild(noResultsItem);
    } else {
        results.forEach((result) => {
            const listItem = document.createElement("li");
            listItem.textContent = result;
            searchResults.appendChild(listItem);
        });
    }
}

document.getElementById("premium-button").addEventListener("click", function () {
    // Function buat popup premium
    // function showPremiumPopup() {
    document.getElementById("premiumPopup").classList.toggle('hidden');
})

var musicPlayer = document.getElementById('musicPlayer');
var playButton = document.getElementById('playButton');
var pauseButton = document.getElementById('pauseButton');

playButton.addEventListener('click', function () {
    musicPlayer.play();
});

pauseButton.addEventListener('click', function () {
    musicPlayer.pause();
});

document.getElementById("profile-btn").addEventListener("click", function () {
    document.getElementById("logOutPopup").classList.toggle('hidden');
})
