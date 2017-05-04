$(document).ready(function () {
  if (window.location.href.indexOf("profile") > -1) {
    $("#profile").addClass("active");
    $("#profile").find("a").removeAttr("href");
  }
  else if(window.location.href.indexOf("ideas") > -1) {
    $("#ideas").addClass("active");
    $("#ideas").find("a").removeAttr("href");
  }
  else if(window.location.href.indexOf("ideas") > -1) {
    $("#submit").addClass("active");
    $("#submit").find("a").removeAttr("href");
  }
});
