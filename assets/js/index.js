const contents = document.querySelector(".contents");
const submitButton = document.querySelector(".submitButton");
const textarea = document.querySelector(".textarea");
const cancelBtn = document.querySelector(".cancelBtn");
const popup = document.querySelector(".pop-up");
const deleteBtn = document.querySelector(".deleteBtn");

cancelBtn.addEventListener("click", () => (popup.style = "display: none"));

let response;
const getData = async () => (response = await fetch("assets/json/data.json").then((x) => x.json()));

function changeScore(type, commentId, commentType) {
  if (commentType == "comment") {
    type == "positive" ? response.comments[response.comments.findIndex((x) => x.id == commentId)].score++ : response.comments[response.comments.findIndex((x) => x.id == commentId)].score--;
  } else {
    commentId = commentId.replaceAll("`", '"');
    const commentData = JSON.parse(commentId);
    type == "positive" ? response.comments[response.comments.findIndex((x) => x.id == commentData.commentId)].replies[response.comments[response.comments.findIndex((x) => x.id == commentData.commentId)].replies.findIndex((x) => x.id == commentData.replyId)].score++ : response.comments[response.comments.findIndex((x) => x.id == commentData.commentId)].replies[response.comments[response.comments.findIndex((x) => x.id == commentData.commentId)].replies.findIndex((x) => x.id == commentData.replyId)].score--;
  }
  run();
}

function deleteButtonHandle() {
  popup.style = "display: flex";
  const commentType = this.getAttribute("data-comment-type");
  if (commentType === "comment") {
    const commentId = this.getAttribute("data-id");
    deleteBtn.onclick = () => {
      response.comments.splice(
        response.comments.findIndex((x) => x.id == commentId),
        1
      );
      run();
      popup.style = "display: none";
    };
  } else if (commentType === "reply") {
    const { commentId, replyId } = JSON.parse(this.getAttribute("data-id"));
    deleteBtn.onclick = () => {
      response.comments
        .find((x) => x.id == commentId)
        .replies.splice(
          response.comments
            .find((x) => x.id == commentId)
            .replies.map((x) => x.id)
            .indexOf(replyId),
          1
        );
      run();
      popup.style = "display: none";
    };
  }
}

function addComment(e) {
  e.preventDefault();
  if (textarea.value.trim() != "") {
    const { username, image } = response.currentUser;
    const postJson = {
      id: response.comments.length + 1,
      content: textarea.value,
      createdAt: "Now",
      score: 0,
      user: {
        image: {
          png: image.png,
          webp: image.webp,
        },
        username: username,
      },
      replies: [],
    };
    response.comments.push(postJson);
    textarea.value = "";
    run();
  }
}

submitButton.addEventListener("click", addComment);

function editButtonHandle() {
  const commentType = this.getAttribute("data-comment-type");
  if (commentType === "comment") {
    const commentId = this.getAttribute("data-id");
    const thisDiv = this.parentElement.parentElement;
    let { content } = response.comments.find((x) => x.id == commentId);
    thisDiv.querySelector(".card-content .user-comment").remove();
    thisDiv.querySelector(".card-content").innerHTML += `<textarea placeholder="Add a comment…" class="textarea">${content}</textarea>`;
    thisDiv.querySelector(".card-content").innerHTML += `<button class="submitButton">Update</button>`;
    thisDiv.querySelector(".card-content button").addEventListener("click", () => {
      content = thisDiv.querySelector(".card-content .textarea").value;
      thisDiv.querySelector(".card-content .textarea").remove();
      thisDiv.querySelector(".card-content .submitButton").remove();
      thisDiv.querySelector(".card-content").innerHTML += `<p class="user-comment">${content}</p>`;
      response.comments.find((x) => x.id == commentId).content = content;
    });
  } else if (commentType === "reply") {
    const { commentId, replyId } = JSON.parse(this.getAttribute("data-id"));
    const thisDiv = this.parentElement.parentElement;
    let { content } = response.comments.find((x) => x.id == commentId).replies.find((x) => x.id == replyId);
    thisDiv.querySelector(".card-content .user-comment").remove();
    thisDiv.querySelector(".card-content").innerHTML += `<textarea placeholder="Add a comment…" class="textarea">${content}</textarea>`;
    thisDiv.querySelector(".card-content").innerHTML += `<button class="submitButton">Update</button>`;
    thisDiv.querySelector(".card-content button").addEventListener("click", () => {
      content = thisDiv.querySelector(".card-content .textarea").value;
      thisDiv.querySelector(".card-content .textarea").remove();
      thisDiv.querySelector(".card-content .submitButton").remove();
      thisDiv.querySelector(".card-content").innerHTML += `<p class="user-comment">${content}</p>`;
      response.comments.find((x) => x.id == commentId).replies.find((x) => x.id == replyId).content = content;
    });
  }
}

