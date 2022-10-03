import { loginUser, setCookieAccessToken } from "./js/auth";
import "./css/login.css";
import "./assets/Freddys_Logo.svg";


const loginForm = document.getElementById("loginForm");
const userNameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");
const errorMessage = document.getElementById("error-message");


//Function to handle client-side validation error
const handleErrorLogIn = (errorMsg) => {
    errorMessage.innerHTML = errorMsg;
    errorMessage.style.visibility = "visible"
}



//Function to handle logging in when the user clicks on the login button
const handleLogin = (event) => {
    event.preventDefault();
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
                    } else {
                        handleErrorLogIn("Error Logging In");
                    }
                }
            })
            .catch(err => {
                handleErrorLogIn("Error Logging In");
            })
    } catch (err) {
        handleErrorLogIn("Error Logging In");
    }
}


loginForm.addEventListener("submit", handleLogin);