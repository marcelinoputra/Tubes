document.getElementById("profile-btn").addEventListener("click", function () {
    document.getElementById("logOutPopup").classList.toggle("hidden");
  });

document.getElementById('Pimpinan-sidebar-overview').addEventListener('click', () => {
  window.location.href = '/mainPimpinan'; 
});


document.getElementById('Pimpinan-sidebar-sales').addEventListener('click', () => {
  window.location.href = '/salesPimpinan'; 
});


function getCurrentDate() {
    var currentDate = new Date();
    var dateString = currentDate.toDateString();
    var dateElement = document.getElementById("currentDate");
    dateElement.textContent = dateString;
}