function replyButtonHandle() {
  const commentType = this.getAttribute("data-comment-type");
  document.querySelector(".add-comment.reply") != null ? document.querySelector(".add-comment.reply").remove() : true;
  document.querySelector(".add-comment.replyToReply") != null ? document.querySelector(".add-comment.replyToReply").parentElement.remove() : true;
  const thisDiv = this.parentElement.parentElement.parentElement;

  if (commentType === "comment") {
    thisDiv.insertAdjacentHTML(
      "afterend",
      `
      <div class="add-comment reply">
        <textarea placeholder="Add a comment…" class="commentReplyText textarea"></textarea>
        <a href="#"><img src="./assets/img/avatar4.png" /></a>
        <button data-id="${this.getAttribute("data-id")}" class="commentReplyBtn submitButton">Send</button>
      </div>
      `
    );
  } else if (commentType === "reply") {
    const { commentId, replyId } = JSON.parse(this.getAttribute("data-id"));
    thisDiv.insertAdjacentHTML(
      "afterend",
      `
      <div class="reply-card">
        <div class="add-comment replyToReply">
          <textarea placeholder="Add a comment…" class="replyToReplyText textarea"></textarea>
          <a href="#"><img src="./assets/img/avatar4.png" /></a>
          <button data-id='{"commentId": ${commentId}, "replyId": ${replyId}}' class="replyToReplyBtn submitButton">Send</button>
        </div>
      </div>
      `
    );
  }

  const commentReplyBtns = document.querySelectorAll(".commentReplyBtn");
  commentReplyBtns.forEach((commentReplyBtn) => {
    commentReplyBtn.addEventListener("click", () => {
      const commentReplyText = document.querySelector(".commentReplyText").value;
      const commentId = this.getAttribute("data-id");
      const replyTo = response.comments.find((x) => x.id == commentId).user.username;

      const postJson = {
        id: response.comments.find((x) => x.id == commentId).replies.length + 1,
        content: `@${replyTo} ` + commentReplyText,
        createdAt: "Now",
        score: 0,
        replyingTo: replyTo,
        user: {
          image: {
            png: response.currentUser.image.png,
            webp: response.currentUser.image.webp,
          },
          username: response.currentUser.username,
        },
      };
      response.comments.find((x) => x.id == commentId).replies.push(postJson);
      run();
    });
  });

  const replyToReplyBtns = document.querySelectorAll(".replyToReplyBtn");
  replyToReplyBtns.forEach((replyToReplyBtn) => {
    replyToReplyBtn.addEventListener("click", () => {
      const commentReplyText = document.querySelector(".replyToReplyText").value;
      const { commentId, replyId } = JSON.parse(this.getAttribute("data-id"));
      const replyTo = response.comments.find((x) => x.id == commentId).replies.find((x) => x.id == replyId).user.username;
      const postJson = {
        id: response.comments.find((x) => x.id == commentId).replies.length + 1,
        content: `@${replyTo} ` + commentReplyText,
        createdAt: "Now",
        score: 0,
        replyingTo: replyTo,
        user: {
          image: {
            png: response.currentUser.image.png,
            webp: response.currentUser.image.webp,
          },
          username: response.currentUser.username,
        },
      };
      response.comments.find((x) => x.id == commentId).replies.push(postJson);
      run();
    });
  });
}

function run() {
  contents.innerHTML = "";
  response["comments"].map((comment) => {
    contents.innerHTML += `
        <div class="comment">
          <div class="comment-card">
            <div class="card-content">
              <div class="card-top-contents">
                <a href="#"><img class="user-img" src="${comment.user.image.png}" /></a>
                <a href="#"><span class="username ${comment.user.username === response.currentUser.username ? "youTag" : ""}">${comment.user.username}</span></a>
                <span class="comment-time">${comment.createdAt}</span>
              </div>
            <p class="user-comment">${comment.content}</p>            
            </div>
            <div class="card-bottom-contents">
              <div class="card-buttons">
                <button class="button-positive" onclick="changeScore('positive', '${comment.id}', 'comment')">
                  <i class="fa-solid fa-plus"></i>
                </button>
                <span class="reaction-count">${comment.score}</span>
                <button class="button-negative" onclick="changeScore('negative', '${comment.id}', 'comment')">
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
              <div class="comment-interaction">
                ${comment.user.username === response.currentUser.username ? `<button class="delete-button" data-id="${comment.id}" data-comment-type="comment">Delete</button><button class="edit-button" data-id="${comment.id}" data-comment-type="comment">Edit</button>` : `<button class="reply-button" data-id="${comment.id}" data-comment-type="comment">Reply</button>`}
              </div>
          </div>
        </div>
    `;

    if (comment["replies"].length != 0) {
      comment["replies"].map((reply) => {
        contents.innerHTML += `
        <div class="reply-card">
          <div class="comment-card">
            <div class="card-content">
              <div class="card-top-contents">
                <a href="#"><img class="user-img" src="${reply.user.image.png}" /></a>
                <a href=""><span class="username ${reply.user.username === response.currentUser.username ? "youTag" : ""}">${reply.user.username}</span></a>
                <span class="comment-time">${reply.createdAt}</span>
              </div>
              <p class="user-comment">${reply.content}</p>
            </div>
            <div class="card-bottom-contents">
              <div class="card-buttons">
                <button class="button-positive" onclick="changeScore('positive', '{\`commentId\`: ${comment.id}, \`replyId\`: ${reply.id}}', 'reply')">
                  <i class="fa-solid fa-plus"></i>
                </button>
                <span class="reaction-count">${reply.score}</span>
                <button class="button-negative" onclick="changeScore('negative', '{\`commentId\`: ${comment.id}, \`replyId\`: ${reply.id}}', 'reply')">
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
              <div class="comment-interaction">
                ${reply.user.username === response.currentUser.username ? `<button class="delete-button" data-id='{"commentId": ${comment.id}, "replyId": ${reply.id}}' data-comment-type="reply">Delete</button><button class="edit-button" data-id='{"commentId": ${comment.id}, "replyId": ${reply.id}}' data-comment-type="reply">Edit</button>` : `<button class="reply-button" data-id='{"commentId": ${comment.id}, "replyId": ${reply.id}}' data-comment-type="reply">Reply</button>`}
              </div>
          </div>
        </div>
    `;
      });
    }
  });

  const replyButtons = document.querySelectorAll(".reply-button");
  replyButtons.forEach((replyButton) => {
    replyButton.addEventListener("click", replyButtonHandle);
  });

  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", editButtonHandle);
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteButtonHandle);
  });
}

getData().then(() => run());
