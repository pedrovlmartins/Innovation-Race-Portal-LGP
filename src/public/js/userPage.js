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

function firstClick(id){
  var button = document.getElementById(id);
  /*if(id=="nameButton"){
      document.getElementById('name').removeAttribute("disabled");
  }
  else if(id=="emailButton"){
      document.getElementById('email').removeAttribute("disabled");
  }*/

  //alert(button.previousElementSibling.lastElementChild.getAttribute('value'));
  button.previousElementSibling.lastElementChild.removeAttribute("disabled");

  button.removeAttribute("onclick");
  button.setAttribute('type','submit');
  button.setAttribute('value','Submit');
  button.style.setProperty('background','white');

  // A partir daqui ja nao interessa
  var glyphiconsend = document.createElement('i');// tens que destruir o antigo nao?
    glyphiconsend.className = "glyphicon glyphicon-check";
    glyphiconsend.setAttribute('style','z-index:3;display:none;margin-left:-'+button.lastElementChild.offsetWidth +'px;');
    button.appendChild(glyphiconsend);

    $(glyphiconsend).toggle('slide');
    $(glyphiconsend.previousElementSibling).animate({opacity:'0'});
}





