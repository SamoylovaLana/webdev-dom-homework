const host = "https://webdev-hw-api.vercel.app/api/v2/lanaSamoylova/comments";
let token = null;


export function getCommentsList({ token }) {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 201 || response.status === 200) {
      return response.json();
    } else {
      return Promise.reject("Сервер упал");
    }
  });
}

export function fetchPostApi({ name, text, date, forceError, token }) {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      name,
      text,
      date,
      forceError,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
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
  });
}

export function registerUser({ login, password, name }) {
    
  return fetch('https://webdev-hw-api.vercel.app/api/user', {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name
    }),
  }).then((response) => {
      if (response.status === 400){
        throw new Error ("Такой пользователь уже существует")
      }
      return response.json()
  });
}

export function loginUser({ login, password }) {
    
  return fetch('https://webdev-hw-api.vercel.app/api/user/login', {
    method: "POST",
    body: JSON.stringify({
      login,
      password, 
    }),
  })
  .then((response) => {
      if (response.status === 400){
        throw new Error ("Неверный логин или пароль")
      }
      return response.json()      
  });
}