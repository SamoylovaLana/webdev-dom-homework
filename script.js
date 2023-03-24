const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const commentTextAreaElement = document.getElementById("comment-textarea");
const commentElements = document.querySelectorAll('.comment');

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    comment: "Это будет первый комментарий на этой странице",
    likeCounter: 3,
    likeButton: "",
  },
  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    comment: "Мне нравится как оформлена эта страница! ❤",
    likeCounter: 75,
    likeButton: "-active-like",
  },
];

const renderComments = () => {
  const commentsHtml = comments
  .map((comment, index) => {
    return `<li class="comment">
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
};

renderComments();

function likeButton () {
   //Находит все элементы с классом like-button в разметке
  const likeElements = document.querySelectorAll('.like-button');
    //Цикл for проходит по каждому элементу в списке
  for (const likeElement of likeElements) {
    //Добавляет обработчик клика на конкретный элемент в списке
    likeElement.addEventListener("click", () => {
      if (likeElement.classList.contains("-active-like")) {
        comments[likeElement.dataset.index].likeButton = "";
        comments[likeElement.dataset.index].likeCounter -= 1;
      } else {
        comments[likeElement.dataset.index].likeButton = "-active-like";
        comments[likeElement.dataset.index].likeCounter++;
      }
      renderComments();
    });
  }
};

// Добавление элемента в список по нажатию Enter 
document.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    document.getElementById("add-button").click();
  }
});

buttonElement.addEventListener("click", () => {
  const date = new Date();
  let year = date.getFullYear() % 100;
  let month = date.getMonth() + 1;
  let day = date.getDay();
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (day < 10) {
    day = "0" + day;
  } if (hour < 10) {
    hour = "0" + hour;
  } if (minute < 10) {
    minute = "0" + minute;
  } if (month < 10) {
    month = "0" + month;
  }
  const currentDate = day + '.' + month + '.' + year + '  ' + hour + ':' + minute;

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
    name: nameInputElement.value,
    date: currentDate,
    comment: commentTextAreaElement.value,
    likeCounter: 0,
    likeButton: "",
  });

  renderComments();

  /*const oldListElement = listElement.innerHTML;
  listElement.innerHTML = oldListElement + `
            <li class="comment">
        <div class="comment-header">
          <div>${nameInputElement.value}</div>
          <div>${currentDate}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${commentTextAreaElement.value}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">0</span>
            <button class="like-button"></button>
          </div>
        </div>
      </li>`*/
   
      nameInputElement.value = ""; 
      commentTextAreaElement.value = "";   
});
