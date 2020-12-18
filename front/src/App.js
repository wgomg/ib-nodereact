import { useQuery } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { getUserTheme, getAllThemes } from './data/themes';
import { Fragment } from 'react';

const App = () => {
  const userTheme = getUserTheme();

  const { isLoading, error, data: themes } = useQuery('themes', getAllThemes);

  if (error) console.error(error);
  if (!isLoading) {
    let themeStyleElement = document.createElement('style');
    themeStyleElement.setAttribute('id', 'theme');
    themeStyleElement.setAttribute('type', 'text/css');
    document.head.appendChild(themeStyleElement);

    themeStyleElement.innerHTML = themes.find(
      (theme) => theme.name === userTheme
    ).css;
  }

  return (
    <Fragment>
      <Router>
        <Navbar />
        <div>IB App</div>
      </Router>
      <Footer />
    </Fragment>
  );
};

export default App;
