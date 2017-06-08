$(document).ready(function () {

  if (window.location.href.indexOf("profile") > -1) {
    $("#profile").addClass("active");
    $("#profile").find("a").removeAttr("href");
  }
  else if(window.location.href.indexOf("ideas") > -1) {
    $("#ideas").addClass("active");
    $("#ideas").find("a").removeAttr("href");
  }
  else if(window.location.href.indexOf("submitIdea") > -1) {
    $("#submit").addClass("active");
    $("#submit").find("a").removeAttr("href");
  }
    $('#name-change').change(function () {
            if ($(this).val() === '') {
                $(this).css('border-color', '#FF0000');
                $('#nameButton-change').attr('disabled', true);
                $('#errorName-change').text('* You have to enter your name!');
            } else
            {
                $(this).css('border-color', '#2eb82e');
                $('#nameButton-change').attr('disabled', false);
                $('#errorName-change').text('');
            }
        }
    );

    $('#email-change').change(function () {
            if ($(this).val() === '') {
                $(this).css('border-color', '#FF0000');
                $('#emailButton-change').attr('disabled', true);
                $('#errorEmail-change').text('* You have to enter your e-mail!');
            } else
            {
                $(this).css('border-color', '#2eb82e');
                $('#emailButton-change').attr('disabled', false);
                $('#errorEmail-change').text('');
            }
        }
    );
    $('#password-change').focusout(function () {
            if ($(this).val() === '') {
                $(this).css('border-color', '#FF0000');
                $('#passwordButton-change').attr('disabled', true);
                $('#errorPassword-change').text('* You have to enter your password!');
            } else if ($(this).val().length < 7) {
                $(this).css('border-color', '#FF0000');
                $('#passwordButton-change').attr('disabled', true);
                $('#errorPassword').text('* Your password must be at least 7 characters long!');
            }else{
                $(this).css('border-color', '#2eb82e');
                $('#passwordButton-change').attr('disabled', false);
                $('#errorPassword-change').text('');
            }
        }
    );
});

function firstClick(id) {
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

function password(){

    var form = document.getElementById('passwordForm').firstElementChild.children[1];
    form.removeAttribute('disabled');
    form.setAttribute('style','display:inline-block');

    document.getElementById('passwordForm').firstElementChild.firstElementChild.removeAttribute('disabled');

    var button = document.getElementById('passwordButton-change');
    button.removeAttribute("onclick");
    button.setAttribute('type','submit');
    button.setAttribute('value','Submit');
    button.style.setProperty('background','white');

    var glyphiconsend = document.createElement('i');
    glyphiconsend.className = "glyphicon glyphicon-check";
    glyphiconsend.setAttribute('style','z-index:3;display:none;margin-left:-'+button.lastElementChild.offsetWidth +'px;');
    button.appendChild(glyphiconsend);

    var buttonRemove = document.getElementById('passwordButton-remove');
    buttonRemove.style.display = "block";
//estas a ver ali o x? tem que ir para debaixo do check

    $(glyphiconsend).toggle('slide');
    $(glyphiconsend.previousElementSibling).animate({opacity:'0'});

    var password = document.getElementById("newPassword");
    password.firstElementChild.style.setProperty('display','inline');
}




