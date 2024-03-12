```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
        case 'SAVE_COMMENT':
            saveComment(request.comment);
            break;
        case 'DELETE_COMMENT':
            deleteComment(request.comment);
            break;
        case 'LOAD_COMMENTS':
            loadComments(request.url);
            break;
    }
});

function saveComment(comment) {
    comments.push(comment);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment saved');
    });
}

function deleteComment(comment) {
    comments = comments.filter(c => c !== comment);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment deleted');
    });
}

function loadComments(url) {
    chrome.storage.sync.get(['comments'], function(result) {
        comments = result.comments.filter(c => c.url === url);
        chrome.runtime.sendMessage({type: 'LOAD_COMMENTS', comments: comments});
    });
}
```