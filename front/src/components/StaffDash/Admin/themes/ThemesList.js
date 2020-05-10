import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../../common';
import { getThemes, deleteTheme } from '../../../../actions/themes';

import ReactTooltip from 'react-tooltip';

const ThemesList = ({ getThemes, deleteTheme, themes: { themes, loading } }) => {
  useEffect(() => {
    getThemes();
  }, [getThemes]);

  const themesList =
    themes.length > 0 ? (
      themes.map((theme) => {
        const delTheme = (
          <Link to='/staff/dash' onClick={(e) => deleteTheme(theme.theme_id)}>
            borrar
          </Link>
        );
        const editTheme = <Link to={`dash/edit-theme/${theme.name}`}>editar</Link>;

        const actions = (
          <div className='col-3'>
            <span className='small'>
              [ {delTheme} | {editTheme} ]
            </span>
          </div>
        );

        const name = <div className='col-1'>{theme.name}</div>;

        return (
          <div className='columns' key={theme.theme_id}>
            {actions} {name}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Temas para mostrar</h4>
    );

  const newTheme = (
    <Link to='dash/create-theme'>
      <span className='new-item'>[ nuevo tema ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {themesList}
      <ReactTooltip border={true} borderColor='#7da3b3' />
      {newTheme}
    </Fragment>
  );

  return <Card title='Temas' content={cardContent} classes='col' />;
};

ThemesList.propTypes = {
  getThemes: PropTypes.func.isRequired,
  deleteTheme: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
});

export default connect(mapStateToProps, { getThemes, deleteTheme })(ThemesList);
