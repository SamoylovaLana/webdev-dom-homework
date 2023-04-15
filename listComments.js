export const getListComments = (comment, index) => {
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
   </li>`;
  };