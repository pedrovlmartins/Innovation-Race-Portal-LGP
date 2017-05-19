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
  button.previousElementSibling.lastElementChild.removeAttribute("disabled");

  button.removeAttribute("onclick");
  button.setAttribute('type','submit');
  button.setAttribute('value','Submit');
  button.style.setProperty('background','white');

  var glyphiconsend = document.createElement('i');
    glyphiconsend.className = "glyphicon glyphicon-check";
    glyphiconsend.setAttribute('style','z-index:3;display:none;margin-left:-'+button.lastElementChild.offsetWidth +'px;');
    button.appendChild(glyphiconsend);

    $(glyphiconsend).toggle('slide');
    $(glyphiconsend.previousElementSibling).animate({opacity:'0'});
}

function showDiv(id) {{
  document.getElementById("userTypeOptions").style.display ="block";
//funcçao par aparecer a merda das opçoes
    var button = document.getElementById(id);

    button.removeAttribute("onclick");
    button.setAttribute('type','submit');
    button.setAttribute('value','Submit');

    var glyphiconsend = document.createElement('i');
    glyphiconsend.className = "glyphicon glyphicon-check";
    glyphiconsend.setAttribute('style','z-index:3;display:none;margin-left:-'+button.lastElementChild.offsetWidth +'px;');
    button.appendChild(glyphiconsend);

    $(glyphiconsend).toggle('slide');
    $(glyphiconsend.previousElementSibling).animate({opacity:'0'});
}

}



