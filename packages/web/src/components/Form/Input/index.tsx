import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

interface Props<Multiline = false> {
  label?: string;
  note?: string;
  name: string;
  multiline?: Multiline;
}

type InputProps = JSX.IntrinsicElements['input'] & Props<false>;
type TextAreaProps = JSX.IntrinsicElements['textarea'] & Props<true>;

const Input: React.FC<InputProps | TextAreaProps> = ({
  label,
  note,
  name,
  multiline,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      path: 'value',
      ref: inputRef.current,
    });
  }, [fieldName, registerField]);

  const props = {
    ...rest,
    ref: inputRef,
    id: fieldName,
    'aria-label': fieldName,
    defaultValue,
  };

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {note && <small>{note}</small>}

      {multiline ? (
        <textarea {...(props as TextAreaProps)} />
      ) : (
        <input {...(props as InputProps)} />
      )}

      {error && <span>{error}</span>}
    </Container>
  );
};

export default Input;
