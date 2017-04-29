$(document).ready(function () {
  $(".userNavbar li").click(function () {
    $(".userNavbar li.active").removeClass("active");
    $(this).addClass("active");
  });
});
