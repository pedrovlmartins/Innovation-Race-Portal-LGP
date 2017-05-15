$(document).ready(function () {
  $('.race-remove').click(function (event) {
    var raceID = $(this).data('id');
    swal({
        title: 'Are you sure?',
        text: 'You are about to cancel this race. This action is irreversible.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, cancel it',
        closeOnConfirm: false,
      },
      function () {
        $.post('manageRaces/terminate/' + raceID, function (data) {
          location.reload();
        });
      });
  });
});
