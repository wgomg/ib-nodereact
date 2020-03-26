import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BoardsNavbar, Board } from './boards';
import Footer from './Footer';
import { Loading } from './common';

import { getBoardsList } from '../actions/boards';

const Boards = ({ getBoardsList, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  let navbar = <Loading />;
  if (!loading) navbar = <BoardsNavbar boards={boards} />;

  let boardsRoutes = <Loading />;
  if (!loading)
    boardsRoutes = (
      <Switch>
        {boards.map(board => {
          return (
            <Route
              path={'/' + board.uri}
              render={props => <Board {...props} uri={board.uri} />}
              key={board.board_id}
            />
          );
        })}
      </Switch>
    );

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
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoardsList })(Boards);
