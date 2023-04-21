// Дата
export function getDate(date) {
  const options = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: "2-digit",
  }
  const newDate = new Date(date);
  return newDate.toLocaleString('ru-RU', options).replace(',', ''); //  replace убирает запятую после даты
}

export function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Безопасность и обработка ввода в инпут
export function safety(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

// Безопасность и обратная обработка ввода инпута из комментария
export function back(str) {
  return str.replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"');
}