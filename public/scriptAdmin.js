document.getElementById("profile-btn").addEventListener("click", function () {
  document.getElementById("logOutPopup").classList.toggle("hidden");
});


const adminSidebarOverview = document.getElementById("Admin-sidebar-overview");
adminSidebarOverview.addEventListener("click", () => {
  window.location.href = "/mainAdmin";
});
document.getElementById("addButton").addEventListener("click", function () {
  document.getElementById("addDataPopUp").classList.toggle("hidden");
});

const adminSidebarSongs = document.getElementById("Admin-sidebar-songs");

adminSidebarSongs.addEventListener("click", () => {
  window.location.href = "/songsAdmin";
});

const adminSidebarSubGenre = document.getElementById("Admin-sidebar-subgenre");

adminSidebarSubGenre.addEventListener("click", () => {
  window.location.href = "/subgenreAdmin";
});

const adminSidebarGenre = document.getElementById("sidebar-genre");

adminSidebarGenre.addEventListener("click", () => {
  window.location.href = "/genreAdmin";
});



// Search songsAdmin 
function performSearchAdmin(query) {
  fetch(`/searchAdmin?query=${query}`)
    .then((response) => response.json())
    .then((data) => displaySearchAdminResults(data))
    .catch((error) => console.log(error));
}

function displaySearchAdminResults(results) {
  const tableBody = document.querySelector('.admintable-result tbody');

  tableBody.innerHTML = ''; // Clear the table body

  if (results.length === 0) {
    // Display "No results found" message
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.setAttribute('colspan', '7');
    cell.textContent = 'No results found';
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    // Display the search results
    results.forEach((song) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${song.idMusik}</td>
        <td>${song.judul}</td>
        <td>${song.artis}</td>
        <td>${song.tglRilis}</td>
        <td>${song.subNama}</td>
        <td>${song.genNama}</td>
        <td id="action">
        <!-- edit button -->
        <button class="pencil-button button" style="
        height:10%; width:30%;" data-song-id="<%= song.idMusik %>">
        Edit
        </button>
        <!-- delete button -->
        <button class="trash-button button" style="
        height:10%; width:30%;" data-song-id="<%= song.idMusik %>">
        Delete
        </button>
                </td>
        `;
      tableBody.appendChild(row);
    });
  }
}

//delete button
// Mendapatkan referensi elemen tbody
const songTableBody = document.getElementById('song-table-body');

// Menangani peristiwa klik menggunakan delegasi peristiwa
songTableBody.addEventListener('click', function (event) {

  // Memeriksa apakah peristiwa berasal dari tombol delete
  if (event.target.classList.contains('trash-button')) {
    const trashButton = event.target;
    const songId = trashButton.getAttribute('data-song-id');
    let subgenreId = '';

    // Determine the appropriate ID attribute based on the page
    if (window.location.pathname.includes('/songsAdmin')) {
      subgenreId = trashButton.getAttribute('data-subgenre-id');
    } else if (window.location.pathname.includes('/subgenreAdmin')) {
      subgenreId = trashButton.getAttribute('data-subgenre-id');
    }

    let deleteURL = '';

    // Determine the appropriate delete URL based on the page
    if (window.location.pathname.includes('/songsAdmin')) {
      deleteURL = `/songs/${songId}`;
    } else if (window.location.pathname.includes('/subgenreAdmin')) {
      deleteURL = `/subgenre/${subgenreId}`;
    }

    // Mengirim permintaan penghapusan ke server
    fetch(deleteURL, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Hapus baris dari HTML jika permintaan berhasil
          const row = trashButton.closest('tr');
          row.remove();
        } else {
          console.error('Error deleting song');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
});


//search subgenreAdmin
function performSearchSubgenre(query) {
  fetch(`/searchSubgenreAdmin?query=${query}`)
    .then((response) => response.json())
    .then((data) => displaySearchSubgenreResults(data))
    .catch((error) => console.log(error));
}

function displaySearchSubgenreResults(results) {
  const tableBody = document.querySelector('.admintable-result tbody');

  tableBody.innerHTML = ''; // Clear the table body

  if (results.length === 0) {
    // Display "No results found" message
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.setAttribute('colspan', '4');
    cell.textContent = 'No results found';
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    // Display the search results
    results.forEach((sub) => {
      const row = document.createElement('tr');
      row.innerHTML = `
  <td>${sub.idSubgenre}</td>
  <td>${sub.subNama}</td>
  <td>${sub.genNama}</td>
  <td id="action">
  <!-- edit button -->
  <button class="pencil-button button" style="
  height:10%; width:30%;" data-song-id="<%= song.idMusik %>">
  Edit
  </button>
  <!-- delete button -->
  <button class="trash-button button" style="
  height:10%; width:30%;" data-song-id="<%= song.idMusik %>">
  Delete
  </button>
          </td>
  `;
      tableBody.appendChild(row);
    });
  }
}