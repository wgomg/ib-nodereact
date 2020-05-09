import React from 'react';
import PropTypes from 'prop-types';

import Button from './form-elements/Button';
import Text from './form-elements/Text';
import TextArea from './form-elements/TextArea';
import FileSelector from './form-elements/FileSelector';
import Checkbox from './form-elements/Checkbox';
import Select from './form-elements/Select';

const formComponents = {
  btn: Button,
  text: Text,
  textarea: TextArea,
  file: FileSelector,
  check: Checkbox,
  select: Select,
};

const Form = ({ onSubmit, elements }) => {
  return (
    <form className='form centered' onSubmit={(e) => onSubmit(e)}>
      {elements.map((element, index) => {
        const Component = formComponents[element.component];
        return (
          <div className={'form-group'} key={index}>
            <Component
              component={element.component}
              name={element.name}
              value={element.value}
              text={element.text}
              onChange={element.onChange}
              lead={element.lead}
              label={element.label}
              options={element.options}
            />
          </div>
        );
      })}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
};

export default Form;
