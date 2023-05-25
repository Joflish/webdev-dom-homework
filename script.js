"use strict";

let comments = []

const listComments = document.getElementById("comments-users");

const getComments = () => {
  document.getElementById("loader").style.display = "block";

  fetch("https://webdev-hw-api.vercel.app/api/v1/alexei-rybak/comments", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: false,
        };
      });

      comments = appComments;
      renderComments();
      document.getElementById("loader").style.display = "none";
    });
};

getComments();

const renderComments = () => {

  const commentsHTML = comments.map((comment, index) => {
    const formattedDate = formatDate(new Date(comment.date));
      return `<li data-index="${index}" class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
            <div>${formattedDate}</div>
          </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>`;
    }).join('');

  listComments.innerHTML = commentsHTML;
  counterLikes();
  answerComment();
};

renderComments();

function formatDate(date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function counterLikes() {
  const likesButtonElements = document.querySelectorAll('.like-button');

  likesButtonElements.forEach((likesButtonElement) => {
    likesButtonElement.addEventListener('click', (event) => {
      event.stopPropagation();
      const index = likesButtonElement.dataset.index;
      const comment = comments[index];         

      if (comment.isLiked) {
        comment.likes = comment.likes - 1;
      likesButtonElement.classList.remove('-active-like');
      } else {
        comment.likes = comment.likes + 1;
      likesButtonElement.classList.add('-active-like');
      }

      comment.isLiked = !comment.isLiked;
          
      renderComments();
    });
  })
};
  
function answerComment() {
  const oldComments = document.querySelectorAll(".comment");

  for (let oldComment of oldComments) {
    oldComment.addEventListener("click", (event) => {
      event.stopPropagation();
        
      const index = oldComment.dataset.index;
      const comment = comments[index];

      textInputElement.value = `QUOTE_BEGIN ${comment.text}\n${comment.name} QUOTE_END`;
    });
  }
}

const buttonElement = document.getElementById("button-add");
const listElement = document.getElementById("comments-users");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");

const addComment = () => {
  buttonElement.disabled = true;
  buttonElement.textContent = "Комментарий добавляется...";
  document.getElementById("name-input").disabled = false;
  document.getElementById("text-input").disabled = false;

  fetch("https://webdev-hw-api.vercel.app/api/v1/alexei-rybak/comments", {
  method: "POST",
  body: JSON.stringify({
    name: nameInputElement.value,
    text: textInputElement.value,
    forceError: true,
    }),
  })
  .then((response) => {
    if (response.status === 400) {
        throw new Error('Поля должны быть не короче 3-х символов');
    } else if (response.status === 500) {
      document.getElementById("name-input").disabled = true; // Скрываем для сохранения введенного имени
      document.getElementById("text-input").disabled = true; // Скрываем для сохранения введенного текста комментария
      throw new Error('Сервер сломался, попробуйте позже');
    } else {
      return response.json();
    }
  })
  .then(responseData => {
    comments = responseData.comments;
  })
  .then(() => {
    return getComments();
  })
  .then (() => {
    buttonElement.disabled = false;
    buttonElement.textContent = "Написать";
    nameInputElement.value = '';
    textInputElement.value = '';
  })
  .catch((error) => {
    console.log("Error message =", error.message)
    buttonElement.disabled = false;
    buttonElement.textContent = "Написать";
    addButtonElement.classList.remove("empty");

    if (nameInputElement.value.length < 3 || textInputElement.value.length < 3) {
      alert("Имя и комментарий должны быть не короче 3-х символов");
      document.getElementById("name-input").disabled = false;
      document.getElementById("text-input").disabled = false;
    } else {
      alert("Кажется, у вас сломался интернет, попробуйте позже");
    }
  })

  renderComments();

  addButtonElement.disabled = true;
  addButtonElement.classList.add("empty");
};

buttonElement.addEventListener("click", addComment);

const deleteComment = () => {
  comments.pop();
  renderComments();
}

textInputElement.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addComment();
    event.preventDefault();
  }
});
  
const buttonDeleteElement = document.getElementById("button-delete");
  
buttonDeleteElement.addEventListener("click", deleteComment);

const addButtonElement = document.getElementById("button-add");
  
addButtonElement.disabled = true;
addButtonElement.classList.add("empty"); 
nameInputElement.addEventListener("input", handleInput);
textInputElement.addEventListener("input", handleInput);

function handleInput() {
  if (nameInputElement.value.trim() !== "" && textInputElement.value.trim() !== "") {
    addButtonElement.disabled = false;
    addButtonElement.classList.remove("empty"); 
  } else {
    addButtonElement.disabled = true;
    addButtonElement.classList.add("empty");
  }
}