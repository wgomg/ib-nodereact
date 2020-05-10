import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Home from './Home';
import StaffDash from './StaffDash';
import Boards from './Boards';
import { ViewImage } from './common';

import { getTheme } from '../actions/themes';
import { getTags } from '../actions/tags';

import '../default.css';

const IB = ({
  getTheme,
  getTags,
  tags: { tags, loading: tagsLoading },
  themes: { theme, loading: themesLoading },
}) => {
  const [cssInStorage, setCssInStorage] = useState(localStorage.getItem('css') !== null);

  if (!localStorage.theme) {
    localStorage.setItem('theme', 'default');
    localStorage.setItem('css', null);
  }

  const selectedTheme = localStorage.getItem('theme');

  useEffect(() => {
    getTheme(selectedTheme);
  }, [getTheme, selectedTheme]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  let themeStyle = document.getElementById('theme');

  if (!themeStyle) {
    themeStyle = document.createElement('style');
    themeStyle.setAttribute('id', 'theme');
    themeStyle.setAttribute('type', 'text/css');
    document.head.appendChild(themeStyle);
  }

  let component = <div />;

  if (!cssInStorage && !themesLoading) {
    localStorage.setItem('css', theme.css);
    setCssInStorage(true);
  }

  if (cssInStorage) {
    themeStyle.innerHTML = localStorage.getItem('css');
    component = (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path='/data/:img' component={ViewImage} />
            <Route exact path='/' component={Home} />
            <Route path='/staff' component={StaffDash} />
            <Route path='/' component={Boards} />
          </Switch>
        </Fragment>
      </Router>
    );
  }

  let tagsStyle = document.getElementById('tags');

  if (!tagsStyle) {
    tagsStyle = document.createElement('style');
    tagsStyle.setAttribute('id', 'tags');
    tagsStyle.setAttribute('type', 'text/css');
    document.head.appendChild(tagsStyle);
  }

  if (!tagsLoading) tagsStyle.innerHTML = tags.map((tag) => tag.css).join(' ');

  return component;
};

IB.propTypes = {
  getTheme: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
  tags: state.tags,
});

export default connect(mapStateToProps, { getTheme, getTags })(IB);
