const contents = document.querySelector(".contents");

async function run() {
  const response = await fetch("assets/json/data.json").then((x) => x.json());

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
                <button class="button-positive">
                  <i class="fa-solid fa-plus"></i>
                </button>
                <span class="reaction-count">${comment.score}</span>
                <button class="button-negative">
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
              <div class="comment-interaction">
                ${comment.user.username === response.currentUser.username ? '<button class="delete-button">Delete</button><button class="edit-button">Edit</button>' : '<button class="reply-button">Reply</button>'}
              </div>
          </div>
        </div>
    `;

    if (comment["replies"].length != 0) {
      comment["replies"].map((replie) => {
        contents.innerHTML += `
        <div class="reply-card">
          <div class="comment-card">
            <div class="card-content">
              <div class="card-top-contents">
                <a href="#"><img class="user-img" src="${replie.user.image.png}" /></a>
                <a href=""><span class="username ${replie.user.username === response.currentUser.username ? "youTag" : ""}">${replie.user.username}</span></a>
                <span class="comment-time">${replie.createdAt}</span>
              </div>
              <p class="user-comment">${replie.content}</p>
            </div>
            <div class="card-bottom-contents">
              <div class="card-buttons">
                <button class="button-positive">
                  <i class="fa-solid fa-plus"></i>
                </button>
                <span class="reaction-count">${replie.score}</span>
                <button class="button-negative">
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
              <div class="comment-interaction">
                ${replie.user.username === response.currentUser.username ? '<button class="delete-button">Delete</button><button class="edit-button">Edit</button>' : '<button class="reply-button">Reply</button>'}
              </div>
          </div>
        </div>
    `;
      });
    }
  });
}

run();
