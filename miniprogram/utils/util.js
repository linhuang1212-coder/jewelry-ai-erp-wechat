function formatTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  return Number(price).toFixed(2);
}

function formatWeight(weight) {
  if (!weight && weight !== 0) return '—';
  return Number(weight).toFixed(2);
}

function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

module.exports = {
  formatTime,
  formatPrice,
  formatWeight,
  debounce,
};
