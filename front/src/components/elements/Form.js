import React from 'react';
import PropTypes from 'prop-types';

import Button from './form-elements/Button';
import Text from './form-elements/Text';
import TextArea from './form-elements/TextArea';

const formComponents = {
  btn: Button,
  text: Text,
  textarea: TextArea
};

const Form = ({ onSubmit, onChange, elements }) => {
  return (
    <form className='form centered' onSubmit={e => onSubmit(e)}>
      {elements.map(element => {
        const Component = formComponents[element.component];
        return (
          <div className={element.class || 'form-group'} key={element.props.name}>
            <Component
              props={element.props}
              onChange={onChange}
              lead={element.lead}
              label={element.label}
            />
          </div>
        );
      })}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired
};

export default Form;
