import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { errorMessage, fileToDataUrl, getProfileName, openPopUp, show } from './helpers.js';
import { showProfilePosts } from './post.js';
// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

export const showProfile = (username, id, ifSelf = false) => {
    let query = "";
    if (id !== "") {
        query += "id=" + id;
    } else if (username !== "") {
        query += "username=" + username;
    }
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/user?" + query, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + token,
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 404) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            
            data.json().then(data => {
                const card = document.createElement('div');
                card.id = "cardProfileContainer";
                
                const profileInfo = document.createElement('div');
                profileInfo.style.width = "400px";
                profileInfo.style.border = "1px solid #dee2e6"
                profileInfo.style.margin = "10px";
                profileInfo.style.padding = "10px";

                const profileUsername = document.createElement('div');
                profileUsername.innerText = "Username: " + data.username;
                profileInfo.appendChild(profileUsername);

                const profileName = document.createElement('div');
                profileName.innerText = "Name: " + data.name;
                
                profileInfo.appendChild(profileName);
                const profileEmail = document.createElement('div');
                profileEmail.innerText = "Email: " + data.email;
                profileInfo.appendChild(profileEmail);

                const profileFollowing = document.createElement('div');
                profileFollowing.className = "hoverText"; 
                profileFollowing.innerText = "Following: " + data.following.length;
                profileInfo.appendChild(profileFollowing);

                profileFollowing.onclick = function()  {
                    let following = document.createElement('div');
                    data.following.map(async (id) => {
                        const name = document.createElement('div');
                        name.innerText = await getProfileName(id);
                        following.appendChild(name);
                    });
                    openPopUp(following);
                };

                let profileFollowedNum = document.createElement('div');
                profileFollowedNum.id = "profileFollowedNum";
                profileFollowedNum.innerText = "Followers: " + data.followed_num;
                profileInfo.appendChild(profileFollowedNum);

                if (ifSelf) {
                    const updateProfileButton = document.createElement('button');
                    updateProfileButton.type = "button";
                    updateProfileButton.className = "updateProfileButton";
                    updateProfileButton.innerText = "Update";
                    updateProfileButton.onclick = function() {updateProfile()};
                    profileInfo.appendChild(updateProfileButton);
                } else {
                    const followButton = document.createElement('button');
                    followButton.type = "button";
                    followButton.className = "followButton";
                    followButton.innerText = "follow";
                    followButton.onclick = function() {followProfile(data.username)};
                    profileInfo.appendChild(followButton);

                    const unfollowButton = document.createElement('button');
                    unfollowButton.type = "button";
                    unfollowButton.className = "unfollowButton";
                    unfollowButton.innerText = "unfollow";
                    unfollowButton.onclick = function() {unfollowProfile(data.username)};
                    profileInfo.appendChild(unfollowButton);
                }

                card.appendChild(profileInfo);

                data.posts.map(post => {
                    showProfilePosts(card, post, ifSelf);
                });

                document.getElementById("profile").appendChild(card);
            })
            show("profileContainer");
        }
    })
}

export const followProfile = (username) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/user/follow?username=" + username, {
        method: 'PUT',
        headers: {
            'Authorization': 'Token ' + token,
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 404) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            const string = document.getElementById("profileFollowedNum").innerText;
            const newString = parseInt(string.split(' ')[1]) + 1;
            document.getElementById("profileFollowedNum").innerText = "Followers: " + newString;
        }
    })
}   

const unfollowProfile = (username) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/user/unfollow?username=" + username, {
        method: 'PUT',
        headers: {
            'Authorization': 'Token ' + token,
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 404) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            const string = document.getElementById("profileFollowedNum").innerText;
            const newString = parseInt(string.split(' ')[1]) - 1;
            document.getElementById("profileFollowedNum").innerText = "Followers: " + newString;
        }
    })
}  

const updateProfile = () => {

    const modal = document.getElementById('modal');
    
    const content = document.createElement('div');

    const emailInput = document.createElement('input');
    emailInput.id = 'emailInput';
    emailInput.type = 'text';
    emailInput.onfocus = "clearField(this, this.placeholder='');";
    emailInput.placeholder = "New Email"; 
    content.appendChild(emailInput);

    const nameInput = document.createElement('input');
    nameInput.id = 'nameInput';
    nameInput.type = 'text';
    nameInput.onfocus = "clearField(this, this.placeholder='');";
    nameInput.placeholder = "New name"; 
    content.appendChild(nameInput);

    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';
    passwordInput.type = 'text';
    passwordInput.onfocus = "clearField(this, this.placeholder='');";
    passwordInput.placeholder = "New password"; 
    content.appendChild(passwordInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.innerText = "Submit";
    submitButton.onclick = function() {updateClick()};
    content.appendChild(submitButton);

    openPopUp(content);
}

const updateClick = () => {
    let payload = {}
    if (document.getElementById('emailInput').value !== '') {
        const email = document.getElementById('emailInput').value;
        payload.email = email;
    }
    if (document.getElementById('nameInput').value !== '') {
        const name = document.getElementById('nameInput').value;
        payload.name = name;
    }
    if (document.getElementById('passwordInput').value !== '') {
        const password = document.getElementById('passwordInput').value;
        payload.password = password;
    }
    

    fetch('http://localhost:5000/user', {
        method: 'PUT',
        headers: {
            'Authorization': "Token " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(payload)
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 404) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 200) {
            document.getElementById("modal-content").remove();
            document.getElementById('modal').style.display = "none";
        }
    }).catch((error) => {
        console.log('Error', error);
    });
}