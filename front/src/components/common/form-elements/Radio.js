import React, { Fragment } from 'react';

export default ({ name, options, onChange }) => (
  <Fragment>
    {options.map((option) => (
      <div className='col' key={option.value}>
        <label>
          <input
            key={option.value}
            type='radio'
            name={name}
            value={option.value}
            onChange={onChange}
            checked={option.checked}
          />{' '}
          {option.text}
        </label>
      </div>
    ))}
  </Fragment>
);
