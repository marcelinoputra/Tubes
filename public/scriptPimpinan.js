document.getElementById("profile-btn").addEventListener("click", function () {
  document.getElementById("logOutPopup").classList.toggle("hidden");
});

document.getElementById('Pimpinan-sidebar-overview').addEventListener('click', () => {
window.location.href = '/mainPimpinan'; 
});

document.getElementById('Pimpinan-sidebar-sales').addEventListener('click', () => {
window.location.href = '/salesPimpinan'; 
});

document.getElementById('Pimpinan-sidebar-songs').addEventListener('click', () => {
window.location.href = '/songsPimpinan'; 
});

document.getElementById('Pimpinan-sidebar-genre').addEventListener('click', () => {
window.location.href = '/genrePimpinan'; 
});

document.getElementById('Pimpinan-sidebar-subgenre').addEventListener('click', () => {
window.location.href = '/subgenrePimpinan'; 
});

document.getElementById('Pimpinan-sidebar-user').addEventListener('click', () => {
window.location.href = '/userPimpinan'; 
});

function getCurrentDate() {
  var currentDate = new Date();
  var dateString = currentDate.toDateString();
  var dateElement = document.getElementById("currentDate");
  dateElement.textContent = dateString;
}

// Menggunakan Fetch API untuk mengambil data pembayaran dari server
fetch('/dataPembayaran')
  .then((response) => response.json())
  .then((data) => {
    // Data pembayaran diterima dari server, lanjutkan dengan membuat grafik
    const bulan = data.map((item) => item.bulan);
    const jumlahPembayaran = data.map((item) => item.jumlah_pembayaran);

    // Menggunakan Chart.js untuk membuat grafik
    const ctx = document.getElementById('salesBarChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bulan,
        datasets: [
          {
            label: 'Jumlah Pembayaran',
            data: jumlahPembayaran,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const ctx2 = document.getElementById('salesLineChart').getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: bulan,
        datasets: [
          {
            label: 'Jumlah Pembayaran',
            data: jumlahPembayaran,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });


// //diagram garis sales
// const ctl = document.getElementById('salesLineChart').getContext('2d');
// const lineChart = new Chart(ctl, {
// type: 'line',
// data: {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//   datasets: [{
//     label: 'Data',
//     data: [12, 19, 3, 5, 2, 3, 6, 10, 8, 7, 4, 15], //data sementara, blm connect db
//     backgroundColor: 'rgba(0, 123, 255, 0.5)', // Optional
//     borderColor: 'rgba(0, 123, 255, 1)', // Optional
//     borderWidth: 1 // Optional
//   }]
// },
// options: {
//   responsive: true,
//   scales: {
//     y: {
//       beginAtZero: true
//     }
//   }
// }
// });

function displaySearchAdminResults(results) {
const tableBody = document.querySelector('.pimpinan-notmain-content-right tbody');

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
      <td>${song.totalstreamed}</td>
      `;
    tableBody.appendChild(row);
  });
}
}
