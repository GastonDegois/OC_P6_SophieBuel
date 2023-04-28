// VARIABLES
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorEmail = document.querySelector('.error--email');
const errorPassword = document.querySelector('.error--password')
const submit = document.querySelector('#login form');


// call when the form is submitted
submit.addEventListener('submit', (e) => {
    e.preventDefault();
    let isEmailValid = false;
    let isPasswordValid = false;
    errorEmail.innerHTML = "";
    errorPassword.innerHTML = "";
    const emailRegExp = new RegExp (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    // if the inputs formats are unvalid, then print the error messages
    if (emailInput.value.trim() == "") {
        errorEmail.innerHTML = "Veuillez rentrer votre email !";
    } else if (emailRegExp.test(emailInput.value) == false) {
        errorEmail.innerHTML = "Format de mail invalide !";
        console.log("test");
    } else {isEmailValid = true;}

    if (passwordInput.value.trim() == "") {
        errorPassword.innerHTML = "Veuillez rentrer votre mot de passe !";
    } else {isPasswordValid = true;}

    // if the input formats are valid, then call the function checkUser
    if (isEmailValid == true && isPasswordValid == true) {checkUser()}
});

async function checkUser() {

    // send email and password to API
    const user = {
        "email": emailInput.value,
        "password": passwordInput.value
    }
    const r = await fetch('http://localhost:5678/api/users/login', {
       method: 'POST',
       headers: {'Content-Type': 'application/json;charset=utf-8'},
         body: JSON.stringify(user)
   })

   // if error is returned, then print error message
    if (r.status == 404) {
        errorEmail.innerHTML = "E-mail inconnue !";
   } else if (r.status == 401) {
        errorPassword.innerHTML = "Mauvais mot de passe !";
        // if it matches, then log    the user and send to index.html
   } else if (r.status == 200) {
        const data = await r.json();
        localStorage.setItem('token', data.token);
        console.log(await r);
        console.log(await data.token);
        location.href="../index.html";
    }
}