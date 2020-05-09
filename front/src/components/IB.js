import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Home from './Home';
import StaffDash from './StaffDash';
import Boards from './Boards';
import { ViewImage } from './common';

import { getTheme } from '../actions/themes';

import '../default.css';

const IB = ({ getTheme, themes: { theme, loading } }) => {
  if (!localStorage.theme) localStorage.setItem('theme', 'default');

  const selectedTheme = localStorage.getItem('theme');

  useEffect(() => {
    getTheme(selectedTheme);
  }, [getTheme, selectedTheme]);

  const style = document.createElement('style');
  document.head.appendChild(style);

  let component = <div />;

  if (!loading) {
    style.innerHTML = theme.css;
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

  return component;
};

IB.propTypes = {
  getTheme: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
});

export default connect(mapStateToProps, { getTheme })(IB);
