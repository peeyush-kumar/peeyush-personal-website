// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('active');
    });
  }

  // Mobile submenu toggle
  var subMenuParents = document.querySelectorAll('.has-submenu');
  subMenuParents.forEach(function (item) {
    item.querySelector('a').addEventListener('click', function (e) {
      if (window.innerWidth <= 600) {
        // Only prevent default on first click to open submenu
        if (!item.classList.contains('open')) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      }
    });
  });
});
