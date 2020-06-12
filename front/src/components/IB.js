import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Home from './Home';
import StaffDash from './StaffDash';
import Board from './Board';
import { ViewImage, Navbar, Footer } from './common';

import { getTheme } from '../actions/themes';
import { getTags } from '../actions/tags';

import { getBoardsList } from '../actions/boards';

import { getThemeFromStorage, setCssInStorage, getCssFromStorage } from '../utils/theme';

const IB = ({
  getBoardsList,
  getTheme,
  getTags,
  tags: { tags, loading: tagsLoading },
  themes: { theme, loading: themesLoading },
}) => {
  const [selectedCss, setSelectedCss] = useState(getCssFromStorage());

  const selectedTheme = getThemeFromStorage();

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  useEffect(() => {
    getTheme(selectedTheme);
  }, [getTheme, selectedTheme]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  let ib = <div />;

  let themeStyle = getStyleElement('theme');
  if (!selectedCss && !themesLoading) setSelectedCss(setCssInStorage(theme.css));

  if (selectedCss) {
    themeStyle.innerHTML = selectedCss;
    ib = (
      <Router>
        <Navbar />
        <Fragment>
          <Switch>
            <Route exact path='/data/thumbs/:img' component={ViewImage} />
            <Route exact path='/data/:img' component={ViewImage} />
            <Route exact path='/' component={Home} />
            <Route path='/staff' component={StaffDash} />
            <Route path='/' component={Board} />
          </Switch>
        </Fragment>
      </Router>
    );
  }

  let tagsStyle = getStyleElement('tags');
  if (!tagsLoading) tagsStyle.innerHTML = tags.map((tag) => tag.css).join(' ');

  return (
    <Fragment>
      {ib}
      <Footer />
    </Fragment>
  );
};

const getStyleElement = (id) => {
  let ele = document.getElementById(id);

  if (!ele) {
    ele = document.createElement('style');
    ele.setAttribute('id', id);
    ele.setAttribute('type', 'text/css');
    document.head.appendChild(ele);
  }

  return ele;
};

IB.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  getTheme: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
  tags: state.tags,
});

export default connect(mapStateToProps, { getTheme, getTags, getBoardsList })(IB);
