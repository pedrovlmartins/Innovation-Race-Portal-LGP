/**
 * Created by Esquilo on 20/04/2017.
 */

$(document).ready(function () {
    $('#fullnameID').focusout(function () {
        if ($(this).val() == '') {
          $(this).css('border-color', '#FF0000');
          $('#registerButton').attr('disabled', true);
          $('#errorFullName').text('* You have to enter your name!');
        } else
        {
          $(this).css('border-color', '#2eb82e');
          $('#registerButton').attr('disabled', false);
          $('#errorFullName').text('');
        }
      }
      );
    $('#registerEmail').focusout(function () {
        if ($(this).val() == '') {
          $(this).css('border-color', '#FF0000');
          $('#registerButton').attr('disabled', true);
          $('#errorEmail').text('* You have to enter your e-mail!');
        } else
        {
          $(this).css('border-color', '#2eb82e');
          $('#registerButton').attr('disabled', false);
          $('#errorEmail').text('');
        }
      }
      );
    $('#registerPassword').focusout(function () {
          if ($(this).val() == '') {
            $(this).css('border-color', '#FF0000');
            $('#registerButton').attr('disabled', true);
            $('#errorPassword').text('* You have to enter your password!');
          } else if ($(this).val().length < 7) {
            $(this).css('border-color', '#FF0000');
            $('#registerButton').attr('disabled', true);
            $('#errorPassword').text('* Your password must be at least 7 characters long!');
          } else
            {
            $(this).css('border-color', '#2eb82e');
            $('#registerButton').attr('disabled', false);
            $('#errorPassword').text('');
          }
        }
        );
    $('#registerConfirmPassword').focusout(function () {
            if ($(this).val() == '') {
              $(this).css('border-color', '#FF0000');
              $('#registerButton').attr('disabled', true);
              $('#errorConfirmPassword').text('* You have to re-type your password!');
            } else if ($(this).val().length < 7) {
              $(this).css('border-color', '#FF0000');
              $('#registerButton').attr('disabled', true);
              $('#errorConfirmPassword').text('* Your password must be at least 7 characters long!');
            } else if ($(this).val() != $('#registerPassword').val()) {
              $(this).css('border-color', '#FF0000');
              $('#registerButton').attr('disabled', true);
              $('#errorConfirmPassword').text('* Your passwords must be identical!');
            } else
            {
              $(this).css('border-color', '#2eb82e');
              $('#registerButton').attr('disabled', false);
              $('#errorConfirmPassword').text('');
            }
          });
  }
  );
