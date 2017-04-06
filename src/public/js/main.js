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
  var costumer = document.getElementById('Costumer');
  member.classList.remove('hide');
  partner.classList.add('hide');
  costumer.classList.add('hide');
}

function fPartner()   {
  var member = document.getElementById('Member');
  var partner = document.getElementById('Partner');
  var costumer = document.getElementById('Costumer');
  member.classList.add('hide');
  partner.classList.remove('hide');
  costumer.classList.add('hide');
}

function fCostumer()   {
  var member = document.getElementById('Member');
  var partner = document.getElementById('Partner');
  var costumer = document.getElementById('Costumer');
  member.classList.add('hide');
  partner.classList.add('hide');
  costumer.classList.remove('hide');
}

/* end Function to show/hide options on registration form */