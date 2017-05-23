$(document).ready(function () {
  $('#contact_form').bootstrapValidator({

    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh',
    },
    fields: {
      name: {
        validators: {
          stringLength: {
            min: 2,
          },
          notEmpty: {
            message: 'Please supply your name',
          },
        },
      },
      email: {
        validators: {
          notEmpty: {
            message: 'Please supply your email address',
          },
          emailAddress: {
            message: 'Please supply a valid email address',
          },
        },
      },
      subject: {
        validators: {
          stringLength: {
            min: 2,
          },
          notEmpty: {
            message: 'Please supply the subject of your question',
          },
        },
      },
      message: {
        validators: {
          stringLength: {
            min: 10,
            max: 200,
            message: 'Please enter at least 10 characters and no more than 200',
          },
          notEmpty: {
            message: 'Please supply your question',
          },
        },
      },
    },
  })
    .on('success.form.bv', function (e) {
      $('#success_message').slideDown({ opacity: 'show' }, 'slow');
      $('#contact_form').data('bootstrapValidator').resetForm();

      // Prevent form submission
      e.preventDefault();

      // Get the form instance
      var $form = $(e.target);

      // Get the BootstrapValidator instance
      var bv = $form.data('bootstrapValidator');

      // Use Ajax to submit form data
      $.post($form.attr('action'), $form.serialize(), function (result) {
        url: '/contact';
      })
        .done(function (data) {
          swal({
            title: 'Contact Form',
            text: 'Your question was sucessfully sent!',
            type: 'success',
          }, function () {
            window.location.reload();
          });
        })
        .fail(function (data) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again later!',
            type: 'error',
          }, function () {
            window.location.reload();
          });
        });
    });
});
