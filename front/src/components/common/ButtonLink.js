import React from 'react';
import { useState } from 'react';

export default ({ text, altText, extraClass }) => {
  const [btnVisited, setBtnVisited] = useState(false);

  const onClick = e => {
    e.preventDefault();
    setBtnVisited(!btnVisited);
  };

  return (
    <button className={`link ${btnVisited ? ' visited' : ''} ${extraClass || ''}`} onClick={onClick}>
      {!btnVisited ? text : altText || text}
    </button>
  );
};
