import React, { Fragment } from 'react';

export default ({ name, options, value, onChange }) => {
  return (
    <Fragment>
      {options.map((option) => {
        return (
          <div className='col' key={option.value}>
            <label>
              <input
                type='radio'
                name={name}
                value={option.value}
                checked={option.value === value}
                onChange={onChange}
              />{' '}
              {option.text}
            </label>
          </div>
        );
      })}
    </Fragment>
  );
};
