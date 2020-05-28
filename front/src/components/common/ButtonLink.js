import React from 'react';

export default ({ text, extraClass, onClick }) => {
  return (
    <button className={`link ${extraClass || ''}`} onClick={onClick}>
      {text}
    </button>
  );
};
