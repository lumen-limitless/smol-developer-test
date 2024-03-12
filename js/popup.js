```javascript
let comments = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveComment);
    document.getElementById('deleteButton').addEventListener('click', deleteComment);
    loadComments();
});

function saveComment() {
    let commentInput = document.getElementById('commentInput');
    let comment = {
        url: window.location.href,
        text: commentInput.value,
        timestamp: new Date().getTime()
    };
    comments.push(comment);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment saved');
    });
    commentInput.value = '';
    renderComments();
}

function deleteComment() {
    comments = comments.filter(comment => comment.url !== window.location.href);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment deleted');
    });
    renderComments();
}

function loadComments() {
    chrome.storage.sync.get(['comments'], function(result) {
        comments = result.comments || [];
        renderComments();
    });
}

function renderComments() {
    let commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    comments.filter(comment => comment.url === window.location.href)
        .forEach(comment => {
            let li = document.createElement('li');
            li.textContent = `${new Date(comment.timestamp).toLocaleString()}: ${comment.text}`;
            commentList.appendChild(li);
        });
}
```