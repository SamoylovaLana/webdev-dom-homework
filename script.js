const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const commentTextAreaElement = document.getElementById("comment-textarea");

const startCommentElement = document.getElementById("start-comment");
//Когда загружаются, приходят данные из API появляется строчка: "Пожалуйста подождите, комментарий загружается..."
startCommentElement.textContent = "Пожалуйста подождите, комментарий загружается..."; 

const addedCommentElement = document.getElementById("added-comment");
const InputFormElement = document.getElementById("add");

function fetchPromise() {
   return fetch('https://webdev-hw-api.vercel.app/api/v1/lana-samoylova/comments',{
    method:"GET",
  }).then((response) => {
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
        };
      });
      comments = appComments;
      renderComments();
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

  listElement.innerHTML = commentsHtml;
  likeButton ();
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
  if (event.code === "Enter") {
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
  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  };

  const currentDate = new Date().toLocaleString("ru-RU", options);

  comments.push ({
    name: nameInputElement.value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;"),
    date: currentDate,
    comment: commentTextAreaElement.value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;"),
    likeCounter: 0,
    likeButton: false,
  });

   //Добавляем комментарий
    fetch('https://webdev-hw-api.vercel.app/api/v1/lana-samoylova/comments',{
      method:"POST",
      body: JSON.stringify ({
        text: commentTextAreaElement.value,
        name: nameInputElement.value,
      }),
    })
    .then((response) =>{
      addedCommentElement.style.display = "none";
      InputFormElement.style.display = "flex";
      return response.json();
    })
    .then(() => {
      return fetchPromise();
    })
    delay(5000).then(() => {
      return renderComments();
    })

  ;
  nameInputElement.value = ""; //очищает форму input после добавления комментария
  commentTextAreaElement.value = "";  //очищает форму textarea после добавления комментария 
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