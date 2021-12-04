import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { createPost, errorMessage, fileToDataUrl, getDateTime, getProfileName, openPopUp } from './helpers.js';
// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

export const likePost = (id) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/post/like?id=" + id, {
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
            console.log("success");
        }
    })
}

export function showProfilePosts(container, id, ifSelf) {
    const token = localStorage.getItem("token");
    const query = "id=" + id;
    fetch("http://localhost:5000/post?" + query, {
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
                card.id = "postCard" + id;
                card.style.width = "400px";
                card.style.border = "1px solid #dee2e6"
                card.style.margin = "10px";
                card.style.padding = "10px";

                createPost(card, "profileContainer", data);

                if (ifSelf) {
                    const deletePostButton = document.createElement('button');
                    deletePostButton.type = "button";
                    deletePostButton.className = "deletePostButton";
                    deletePostButton.innerText = "Delete";
                    deletePostButton.onclick = function() {deletePost(data.id)};
                    card.appendChild(deletePostButton);

                    const updatePostButton = document.createElement('button');
                    updatePostButton.type = "button";
                    updatePostButton.className = "updatePostButton";
                    updatePostButton.innerText = "Update";
                    updatePostButton.onclick = function() {updatePost(data.id)};
                    card.appendChild(updatePostButton);
                }

                container.appendChild(card);
            })
        }
    })
}

export const postComment = (id) => {
    const commentInputID = 'commentInput' + id;
    const payload = {
        "comment": document.getElementById(commentInputID).value,
    }

    fetch("http://localhost:5000/post/comment?id=" + id, {
        method: 'PUT',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem("token"),
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
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
            console.log("success");
        }
    })

}

const updatePost = (id) => {
    const modal = document.getElementById('modal');
    
    const content = document.createElement('div');

    const descInput = document.createElement('input'); //GANTI KE TEXXTAREA
    descInput.id = 'descInput';
    descInput.type = 'text';
    descInput.onfocus = "clearField(this, this.placeholder='');";
    descInput.placeholder = "Description"; 
    content.appendChild(descInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.innerText = "Submit";
    submitButton.onclick = function() {updateClick(id)};
    content.appendChild(submitButton);

    openPopUp(content);
}

const updateClick = (id) => {
    const desc = document.getElementById('descInput').value;
    const updateBody = {
        "description_text": desc
    }

    fetch('http://localhost:5000/post?id=' + id, {
        method: 'PUT',
        headers: {
            'Authorization': "Token " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(updateBody)
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

const deletePost = (id) => {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': "Token " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
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
            data.json().then(result => {
                document.getElementById('postCard' + id).remove();
                localStorage.setItem("recentDelete", id);
            })
        }
    }).catch((error) => {
        console.log('Error', error);
    });
}

export const uploadPost = () => {
    const modal = document.getElementById('modal');
    
    const content = document.createElement('div');

    const fileInput = document.createElement('input');
    fileInput.id = 'fileInput';
    fileInput.type = 'file';
    //fileInput.onchange;
    content.appendChild(fileInput);

    const descInput = document.createElement('input'); //GANTI KE TEXXTAREA
    descInput.id = 'descInput';
    descInput.type = 'text';
    descInput.onfocus = "clearField(this, this.placeholder='');";
    descInput.placeholder = "Description"; 
    content.appendChild(descInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.innerText = "Submit";
    submitButton.onclick = function() {uploadClick()};
    content.appendChild(submitButton);

    openPopUp(content);
}

async function uploadClick() {
    const file = document.getElementById('fileInput').files;
    let dataUrl = '';
    try {
        dataUrl = await fileToDataUrl(file[0]);
    }
    catch (err) {
        console.log(err);
    }
    const res = dataUrl.split(',')[1];
    const desc = document.getElementById('descInput').value;
    const uploadBody = {
        "description_text": desc,
        "src": res
    }
    
    const result = fetch('http://localhost:5000/post', {
        method: 'POST',
        headers: {
            'Authorization': "Token " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(uploadBody)
    }).then((data) => {
        if (data.status === 403) {
            data.json().then(result => {
                errorMessage(result.message);
            });
        } else if (data.status === 400) {
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