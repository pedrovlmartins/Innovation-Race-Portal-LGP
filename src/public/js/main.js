/* Function to show/hide options on registration form */

function showHide(elm) {
  var phone = document.getElementById('phonenumber');
  var email = document.getElementById('email');
  if (elm.id == 'rdoPhone') {
    phone.classList.remove('hide');
    email.classList.add('hide');
  } else
  {
    phone.classList.add('hide');
    email.classList.remove('hide');
  }
}

function fMember()   {
  var member = document.getElementById('Member');
  var partner = document.getElementById('Partner');
  var customer = document.getElementById('Customer');
  member.classList.remove('hide');
  partner.classList.add('hide');
  customer.classList.add('hide');
}

function fPartner()   {
  var member = document.getElementById('Member');
  var partner = document.getElementById('Partner');
  var customer = document.getElementById('Customer');
  member.classList.add('hide');
  partner.classList.remove('hide');
  customer.classList.add('hide');
}

function fCustomer()   {
  var member = document.getElementById('Member');
  var partner = document.getElementById('Partner');
  var customer = document.getElementById('Customer');
  member.classList.add('hide');
  partner.classList.add('hide');
  customer.classList.remove('hide');
}

jQuery(document).ready(function ($) {
  $('.clickable-row').click(function () {
    window.location = $(this).data('');
  });
});

/* end Function to show/hide options on registration form */
