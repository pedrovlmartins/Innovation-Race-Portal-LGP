$(document).ready(function () {
  $('#classificationForm').validate();
});


$(document).ready(function () {
    $('#strategyTextArea').focusout(function() {
            if ($(this).val() == '') {
                $(this).css('border-color', '#FF0000');
                $('#classificationSubmitButton').attr('disabled', true);
            } else {
                $(this).css('border-color', '#2eb82e');
                $('#classificationSubmitButton').attr('disabled', false);
            }
        }
    );
}