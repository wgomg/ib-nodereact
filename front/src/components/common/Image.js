import React from 'react';

export default ({ src, className, hide, setHide }) => {
  let style = hide ? { display: 'none' } : {};

  const image = src ? (
    <img className={className} src={src} alt={src} onClick={setHide} style={style} />
  ) : (
    <h6 className='centered'>No hay Banners</h6>
  );

  return image;
};
