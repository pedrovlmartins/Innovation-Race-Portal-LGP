$('.nav li').on('click', function () {
  $('.nav li').removeClass('active');
  $(this).addClass('active');
});

$(function () {
  $('a').each(function () {
    if ($(this).prop('href') == window.location.href) {
      $(this).addClass('active'); $(this).parents('li').addClass('active');
    }
  });
});
