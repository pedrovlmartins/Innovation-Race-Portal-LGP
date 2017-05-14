$(document).ready(function () {
  $.validator.addMethod('date_smaller_than', function (value, element, param) {
    return new Date($(element).val()).getTime() < new Date($(param).val()).getTime();
  });

  $.validator.addMethod('date_not_smaller_than', function (value, element, param) {
    return new Date($(element).val()).getTime() >= new Date($(param).val()).getTime();
  });

  $('#createRace-form').validate();
});
