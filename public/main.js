let nameInput = document.querySelector('#nameButton').addEventListener('click', getNameData)
let durationInput = document.querySelector('#durationButton').addEventListener('click', getDurationData)

// Database Functions

function getNameData(){
    const inputName = document.querySelector('#plantSearch').value
    let url = `/plants?common_name=${inputName}`
window.location.replace(url)
}

function getDurationData(){
    const inputDuration = document.querySelector('#plantSearch').value
    let url = `/plants?duration=${inputDuration}`
window.location.replace(url)
}

// Forum functions

//NavBar
function hideIconBar(){
    let iconBar = document.getElementById("iconBar");
    let navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:none;");
    navigation.classList.remove("hide");
}

function showIconBar(){
    let iconBar = document.getElementById("iconBar");
    let navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:block;");
    navigation.classList.add("hide");
}

//Comment
function showComment(){
    let commentArea = document.getElementById("comment-area");
    commentArea.classList.remove("hide");
}

//Reply
function showReply(){
    let replyArea = document.getElementById("reply-area");
    replyArea.classList.remove("hide");
}

// Animation
window.addEventListener('DOMContentLoaded', event => {

  // Navbar shrink function
  var navbarShrink = function () {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
          return;
      }
      if (window.scrollY === 0) {
          navbarCollapsible.classList.remove('navbar-shrink')
      } else {
          navbarCollapsible.classList.add('navbar-shrink')
      }

  };

  // Shrink the navbar 
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
      new bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          offset: 74,
      });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
      document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
              navbarToggler.click();
          }
      });
  });

  // Activate SimpleLightbox plugin for portfolio items
  new SimpleLightbox({
      elements: '#portfolio a.portfolio-box'
  });

});
