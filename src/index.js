import { loginUser, setCookieAccessToken } from "./js/auth";
import "./css/login.css";
import "./assets/Freddys_Logo.svg";


const loginForm = document.getElementById("loginForm");
const userNameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");
const errorMessage = document.getElementById("error-message");
const inputSubmit = document.getElementById("input-submit");

const disableSubmit = () => {
    inputSubmit.setAttribute('disabled', true);
    inputSubmit.style.cursor = 'default';
    inputSubmit.value = "Logging In..."
}
const enableSubmit = () => {
    inputSubmit.removeAttribute('disabled')
    inputSubmit.style.cursor = 'pointer';
    inputSubmit.value = "Login"
}




//Function to handle client-side validation error
const handleErrorLogIn = (errorMsg) => {
    errorMessage.innerHTML = errorMsg;
    errorMessage.style.visibility = "visible"
}


//Function to handle logging in when the user clicks on the login button
const handleLogin = (event) => {
    event.preventDefault();
    disableSubmit();

    errorMessage.style.visibility = "hidden";
    if (userNameInput.value === "" || passwordInput.value === "") {
        handleErrorLogIn("Username or Password cannot be empty");
        return;
    }
    try {
        loginUser(userNameInput.value, passwordInput.value)
            .then(res => {
                if ("access_token" in res && "refresh_token" in res) {
                    setCookieAccessToken(res.access_token, res.refresh_token);

                    //Navigate to dashboard page if login is successful
                    window.location.assign("./dashboard.html");
                } else {
                    if ("msg" in res) {
                        handleErrorLogIn(res.msg);
                        enableSubmit();
                    } else {
                        handleErrorLogIn("Error Logging In");
                        enableSubmit();
                    }
                }
            })
            .catch(err => {
                handleErrorLogIn("Error Logging In");
                enableSubmit();
            })
    } catch (err) {
        handleErrorLogIn("Error Logging In");
        inputSubmit.value = "Login"
    }
}


loginForm.addEventListener("submit", handleLogin);