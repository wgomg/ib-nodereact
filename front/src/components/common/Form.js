import React from 'react';

import Button from './form-elements/Button';
import Text from './form-elements/Text';
import TextArea from './form-elements/TextArea';
import FileSelector from './form-elements/FileSelector';
import Checkbox from './form-elements/Checkbox';
import Select from './form-elements/Select';
import Radio from './form-elements/Radio';

const formComponents = {
  btn: Button,
  text: Text,
  textarea: TextArea,
  file: FileSelector,
  check: Checkbox,
  select: Select,
  radio: Radio,
};

export default ({ onSubmit, elements, isFloatin }) => (
  <form className={`form centered${isFloatin ? ' floatin' : ''}`} onSubmit={(e) => onSubmit(e)}>
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
            rows={element.rows}
          />
        </div>
      );
    })}
  </form>
);
