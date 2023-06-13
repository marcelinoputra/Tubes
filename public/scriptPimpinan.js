document.getElementById("profile-btn").addEventListener("click", function () {
    document.getElementById("logOutPopup").classList.toggle("hidden");
  });
const adminSidebarOverview = document.getElementById('Admin-sidebar-overview');

adminSidebarOverview.addEventListener('click', () => {
  window.location.href = '/mainAdmin'; 
});

const adminSidebarSongs = document.getElementById('Admin-sidebar-songs');

adminSidebarSongs.addEventListener('click', () => {
  window.location.href = '/songsAdmin'; 
});
