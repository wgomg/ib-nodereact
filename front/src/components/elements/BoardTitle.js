import React from 'react';

export default ({ board }) => {
  return (
    <div className='container centered'>
      <h2 className='centered title'>
        /{board.uri}/ - {board.name}
      </h2>
      <p className='centered subtitle'>{board.description}</p>
    </div>
  );
};
