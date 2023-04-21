import { getCommentsList, fetchPostApi } from "./api.js";
import {getDate, safety, delay, back} from "./data.js"
import { renderLoginComponent} from "./authorization.js";
//import {getListComments} from "./listComments.js";
 let token = null;
 let comments = [];
 let name;

const fetchGetAndRender = () => {
  return getCommentsList({token})
    .then((responseData) => {
      comments = responseData.comments;
      renderComments();
    })
};

//Рендерим comments
export const renderComments = () => {
 const appEl = document.getElementById("app"); 

    if (!token) {
      renderLoginComponent({
        comments,
        appEl,
        setToken: (newToken) => {
          token = newToken;
        },
        setName: (newName) => {
          name = newName; 
        },
        renderComments,
      });
      return;
    }
  
  const commentsHtml =
  comments.map((user, index) => {
    return `<li class="comment" data-index ='${index}'>
    <div class="comment-header">
     <div>${user.author.name}</div>
     <div>${getDate(user.date)}</div>
   </div>
   <div class="comment-body" data-comments="${index}" >
     <div class ="comment-text"> ${user.text} </div>
   </div>
   <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${user.likes}</span>
        <button  data-index="${index}" class="like-button ${user.isLiked}"></button>
      </div>
   </div>
   </li>`
  }).join("");

  const appHtml = `
            <div class="container">
              <p id="start-comment"></p>
              <ul id="list" class="comments">
                ${commentsHtml}
              </ul>
              <p id="added-comment"></p>
              <div id="add" class="add-form">
              <input value = "${name}" id="name-input" type="text" class="add-form-name" placeholder="Введите ваше имя" />
              <textarea id="comment-textarea" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"
              rows="4"></textarea>
              <div class="add-form-row">
              <button id="add-button" class="add-form-button">Написать</button>
              </div>
            </div>
          </div>`;

  appEl.innerHTML = appHtml;

  const buttonElement = document.getElementById("add-button");
  // const listElement = document.getElementById("list");
  const nameInputElement = document.getElementById("name-input");
  const commentTextAreaElement = document.getElementById("comment-textarea");
  const addedCommentElement = document.getElementById("added-comment");
  const InputFormElement = document.getElementById("add");

  buttonElement.addEventListener("click", () => {
    //Когда нажимаем "Написать" исчезает поле ввода и появляется строчка:"Комментарий добавляется..." 
    addedCommentElement.style.display = "flex";
    addedCommentElement.textContent = "Комментарий добавляется...";
    InputFormElement.style.display = "none";
    nameInputElement.classList.remove("error");
    commentTextAreaElement.classList.remove("error");

    fetchPostApi({
      name: safety(nameInputElement.value),
      text: safety(commentTextAreaElement.value),
      date: new Date(),
      forceError: true,
      token,
    })
      .then(() => {
        return fetchGetAndRender();
      })
      .then(() => {
        nameInputElement.value = ""; //очищает форму input после добавления комментария
        commentTextAreaElement.value = "";  //очищает форму textarea после добавления комментария 
      })
      .catch((error) => {
        if (error.message === "Имя и комментарий должны быть не короче 3 символов") {
          alert(error.message);
        }
        else if (error.message === "Нет авторизации") {
          alert(error.message);
        }
        else if (error.message === 'Упал сервер') {
          buttonElement.click(); // клик на ввод
        } 
        else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
        // Отправлять в систему сбора ошибок
        console.warn(error);
        addedCommentElement.style.display = "none";
        InputFormElement.style.display = "flex"; 
      });

    renderComments();
  });
    
   //Расширенная валидация. Сделайте так, чтобы кнопка «Написать» выключалась 
   //(становится некликабельной, красится в серый цвет), если имя или текст в 
   //форме незаполненные.
   function checkParams() {
    if (nameInputElement.value.trim() != 0 && commentTextAreaElement.value.trim() != 0) {
      buttonElement.style.backgroundColor = "#bcec30";
      buttonElement.disabled = false;
    } else {
      buttonElement.style.backgroundColor = "gray";
      buttonElement.disabled = true;
    }
  }

   // Добавление элемента в список по нажатию Enter 
  document.addEventListener("keyup",(event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      buttonElement.click();
    } 
    checkParams();
  });

  //«Оживляем» кнопку и счетчик лайков у каждого комментария.
  function likeButton() {
     //Находит все элементы с классом like-button в разметке
    const likeElements = document.querySelectorAll('.like-button');
    //Цикл for проходит по каждому элементу в списке
    for (const likeElement of likeElements) {
      //Добавляет обработчик клика на конкретный элемент в списке
      likeElement.addEventListener('click', ( event) => {
        event.stopPropagation(); //останавливает всплытие события вверх по дереву
        likeElement.classList.add('-loading-like')
        delay(2000).then(()=> {
          if (!comments[likeElement.dataset.index].isLiked) {
            comments[likeElement.dataset.index].isLiked = "";
            comments[likeElement.dataset.index].likes ++;
          } else {
            comments[likeElement.dataset.index].isLiked = '-loading-like';
            comments[likeElement.dataset.index].likes -= 1;
          }
            likeElement.classList.remove("-loading-like");
            
            renderComments();
        })
      });
    }
  }
  
  // «Ответ на комментарий»
  function answer() {
   const commentElements = document.querySelectorAll('.comment');
   for (const commentElement of commentElements) {
     commentElement.addEventListener("click", () => {
     commentTextAreaElement.value =` ${back(comments[commentElement.dataset.index].text)} \n\n ${back(comments[commentElement.dataset.index].author.name)}, `;
     });
    }
  };
  answer();
  likeButton();
};

renderComments();
fetchGetAndRender();