/*import { getListComments } from "./listComments.js";
import { renderComments } from "./render.js";
import { fetchGetApi, fetchPostApi } from "./api.js";*/

const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const commentTextAreaElement = document.getElementById("comment-textarea");


const addedCommentElement = document.getElementById("added-comment");
const InputFormElement = document.getElementById("add");

const host = "https://webdev-hw-api.vercel.app/api/v2/lanaSamoylova/comments";

const token = "Bearer bgc0b8awbwas6g5g5k5o5s5w606g37w3cc3bo3b83k39s3co3c83c03ck";

function fetchPromise() {
   return fetch(host,{
    method:"GET",
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    const startCommentElement = document.getElementById("start-comment");
    startCommentElement.textContent = "Пожалуйста подождите, комментарий загружается..."; //Когда загружаются, приходят данные из API появляется строчка: "Пожалуйста подождите, комментарий загружается..."
    return response.json();
  })
  .then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      };
      return {
        name:comment.author.name,
        date: new Date(comment.date).toLocaleString("ru-RU", options),
        comment: comment.text, 
        likeCounter: comment.likes,
        likeButton: false,
        token,
      }
    });
    comments = appComments;
    renderComments(listElement);
    startCommentElement.style.display = "none";
  });
}

let comments = [];

//Рендерим comments
const renderComments = () => {
  
  const commentsHtml = comments
  .map((comment, index) => {
    return `<li class="comment" data-index ='${index}' >
      <div class="comment-header">
         <div>${comment.name}</div>
         <div>${comment.date}</div>
         </div>
         <div class="comment-body">
           <div class="comment-text">${comment.comment}</div>
         </div>
         <div class="comment-footer">
           <div class="likes">
           <span class="likes-counter">${comment.likeCounter}</span>
           <button data-index ='${index}'class="like-button ${comment.likeButton}"></button>
         </div>
      </div>
     </li>`
  })
  .join("");
  
  const appEl = document.getElementById("app");
  

  const appHtml = `
   <div class="container">
     <p id="start-comment"></p>
     <ul id="list" class="comments">
       ${commentsHtml}
     </ul>
     <div class="add-form">
        <div>Форма входа</div>
        <input id="login-input" type="text" class="add-form-text" placeholder="Введите логин">
        <input id="password-input" class="add-form-text"  type="password" placeholder="Введите пароль">
        <button id="enterButton" class="add-form-button">Войти</button>
        <button id="registrationButton" class="add-form-button">Зарегистрироваться</button>
     </div>
     <p id="added-comment"></p>
     <div id="add" class="add-form">
        <input id="name-input" type="text" class="add-form-name" placeholder="Введите ваше имя" />
        <textarea id="comment-textarea" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"
        rows="4"></textarea>
        <div class="add-form-row">
        <button id="add-button" class="add-form-button">Написать</button>
     </div>
   </div>`

  appEl.innerHTML = appHtml;
  
  
  likeButton();
  answer();
};

fetchPromise();
renderComments();

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

//«Оживляем» кнопку и счетчик лайков у каждого комментария.
function likeButton () {
   //Находит все элементы с классом like-button в разметке
  const likeElements = document.querySelectorAll('.like-button');
    //Цикл for проходит по каждому элементу в списке
  for (const likeElement of likeElements) {
    //Добавляет обработчик клика на конкретный элемент в списке
    likeElement.addEventListener("click", (event) => {
      event.stopPropagation(); //останавливает всплытие события вверх по дереву
      likeElement.classList.add("-loading-like");
      delay(2000).then(() => {
        if (likeElement.classList.contains("-active-like")) {
          comments[likeElement.dataset.index].likeButton = "";
          comments[likeElement.dataset.index].likeCounter -= 1;
        } else {
          comments[likeElement.dataset.index].likeButton = "-active-like";
          comments[likeElement.dataset.index].likeCounter++;
        }
        likeElement.classList.remove("-loading-like");
        
        renderComments();
      });  
    });
  }
};

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

buttonElement.addEventListener("click", () => {
    //Когда нажимаем "Написать" исчезает поле ввода и появляется строчка:"Комментарий добавляется..." 
    addedCommentElement.style.display = "flex";
    addedCommentElement.textContent = "Комментарий добавляется...";
    InputFormElement.style.display = "none";
    
    nameInputElement.classList.remove("error");
    commentTextAreaElement.classList.remove("error");
    if (nameInputElement.value === '') {
      nameInputElement.classList.add("error");
    return;
    } if (commentTextAreaElement.value === '') {
      commentTextAreaElement.classList.add("error");
      return;
    }
  
    comments.push ({
      name: nameInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
      date: new Date(),
      comment: commentTextAreaElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
      likeCounter: 0,
      likeButton: false,
    });
  
     //Добавляем комментарий
      fetch(host,{
        method:"POST",
        body: JSON.stringify ({
          text: commentTextAreaElement.value,
          name: nameInputElement.value,
        }),
        headers: {
          Authorization: token,
        },
      })
      .then((response) =>{
        if (response.status === 201) { 
          return response.json();  
        }
        else if (response.status === 400) {
          throw new Error ("Имя и комментарий должны быть не короче 3 символов");
        }
        else if (response.status === 401) {
          throw new Error("Нет авторизации");
        }
        else if (response.status === 500) { 
          throw new Error ("Упал сервер");
        } 
        else {
          throw new Error ("Сломался интернет");
        }
      })
      .then(() => {
        return fetchPromise();
      })
      .then(() => {
        addedCommentElement.style.display = "none";
        InputFormElement.style.display = "flex";
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
      })
});  
 



//Сценарий «Ответы на комментарии»
function answer() {
 const commentElements = document.querySelectorAll('.comment');
 for (const commentElement of commentElements) {
   commentElement.addEventListener("click", () => {
    commentTextAreaElement.value = `> ${comments[commentElement.dataset.index].comment} \n\n ${comments[commentElement.dataset.index].name}, `;
   });
 }
};
answer();