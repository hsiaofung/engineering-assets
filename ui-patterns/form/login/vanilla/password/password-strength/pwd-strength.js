// password strength
var pass = document.getElementById("password");
pass.addEventListener("keyup", function () {
  checkPassword(pass.value);
});
function checkPassword(password) {
  var strengthBar = document.getElementById("strength");
  var strength = 0; // set default strength to 0
  if (password.match(/(?=.*\d)+/)) {
    // checks to see if password matches regular expression and increases strength by 1. Here we check for a number from 0-9
    strength += 1;
  }
  if (password.match(/(?=.*[a-z])(?=.*[A-Z])+/)) {
    //We are seeing if password as a lower case from a-z, upper case from A-Z
    strength += 1;
  }
  if (password.match(/(?=.*[!@#$%^&*()~<>?])+/)) {
    // check for funky character
    strength += 1;
  }
  if (password.length > 8) {
    // check for at least 8 characters
    strength += 1;
  }
  switch (
    strength // run switch statement on strength
  ) {
    case 0:
      strengthBar.value = 20;
      strengthBar.className = "";
      strengthBar.classList.add("pb20");
      break;
    case 1:
      strengthBar.value = 40;
      strengthBar.className = "";
      strengthBar.classList.add("pb40");
      break;
    case 2:
      strengthBar.value = 60;
      strengthBar.className = "";
      strengthBar.classList.add("pb60");
      break;
    case 3:
      strengthBar.value = 80;
      strengthBar.className = "";
      strengthBar.classList.add("pb80");
      break;
    case 4:
      strengthBar.value = 100;
      strengthBar.className = "";
      strengthBar.classList.add("pb100");
      break;
  }
}
