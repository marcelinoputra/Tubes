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

//diagram batang sales
const ctb = document.getElementById('salesBarChart').getContext('2d');
const barChart = new Chart(ctb, {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Data',
      data: [12, 19, 3, 5, 2, 3, 6, 10, 8, 7, 4, 15], //data sementara, blm connect db
      backgroundColor: 'rgba(0, 123, 255, 0.5)', // Optional
      borderColor: 'rgba(0, 123, 255, 1)', // Optional
      borderWidth: 1 // Optional
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

//diagram garis sales
const ctl = document.getElementById('salesLineChart').getContext('2d');
const lineChart = new Chart(ctl, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Data',
      data: [12, 19, 3, 5, 2, 3, 6, 10, 8, 7, 4, 15], //data sementara, blm connect db
      backgroundColor: 'rgba(0, 123, 255, 0.5)', // Optional
      borderColor: 'rgba(0, 123, 255, 1)', // Optional
      borderWidth: 1 // Optional
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
