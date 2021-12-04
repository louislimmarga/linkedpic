import API from './api.js';
import { login } from './auth.js'
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, show, clearCredentials } from './helpers.js';
import { showProfile } from './user.js';
import { uploadPost } from './post.js';
import { loadFeed } from './feed.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

document.getElementById('loginButton').addEventListener('click', (login));

document.getElementById('navProfile').onclick = function() {showProfile("", "", true);};

document.getElementById('QuickpicLogo').onclick = function() {show("feedsContainer")};

document.getElementById('navSignOut').onclick = function() {
    localStorage.clear();
    document.getElementById('QuickpicLogo').onclick = '';
    document.getElementById("navbar").style.display = "none";
    clearCredentials();
    show("loginContainer");
};

document.getElementById('navUploadPost').onclick = function() {uploadPost()};

document.getElementById('btnSearch').onclick = function() {
    showProfile(document.getElementById('search').value, "");
    document.getElementById('search').value = '';
}

window.onscroll = infiniteScroll;
let isExecuted = false;

function infiniteScroll() {
    const height = Math.max(
        document.documentElement["clientHeight"],
        document.body["scrollHeight"],
        document.documentElement["scrollHeight"],
        document.body["offsetHeight"],
        document.documentElement["offsetHeight"]
    )
    if (window.scrollY > (height - 1000) && !isExecuted && document.getElementById("feedsContainer").style.display == 'block') {
        isExecuted = true;
        const num = localStorage.getItem('posts');
        const newStart = parseInt(num) + 10;

        loadFeed(num);
        localStorage.setItem("posts", newStart);
        setTimeout(() => {
            isExecuted = false;
        }, 1000);
    }
}

// Example usage of makeAPIRequest method.
api.makeAPIRequest('dummy/user')
    .then(r => console.log(r));