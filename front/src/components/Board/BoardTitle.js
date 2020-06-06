import React from 'react';

export default ({ board }) => {
  const thisBoard = board && board.length > 0 ? board[0] : {};

  return (
    <div className='container centered'>
      <h2 className='centered title'>
        /{thisBoard.uri}/ - {thisBoard.name}
      </h2>
      <p className='centered subtitle'>{thisBoard.description}</p>
    </div>
  );
};
