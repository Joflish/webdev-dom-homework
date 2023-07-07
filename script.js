"use strict";

  const comments = [
    {
      name: 'Глеб Фокин',
      date: '12.02.22 12:18',
      text: 'Это будет первый комментарий на этой странице',
      likes: 2,
      isLiked: true,
      deleted: false,
      isEdit: false,
    },

    {
      name: 'Варвара Н.',
      date: '13.02.22 19:22',
      text: 'Мне нравится как оформлена эта страница! ❤',
      likes: 75,
      isLiked: false,
      deleted: false,
      isEdit: false, 
    },
  ];

  const listComments = document.getElementById("comments-users");
    // -------- Форматируем дату ------------------------------------------------

  const formatDate = (date) => {
    return [
      date.getDate().toString().padStart(2, '0'), ".",
      (date.getMonth() + 1).toString().padStart(2, '0'), ".",
      date.getFullYear().toString().substr(-2), " ",
      date.getHours().toString().padStart(2, '0'), ":",
      date.getMinutes().toString().padStart(2, '0')
      ].join('');
    }
// ---------- Рендеринг коментария --------------------------------------------
  const renderComments = () => {
    const commentsHTML = comments.map((comment, index) => {
        return `<li data-index="${index}" class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">${comment.text}</div>
          </div>
          <div class="comment-footer">
          <button data-edit="${index}" class="edit-button">Редактировать</button>
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
// ---------- Редактирование комментария --------------------------------------
      const editButtonElements = document.querySelectorAll('.edit-button');
      editButtonElements.forEach((editButtonElement) => { 
        editButtonElement.addEventListener('click', () => { 
          const index = editButtonElement.dataset.edit;
          
          if (editButtonElements[index].innerHTML === "Редактировать") {
              editButtonElements[index].innerHTML = "Сохранить";
              const commentBodyElements = document.querySelectorAll(".comment-text")
              const commentBodyElement = commentBodyElements[index];
              const textareaElement = `<textarea type="textarea" class="edit-comment" rows="4">${comments[index].text}</textarea>`;
              commentBodyElement.innerHTML = textareaElement;
          } else {
            const redactCommentElement = document.querySelectorAll(".edit-comment");
            comments[index].text = redactCommentElement[0].value;
            renderComments()
        }
      });
    });
    };
  renderComments();

// ---------- Ставим лайки ----------------------------------------------------
function counterLikes() {
    const likesButtonElements = document.querySelectorAll('.like-button');

    likesButtonElements.forEach((likesButtonElement) => {
        likesButtonElement.addEventListener('click', (event) => {
          event.stopPropagation();
          const index = likesButtonElement.dataset.index;
          const comment = comments[index];         

          if (comment.isLiked) {
            --comment.likes;
            likesButtonElement.classList.remove('-active-like');
          } else {
            ++comment.likes;
            likesButtonElement.classList.add('-active-like');
          }
          comment.isLiked = !comment.isLiked;
          renderComments();
        });
      })
  };
  
// ---------- Отвечаем на комментарий -----------------------------------------
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
  const addButtonElement = document.getElementById("button-add");

  // -------- Добавляем комментарий -------------------------------------------
  const addComment = () => {

    let shownDate = formatDate(new Date());

    comments.push({
      name: nameInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
      date: shownDate,
      text: textInputElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll('QUOTE_BEGIN', '<div class="quote">')
        .replaceAll('QUOTE_END', '</div>'),
      likes: 0,
      isLiked: false,
      isEdit: false,
    });

    renderComments();
// ---------- Очищаем поля ввода, деактивируем кнопку "Написать" --------------
  nameInputElement.value = '';
  textInputElement.value = '';
  addButtonElement.disabled = true;
  addButtonElement.classList.add("empty");

  };
  // --------- Реагируем на клик и на кнопку Enter -----------------------------
  buttonElement.addEventListener("click", () => {
    addComment();
  })

  textInputElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addComment();
      event.preventDefault();
    }
  });
  
// ---------- Деактивируем кнопку, пока поля ввода пустые ---------------------
addButtonElement.disabled = true;
addButtonElement.classList.add("empty"); // empty - класс, который делает кнопку серой, пока хотя бы одно поле пустое
nameInputElement.addEventListener("input", handleInput);
textInputElement.addEventListener("input", handleInput);

function handleInput() {
  if (nameInputElement.value.trim() !== "" && textInputElement.value.trim()!== "") { /* Заодно проверим, чтобы не вводились одни пробелы*/
    addButtonElement.disabled = false;
    addButtonElement.classList.remove("empty"); 
  } else {
    addButtonElement.disabled = true;
    addButtonElement.classList.add("empty");
  }
}

// ---------- Удаляем последний комментарий -----------------------------------
const deleteComment = () => {
    comments.pop();
    renderComments();
  }
const buttonDeleteElement = document.getElementById("button-delete");
buttonDeleteElement.addEventListener("click", deleteComment);
