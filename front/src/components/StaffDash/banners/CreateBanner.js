import React, { useState, useEffect, Fragment } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createBanner } from '../../../actions/banners';

import { Form } from '../../common';

import alertError from '../../../utils/alertError';

const CreateBanner = ({ createBanner, boards: { boards }, banners: { error } }) => {
  let history = useHistory();

  useEffect(() => {
    alertError(error);
  }, [error]);

  const [formData, setFormdata] = useState({ board_id: 0, image: null });
  const { board_id, image } = formData;

  let boardsOptions = boards.map((board) => ({
    value: board.board_id,
    text: `/${board.uri} - ${board.name}`,
  }));

  const onChange = (e) =>
    setFormdata({
      ...formData,
      [e.target.name]: e.target.name === 'image' ? e.target.files[0] : e.target.value,
    });

  const elements = [
    {
      component: 'select',
      name: 'board_id',
      value: board_id,
      options: !boards
        ? [{ value: 0, text: 'Global' }]
        : [{ value: 0, text: 'Global' }, ...boardsOptions],
      label: 'Board',
      onChange: (e) => onChange(e),
    },
    {
      component: 'file',
      name: 'image',
      label: 'Archivo',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Banner',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (!image) alert('Debe seleccionar una imágen');
    else {
      const newBanner = new FormData();

      if (board_id !== 0) newBanner.set('board_id', board_id);
      newBanner.append('image', image);

      createBanner(newBanner, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nuevo Banner</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateBanner.propTypes = {
  createBanner: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  banners: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  banners: state.banners,
});

export default connect(mapStateToProps, { createBanner })(withRouter(CreateBanner));
