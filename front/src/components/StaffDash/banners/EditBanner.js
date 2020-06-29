import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getBanner, editBanner } from '../../../actions/banners';
import { getBoard, getBoardsList } from '../../../actions/boards';

import { Form } from '../../common';
import { Fragment } from 'react';

const EditBanner = ({
  getBanner,
  editBanner,
  getBoard,
  getBoardsList,
  banners: { banner, error, loading: bannerLoading },
  boards: { boards, board, loading: boardsLoading },
  match,
}) => {
  let history = useHistory();

  const [formData, setFormData] = useState({
    banner_id: '',
    board_id: 0,
    image_uri: '',
    image_name: '',
    image_size: 0,
  });

  useEffect(() => {
    getBanner(match.params.banner_id);
  }, [getBanner, match.params.banner_id]);

  useEffect(() => {
    getBoard(banner.board);
  }, [getBoard, banner]);

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  useEffect(() => {
    setFormData((formData) => {
      return !banner || bannerLoading
        ? formData
        : {
            ...formData,
            banner_id: banner.banner_id,
            image_uri: banner.uri,
            image_name: banner.name,
            image_size: banner.size,
          };
    });
  }, [banner, bannerLoading]);

  useEffect(() => {
    setFormData((formData) => {
      return !board || boardsLoading ? formData : { ...formData, board_id: board.board_id };
    });
  }, [board, boardsLoading]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

  const { board_id } = formData;

  const boardsToSelectOptions = (boards) =>
    boards.map((board) => {
      const option = {
        value: board.board_id,
        text: `/${board.uri}/ - ${board.name}`,
      };
      return option;
    });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'select',
      name: 'board_id',
      value: board_id,
      options:
        !boards || boardsLoading
          ? [{ value: 0, text: 'Global' }]
          : [{ value: 0, text: 'Global' }, ...boardsToSelectOptions(boards)],
      label: 'Board',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Editar Banner',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    let editedBanner = { ...formData };

    if (board_id === 0) editedBanner.board_id = null;

    editBanner(editedBanner, history);
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Editar Banner</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

EditBanner.propTypes = {
  getBanner: PropTypes.func.isRequired,
  editBanner: PropTypes.func.isRequired,
  getBoard: PropTypes.func.isRequired,
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  banners: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  banners: state.banners,
});

export default connect(mapStateToProps, { getBanner, editBanner, getBoard, getBoardsList })(
  withRouter(EditBanner)
);
