import React, { useRef, useEffect } from 'react';
import { OptionTypeBase } from 'react-select';
import { Props as CreatableProps } from 'react-select/creatable';
import { useField } from '@unform/core';

import { Container, Select } from './styles';

interface Props extends CreatableProps<OptionTypeBase> {
  name: string;
  label?: string;
  note?: string;
}

const CreatableSelect: React.FC<Props> = ({ name, label, note, ...rest }) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }

          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }
        if (!ref.state.value) {
          return '';
        }

        return ref.state.value.value;
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {note && <small>{note}</small>}

      <Select
        cacheOptions
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        {...rest}
        theme={undefined}
      />

      {error && <span>{error}</span>}
    </Container>
  );
};

export default CreatableSelect;
