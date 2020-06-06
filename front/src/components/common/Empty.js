import React, { Fragment } from 'react';

export default ({ element }) => {
  return (
    <Fragment>
      <hr className='separator' />
      <h2 className='centered warning'>No hay {element} para mostrar</h2>
      <hr className='separator' />
    </Fragment>
  );
};
