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
