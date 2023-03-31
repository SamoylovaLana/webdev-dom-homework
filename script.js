const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const commentTextAreaElement = document.getElementById("comment-textarea");


function fetchPromise() {
   return fetch('https://webdev-hw-api.vercel.app/api/v1/lana-samoylova/comments',{
    method:"GET",
  }).then((response) =>{
    
    const jsonPromise = response.json();
    jsonPromise.then((responseData) => {
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
    });
  });
}
fetchPromise();


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

renderComments();
//«Оживляем» кнопку и счетчик лайков у каждого комментария.
function likeButton () {
   //Находит все элементы с классом like-button в разметке
  const likeElements = document.querySelectorAll('.like-button');
    //Цикл for проходит по каждому элементу в списке
  for (const likeElement of likeElements) {
    //Добавляет обработчик клика на конкретный элемент в списке
    likeElement.addEventListener("click", (event) => {
      if (likeElement.classList.contains("-active-like")) {
        comments[likeElement.dataset.index].likeButton = "";
        comments[likeElement.dataset.index].likeCounter -= 1;
      } else {
        comments[likeElement.dataset.index].likeButton = "-active-like";
        comments[likeElement.dataset.index].likeCounter++;
      }
      event.stopPropagation(); //останавливает всплытие события вверх по дереву
      renderComments();
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
    document.getElementById("add-button").click();
  }
  checkParams();
});

buttonElement.addEventListener("click", () => {

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
    date: currentDate,
    comment: commentTextAreaElement.value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;"),
    likeCounter: 0,
    likeButton: "",
  });

   //Добавляем комментарий
    
    fetch('https://webdev-hw-api.vercel.app/api/v1/lana-samoylova/comments',{
      method:"POST",
      body: JSON.stringify ({
        text: commentTextAreaElement.value,
        name: nameInputElement.value,
      }),
    }).then((response) =>{
      
      const jsonPromise = response.json();
      jsonPromise.then((responseData) => {
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
        fetchPromise();
        renderComments();
      });
    });
  
  renderComments();
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