import React from 'react';

export default ({ src, className, hide, onClick }) => {
  let style = hide ? { display: 'none' } : {};

  return <img className={className} src={src} alt={src} onClick={onClick} style={style} />;
};
