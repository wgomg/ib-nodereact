import { Fragment } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import ThemePicker from './ThemePicker';

import { getAllBoards } from '../data/boards';

const Navbar = () => {
  const { isLoading, error, data: boards } = useQuery('boards', getAllBoards);

  let navbarContent = 'Loading... ';

  if (error) console.error(error);

  if (!isLoading)
    navbarContent =
      boards.length > 0 ? (
        boards.map((board, index) => (
          <Fragment key={board.board_id}>
            <Link to={`/${board.uri}/`}> {board.uri} </Link>
            {index !== boards.length - 1 ? ' / ' : ''}
          </Fragment>
        ))
      ) : (
        <small className="warning">No hay boards para mostrar</small>
      );

  return (
    <Fragment>
      <div className="container">
        <p className="centered">
          [ <Link to="/">Home</Link> ] [ {navbarContent} ] <ThemePicker />
        </p>
      </div>
    </Fragment>
  );
};

export default Navbar;
