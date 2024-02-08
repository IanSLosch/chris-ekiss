import "owl.carousel"
import "./juicer"
import moment from 'moment'
// import "magnific-popup"


jQuery(document).ready(function ($) {
  // INSTAGRAM
  $("#instagram-feed").juicer()

  // MOBILE MENU
  $('.mobile-menu-icon').on('click', function () {
    $("ul.nav-menu").toggleClass('active')
    $("ul.social").toggleClass('active')
    $("header").toggleClass('active')
    $(".line").toggleClass('active')
  })

  $('.nav-button').on('click', function () {
    if ($('ul.nav-menu').hasClass('active')) {
      $("ul.nav-menu)").toggleClass('active')
      $("ul.social").toggleClass('active')
      $("header").toggleClass('active')
      $(".line").toggleClass('active')
    }
  })

  // VIDEO CAROUSEL
  function createVideoCarousel() {
    const videoCarousel = $("#video-carousel")
    const leftArrow = '<div class="owl-custom-nav-prev arrow"><i class="fa-solid fa-chevron-left"></i></div>'
    const rightArrow = '<div class="owl-custom-nav-next arrow"><i class="fa-solid fa-chevron-right"></i></div>'

    videoCarousel.owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      startPosition: 1,
      center: true,
      margin: 20,
      responsive: {
        0: {
          items: 2,
        },
        700: {
          items: 3,
        }
      },
      navText: [
        leftArrow,
        rightArrow
      ]
    })
  }
  createVideoCarousel()

  $('.video-switch a').on('click', function (e) {
    e.preventDefault();
    $('.feature-video').attr('src', "https://www.youtube.com/embed/" + $(this).attr('data-videoid'));
  })

  // // Scroll
  $('.scroll').on('click', function (e) {
    e.preventDefault();

    const href = $(this).attr('href');
    const targetOffset = $(href).offset().top;
    const animationDuration = 500;

    $(".navbar").toggleClass("active");
    $('html, body').animate({
      scrollTop: targetOffset
    },
      animationDuration
    )
  });

});