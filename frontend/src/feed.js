import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { createPost, errorMessage, fileToDataUrl, getDateTime, getProfileName, openPopUp, show } from './helpers.js';
import { likePost, postComment } from './post.js';
import { showProfile } from './user.js';
// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

export const loadFeed = (p=0) => {
    const query = 'p=' + p;
    fetch("http://localhost:5000/user/feed?" + query, {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + localStorage.getItem("token"),
        'Accept': 'applicaton/json',
        'Content-Type': 'application/json',
    }
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            data.json().then((data) => {
                const posts = data['posts'];

                posts.map(post => {
                    const card = document.createElement('div');
                    card.className = "cardFeedContainer border ";
                    card.style.width = "379px";
                    card.style.borderColor = "#dee2e6";

                    const authorElement = document.createElement('H5');
                    authorElement.className = "hoverText"; 
                    authorElement.innerText = post.meta.author;
                    authorElement.onclick = function() {showProfile(post.meta.author, "")};
                    card.appendChild(authorElement);

                    createPost(card, "feedsContainer", post);

                    document.getElementById("feeds").appendChild(card);
                })
            });
        }
        
    })
}
