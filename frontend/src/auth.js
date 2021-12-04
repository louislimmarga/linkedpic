import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { errorMessage, clearCredentials, show } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const loginSuccess = (token) => {
    localStorage.setItem("token", token);
    document.getElementById("navbar").style.display = "block";
    localStorage.setItem("posts", 0);

    let paras = document.getElementsByClassName('cardFeedContainer');
    while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }
    show("feedsContainer");
}

export const login = () => {
    const loginBody = {
        "username": document.getElementById("usernameLog").value,
        "password": document.getElementById("passwordLog").value
    };
    const result = fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(loginBody)
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                clearCredentials();
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                clearCredentials();
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            data.json().then(result => {
                loginSuccess(result.token);
            })
        }
    }).catch((error) => {
        console.log('Error', error);
    });
}

document.getElementById("changeToReg").addEventListener('click', () => {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("registerContainer").style.display = "block";
})

document.getElementById("backToLogin").addEventListener('click', () => {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("registerContainer").style.display = "none";
})

document.getElementById("regButton").addEventListener('click', () => {
    if (document.getElementById("passwordReg").value !== document.getElementById("confirmPasswordReg".value)) {
        console.log("error");
    }
    const regBody = {
        "username": document.getElementById("usernameReg").value,
        "password": document.getElementById("passwordReg").value,
        "email": document.getElementById("emailReg").value,
        "name": document.getElementById("nameReg").value
    };
    const res = fetch("http://localhost:5000/auth/signup", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(regBody)
    }).then((data) => {
        if (data.status === 409) {
            data.json().then(result => {
                errorMessage(result, "registerContainer");
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                errorMessage(result, "registerContainer");
            });
        } else if (data.status === 200) {
            data.json().then(result => {
                loginSuccess(result.token);
            });
        }
    })
})