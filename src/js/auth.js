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
