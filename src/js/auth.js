export const BASEURL = "https://freddy.codesubmit.io";
export const ACCESS_TOKEN_KEY = "accessToken";
const COOKIE_MAX_AGE = 15 * 60 * 1000; //access token will be stored for 15 minutes in the cookie storage
const REFRESH_TOKEN_KEY = "refreshToken";


export const loginUser = (username, password) => {
    return initiatelogin(username, password)
        .then((res) => { return res },
            (reason) => { return reason })
}

const initiatelogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            fetch(`${BASEURL}/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
                .then((res) => { resolve(res.json()) },
                    (reason) => { reject(reason) }
                )

        }
        catch (error) {
            reject(error)
        }

    })


}

//Function to store access_token and refresh_token at the client side when user logs in
export const setCookieAccessToken = (accessToken, refreshToken) => {
    let expires = "";
    let date = new Date();
    date.setTime(date.getTime() + COOKIE_MAX_AGE);
    expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}${expires};path=/`;
    localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken))

}


//Function for retrieving access_token from clien-side storage
export const getCookieAccessToken = (cookieKey) => {
    const name526 = cookieKey + "=";
    const ca = document.cookie.split(';');

    //When access token has not expired
    for (let i = 0; i < ca.length; i++) {
        let a1 = ca[i];
        while (a1.charAt(0) == ' ') {
            a1 = a1.substring(1);
        }
        if (a1.indexOf(name526) === 0) {
            return a1.substring(name526.length, a1.length);
        }
    }
    return "";

}

//Function to retrieve access_token at from endpoint when access_token expires
export const resetAccessToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        fetch(`${BASEURL}/refresh`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                authorization: `Bearer ${refreshToken}`
            }
        })
            .then(res => {
                resolve(res.json())
            })
            .catch(err => {
                reject(err);
            })
    })

}

//Function to reset access_token at the client-side storage when access_token expires
export const refreshCookieAccessToken = (refreshToken) => {
    resetAccessToken(refreshToken)
        .then(data => {
            setCookieAccessToken(data.access_token, refreshToken);
        })
        .catch(err => {
            console.log("refreshCookieAccessToken - Error", err);
        })
}

//Call this function when error message is 'token has expired'.
export const getAccessToken = () => {
    let access_token = getCookieAccessToken(ACCESS_TOKEN_KEY);
    if (!access_token) {
        refreshCookieAccessToken()
            .then(res => {
                setCookieAccessToken(res);
            })
            .catch(err => {
                console.log(err);
            })
    }
}


//Function to clean tokens from client side storage when user logs out
const cleanTokens = () => {
    let expires = "";
    let date = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60);
    expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${ACCESS_TOKEN_KEY}=''${expires};path=/`;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}


//Function to call when user logs out
export const logout = () => {
    cleanTokens();
    //Direct user to login page
    window.location.assign('./');
}


//This function will help reduce the number of round trip if access_token expires
//This function will be called before making a request to the backend for data
export const authenticateCalls = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ? JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY)) : "";

    //Add a condition to determine if not on sign in page
    if (getCookieAccessToken(ACCESS_TOKEN_KEY) === "" && refreshToken === "") {
        // Redirect user to login page
        window.location.assign('./');
    } else if (getCookieAccessToken(ACCESS_TOKEN_KEY) === "" && refreshToken !== "") {
        //refresh access_token
        refreshCookieAccessToken(refreshToken);
    }
    else {
        //Redirect user to login page
        window.location.assign('./');
    }

}


//Function to protect private routes
export const protectRoutes = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ? JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY)) : "";
    if (getCookieAccessToken(ACCESS_TOKEN_KEY) === "" && refreshToken === "") {
        //Redirect user to login page
        window.location.assign('./');
    }
}
