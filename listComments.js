/*export const getListComments = (user, index) => {
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
      <button  data-index="${index}" class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
    </div>
  </div>
  </li>`
  };*/