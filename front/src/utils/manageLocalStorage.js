const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

const getTheme = () => localStorage.getItem('theme');

const manageLocalStorage = { setTheme, getTheme };

export default manageLocalStorage;
