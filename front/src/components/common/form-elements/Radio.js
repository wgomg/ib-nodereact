import React, { Fragment } from 'react';

export default ({ name, options, onChange, label }) => (
  <Fragment>
    <div className='columns'>
      {label && (
        <div className='col-2'>
          <h4>{label}</h4>
        </div>
      )}
      <div className='col'>
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
      </div>
    </div>
  </Fragment>
);
