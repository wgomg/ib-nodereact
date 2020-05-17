import React from 'react';
import { useState } from 'react';

export default ({ text, altText, extraClass, onClick }) => {
  const [btnVisited, setBtnVisited] = useState(false);

  const buttonClick = () => {
    setBtnVisited(!btnVisited);
    if (onClick) onClick();
  };

  return (
    <button className={`link ${btnVisited ? ' visited' : ''} ${extraClass || ''}`} onClick={buttonClick}>
      {!btnVisited ? text : altText || text}
    </button>
  );
};
