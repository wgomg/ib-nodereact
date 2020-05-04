import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default ({ boards, staff }) => (
  <div className='container'>
    <p className='centered'>
      [ <Link to='/'>Home</Link> ] [{' '}
      {boards.length > 0 ? (
        boards.map((board, index) => (
          <Fragment key={board.board_id}>
            <Link to={`/${board.uri}/`}> {board.uri} </Link>
            {index !== boards.length - 1 ? ' / ' : ''}
          </Fragment>
        ))
      ) : (
        <h4 className='warning'>No hay boards para mostrar</h4>
      )}{' '}
      ]{' '}
      {staff && (
        <Fragment>
          [{' '}
          <Link to='/staff/dash'>
            <span className={staff.admin ? 'admin' : 'mod'}>{staff.name}</span>
          </Link>{' '}
          ]
        </Fragment>
      )}
    </p>
  </div>
);
