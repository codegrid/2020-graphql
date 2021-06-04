export const debounce = (duration, callback) => {
  let timer = null;
  return (...args) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, duration);
  };
};
