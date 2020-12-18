import axios from 'axios';

import manageLocalStorage from '../utils/manageLocalStorage';

export const getUserTheme = () => {
  let userTheme = manageLocalStorage.getTheme();

  if (!userTheme) {
    userTheme = 'default';
    manageLocalStorage.setTheme(userTheme);
  }

  return userTheme;
};

export const setUserTheme = (theme) => {
  manageLocalStorage.setTheme(theme);
  return manageLocalStorage.getTheme(theme);
};

export const getAllThemes = async () => {
  let themes = (await axios.get('/_back/api/themes')).data.data;
  const tags = (await axios.get('/_back/api/tags')).data.data;

  const tagsCss = tags.map((tag) => tag.css).join(' ');

  themes = themes.map((theme) => ({ ...theme, css: theme.css + tagsCss }));

  return themes;
};
