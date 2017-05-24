/**
 * Created by Esquilo on 24/05/2017.
 */

$(document).ready(function () {
    $('#firstPassword').focusout(function () {
          if ($(this).val() == '') {
            $(this).css('border-color', '#FF0000');
            $('#changeSubmitButton').attr('disabled', true);
            $('#firstPasswordError').text('* You have to enter your password!');
          } else if ($(this).val().length < 7) {
            $(this).css('border-color', '#FF0000');
            $('#changeSubmitButton').attr('disabled', true);
            $('#firstPasswordError').text('* Your password must be at least 7 characters long!');
          } else
            {
            $(this).css('border-color', '#2eb82e');
            $('#changeSubmitButton').attr('disabled', false);
            $('#firstPasswordError').text('');
          }
        }
        );

    $('#secondPassword').focusout(function () {
            if ($(this).val() == '') {
              $(this).css('border-color', '#FF0000');
              $('#changeSubmitButton').attr('disabled', true);
              $('#secondPasswordError').text('* You have to re-type your password!');
            } else if ($(this).val().length < 7) {
              $(this).css('border-color', '#FF0000');
              $('#changeSubmitButton').attr('disabled', true);
              $('#secondPasswordError').text('* Your password must be at least 7 characters long!');
            } else if ($(this).val() != $('#firstPassword').val()) {
              $(this).css('border-color', '#FF0000');
              $('#changeSubmitButton').attr('disabled', true);
              $('#secondPasswordError').text('* Your passwords must be identical!');
            } else
            {
              $(this).css('border-color', '#2eb82e');
              $('#changeSubmitButton').attr('disabled', false);
              $('#secondPasswordError').text('');
            }
          });
  }
  );
