import React, { useState } from 'react';

export default ({ src, className }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <img
      className={className + (clicked ? '' : ' not-visited')}
      src={src}
      alt={src}
      onClick={() => setClicked(!clicked)}
    />
  );
};
