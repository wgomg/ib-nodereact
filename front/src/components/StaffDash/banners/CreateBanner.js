import React, { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createBanner } from '../../../actions/banners';
import { getBoardsList } from '../../../actions/boards';

import { Form } from '../../common';

const CreateBanner = ({ createBanner, getBoardsList, history, boards: { boards, loading } }) => {
  const [board_id, setBoardId] = useState(0);

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const [file, setFile] = useState(null);

  const boardsToSelectOptions = (boards) =>
    boards.map((board) => {
      const option = {
        value: board.board_id,
        text: `/${board.uri}/ - ${board.name}`,
      };
      return option;
    });

  const onFileSelected = (e) => setFile(e.target.files[0]);

  const elements = [
    {
      component: 'select',
      name: 'board_id',
      value: board_id,
      options:
        !boards || loading
          ? [{ value: 0, text: 'Global' }]
          : [{ value: 0, text: 'Global' }, ...boardsToSelectOptions(boards)],
      label: 'Board',
      onChange: (e) => {
        e.preventDefault();
        setBoardId(e.target.value);
      },
    },
    {
      component: 'file',
      name: 'image',
      label: 'Archivo',
      onChange: (e) => onFileSelected(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Banner',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (!file) alert('Debe seleccionar una imágen');
    else {
      const newBanner = new FormData();

      if (board_id !== 0) newBanner.set('board_id', board_id);
      newBanner.append('image', file);

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
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { createBanner, getBoardsList })(withRouter(CreateBanner));
