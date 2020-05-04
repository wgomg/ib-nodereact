import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Board from './Board';
import BoardsNavbar from './BoardsNavbar';
import { Loading, Footer } from '../common';

import { getBoardsList } from '../../actions/boards';

const Boards = ({ getBoardsList, boards: { boards, loading }, auth: { staff, logged } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const navbar = loading ? <Loading /> : <BoardsNavbar boards={boards} staff={logged ? staff : null} />;

  const routes = (
    <Switch>
      {boards.length > 0 &&
        boards.map((board) => {
          return (
            <Route
              path={'/' + board.uri}
              render={(props) => <Board {...props} uri={board.uri} />}
              key={board.board_id}
            />
          );
        })}
    </Switch>
  );

  const boardsRoutes = loading ? <Loading /> : routes;

  return (
    <Fragment>
      {navbar}
      {boardsRoutes}
      <Footer />
    </Fragment>
  );
};

Boards.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  auth: state.auth,
});

export default connect(mapStateToProps, { getBoardsList })(Boards);
