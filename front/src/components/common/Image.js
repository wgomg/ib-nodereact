import React, { useState } from 'react';

export default ({ src, className }) => {
  const [clicked, setClicked] = useState(false);

  const image = src ? (
    <img
      className={className + (clicked ? '' : ' not-visited')}
      src={src}
      alt={src}
      onClick={() => setClicked(!clicked)}
    />
  ) : (
    <h6 className='centered'>No hay Banners</h6>
  );

  return image;
};
