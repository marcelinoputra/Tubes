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




const buttons = document.querySelectorAll('.pencil-button');
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    document.getElementById('updateDataPopUp').classList.toggle("hidden");
    const idMusik = event.target.getAttribute('data-song-id');

    // Mengisi nilai input tersembunyi dengan idMusik
    const hiddenInput = document.getElementById('idMusik');
    hiddenInput.value = idMusik;

    // Lakukan tindakan apa pun yang Anda inginkan dengan idMusik, misalnya mengirimnya ke server untuk proses update data.

    // Contoh: Menampilkan idMusik di console
    console.log(idMusik);
  });
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
    console.log("tes");
    const trashButton = event.target;
    const songId = trashButton.getAttribute('data-song-id');

    // // Mengirim permintaan penghapusan ke server
    fetch(`/songs/${songId}`, {
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

let searchSub = document.getElementById('admin-searchbar-sub');
searchSub.addEventListener('input', async () => {
  const searchValue = searchSub.value.trim().toLowerCase();
  if (searchValue !== "") {
    console.log("tes")
    performSearchSubgenre(searchValue);
  }
});

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