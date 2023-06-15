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

document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("addDataPopUp").classList.add("hidden");
});
document.getElementById("cancelButton-in-update-popup").addEventListener("click", function () {
  document.getElementById("updateDataPopUp").classList.add("hidden");
});


const buttons = document.querySelectorAll('#pencil-button');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('updateDataPopUp').classList.toggle("hidden")
  });
});