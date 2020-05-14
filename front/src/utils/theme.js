const getThemeFromStorage = () => {
  if (!localStorage.theme) setDefaultTheme();

  return localStorage.getItem('theme');
};

const setCssInStorage = (css) => {
  localStorage.setItem('css', css);

  return localStorage.getItem('css');
};

const getCssFromStorage = () => localStorage.getItem('css');

const setDefaultTheme = () => {
  localStorage.setItem('theme', 'default');
  localStorage.setItem('css', null);
};

module.exports = {
  getThemeFromStorage,
  setCssInStorage,
  getCssFromStorage,
};
