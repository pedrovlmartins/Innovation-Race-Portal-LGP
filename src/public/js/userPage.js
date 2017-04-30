$(document).ready(function () {
  $(".userNavbar li").click(function () {
    $(".userNavbar li.active").removeClass("active");
    $(this).addClass("active");
  });

  $("#ideas").click(function() {
    $("#profileDiv").hide();
    $("#ideasDiv").show();
    $("#submitDiv").hide();
  });

  $("#profile").click(function() {
    $("#profileDiv").show();
    $("#ideasDiv").hide();
    $("#submitDiv").hide();
  });

  $("#submit").click(function() {
    $("#profileDiv").hide();
    $("#ideasDiv").hide();
    $("#submitDiv").show();
  });
});
