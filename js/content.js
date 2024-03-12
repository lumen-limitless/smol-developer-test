```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'LOAD_COMMENTS') {
        loadComments(request.url);
    }
});

function loadComments(url) {
    chrome.storage.sync.get(url, (result) => {
        if (result[url]) {
            comments = result[url];
            chrome.runtime.sendMessage({message: 'COMMENTS_LOADED', comments: comments});
        } else {
            comments = [];
            chrome.runtime.sendMessage({message: 'COMMENTS_LOADED', comments: comments});
        }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'SAVE_COMMENT') {
        saveComment(request.url, request.comment);
    }
});

function saveComment(url, comment) {
    comments.push(comment);
    let saveObj = {};
    saveObj[url] = comments;
    chrome.storage.sync.set(saveObj, () => {
        chrome.runtime.sendMessage({message: 'COMMENT_SAVED'});
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'DELETE_COMMENT') {
        deleteComment(request.url, request.commentId);
    }
});

function deleteComment(url, commentId) {
    comments = comments.filter((comment, index) => index !== commentId);
    let saveObj = {};
    saveObj[url] = comments;
    chrome.storage.sync.set(saveObj, () => {
        chrome.runtime.sendMessage({message: 'COMMENT_DELETED'});
    });
}
```