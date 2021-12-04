import { loadFeed } from "./feed.js";
import { likePost, postComment } from "./post.js";
import { followProfile } from "./user.js";

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export const show = (container) => {
    const arr = ["login", "register", "feeds", "profile"];
    arr.map(tab => document.getElementById(`${tab}Container`).style.display = 'none');
    if (container === "feedsContainer") {
        let paras = document.getElementsByClassName('cardFeedContainer');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        localStorage.setItem("posts", 0);
        loadFeed(0);
    }

    if (document.getElementById("cardProfileContainer")) {
        document.getElementById("cardProfileContainer").remove();
    }

    localStorage.setItem("currContainer", container);

    document.getElementById(container).style.display = "block";
    
}

export const openPopUp = (content) => {
     let contentExists = document.getElementById('modal-content');
    if (contentExists) {
        document.getElementById('modal-content').remove();
    }

    content.id = 'modal-content';

    document.getElementById('modal-body').appendChild(content);

    document.getElementById("closeButton").onclick = function() {
        document.getElementById("modal-content").remove();
        document.getElementById("modal").style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            document.getElementById("modal-content").remove();
            document.getElementById("modal").style.display = "none";
        }
    }
    
    document.getElementById("modal").style.display = "block";
}

export const errorMessage = (msg) => {
    const msgContainer = document.createElement("div");

    const msgP = document.createElement("P");
    msgP.innerText = msg;
    msgP.id = "popUpErrorMsg";
    msgContainer.appendChild(msgP);

    openPopUp(msgContainer);

}

export const clearCredentials = () => {
    let elements = document.getElementsByTagName("input");
    for (let index=0; index < elements.length; index++) {
        elements[index].value = "";
    }
}

export function getProfileName(id) {
    let query = "";
    if (id !== "") {
        query += "id=" + id;
    } else if (username !== "") {
        query += "username=" + username;
    }
    const token = localStorage.getItem("token");
    return fetch("http://localhost:5000/user?" + query, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + token,
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        return data.json().then(data => {
            return data.name;
        })
    }).catch((err) => {
        console.log(err);
    }) 
}

export const getDateTime = (x) => {
    let date = new Date(x * 1000).toLocaleDateString("en-US");
    let time = new Date(x * 1000).toLocaleTimeString("en-US");
    const output = date + "  " + time;
    return output;
}

function liveUpdate(card, currContainer, startLikesLength, startCommmentLength, id) {
    let oldLikesLength = startLikesLength;
    let oldCommentLength = startCommmentLength;
    let interval = setInterval(function() {
        if (currContainer === localStorage.getItem("currContainer") && localStorage.getItem("token") && id !== localStorage.getItem("recentDelete")) {
            if (checkVisible(card)) {
                fetch("http://localhost:5000/post?id=" + id, {
                    method: 'GET',
                    headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token"),
                    'Accept': 'applicaton/json',
                    'Content-Type': 'application/json',
                    }
                }).then((data) => {
                    if (data.status === 200) {
                        data.json().then((data) => {
                            if (oldLikesLength !== data.meta.likes.length) {
                                document.getElementById('likesElement' + data.id).innerText = "Likes: " + data.meta.likes.length;
                                if (document.getElementById('names' + id)) {
                                    document.getElementById('names' + id).remove();
                                }
                                
                                let names = document.createElement('div');
                                names.id = 'names' + data.id;
                                data.meta.likes.map(async (id) => {
                                    const name = document.createElement('div');
                                    name.innerText = await getProfileName(id);
                                    names.appendChild(name);
                                });
    
                                document.getElementById('likesElement' + data.id).onclick = function()  {
                                    openPopUp(names);
                                };
                                oldLikesLength = data.meta.likes.length;
                            }
    
                            if (oldCommentLength !== data.comments.length) {
                                document.getElementById('commentsElement' + data.id).innerText = "Comments: " + data.comments.length;
                                if (document.getElementById('comments' + id)) {
                                    document.getElementById('comments' + id).remove();
                                }
    
                                let comments = document.createElement('div');
                                comments.id = 'comments' + data.id;
                                data.comments.map(data => {
                                    const comment = document.createElement('div');
                                    comment.innerText = data.author + ": " + data.comment + "\n" + getDateTime(data.published);
                                    comments.appendChild(comment);
                                })
                                
                                document.getElementById('commentsElement' + data.id).onclick = function () {
                                    openPopUp(comments);
                                }
                                oldCommentLength = data.comments.length;
                            }
                        })
                    } else clearInterval(interval);
                })
            }
        } else {
            clearInterval(interval);
        }
    }, 2000);
}

function checkVisible(container) {
    let rect = container.getBoundingClientRect();
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export const createPost = (card, container, data) => {
    const imageDiv = document.createElement('div');
    imageDiv.style.marginBottom = "10px";
    imageDiv.style.marginTop = "10px";
    const imageElement = document.createElement('img');
    imageElement.alt = data.meta.author + "'s Post";
    imageElement.style.width = "100%";
    imageElement.style.maxWidth = "379px";
    imageElement.setAttribute('src', `data:image/jpeg;base64,${data.src}`);
    imageDiv.appendChild(imageElement);
    card.appendChild(imageDiv);

    const likeButton = document.createElement('button');
    likeButton.type = "button";
    likeButton.className = "likeButton";
    likeButton.innerText = "Like";
    likeButton.onclick = function() {likePost(data.id)};
    card.appendChild(likeButton);

    let likesElement = document.createElement('div');
    likesElement.id = "likesElement" + data.id;
    likesElement.className = "hoverText";
    likesElement.innerText = "Likes: " + data.meta.likes.length;
    card.appendChild(likesElement);
    
    let names = document.createElement('div');
    names.id = 'names' + data.id;
    data.meta.likes.map(async (id) => {
        const name = document.createElement('div');
        name.innerText = await getProfileName(id);
        names.appendChild(name);
    });

    likesElement.onclick = function()  {
        openPopUp(names);
    };

    const descElement = document.createElement('div');
    descElement.innerText = "Description: " + data.meta.description_text;
    card.appendChild(descElement);

    let commentsElement = document.createElement('div');
    commentsElement.id = 'commentsElement' + data.id;
    commentsElement.className = "hoverText"; 
    commentsElement.innerText = "Comments: " + data.comments.length;
    card.appendChild(commentsElement);

    let comments = document.createElement('div');
    comments.id = 'comments' + data.id;
    data.comments.map(data => {
        const comment = document.createElement('div');
        comment.innerText = data.author + ": " + data.comment + "\n" + getDateTime(data.published);
        comments.appendChild(comment);
    })

    commentsElement.onclick = function () {
        openPopUp(comments);
    }

    let commentInput = document.createElement('input');
    commentInput.id = 'commentInput' + data.id;
    commentInput.type = 'text';
    commentInput.onfocus = "clearField(this, this.placeholder='');";
    commentInput.placeholder = "Add a comment"; 
    card.appendChild(commentInput);

    const submitCommentButton = document.createElement('button');
    submitCommentButton.type = 'button';
    submitCommentButton.innerText = "Post";
    submitCommentButton.onclick = function() {
        postComment(data.id);
        commentInput.value = "";
    };
    card.appendChild(submitCommentButton);

    const dateElement = document.createElement('div');
    dateElement.innerText = "Published: " + getDateTime(data.meta.published);
    card.appendChild(dateElement);
    
    liveUpdate(card, container, data.meta.likes.length, data.comments.length, data.id);
}