import React, { useRef, useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { useField } from '@unform/core';

import { highlight, languages } from 'prismjs';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-dark.css';

import { Container } from './styles';

interface Props {
  label?: string;
  note?: string;
  name: string;
}

const hightlightWithLineNumbers = (
  input: string,
  language: any,
  languageString: string,
) =>
  highlight(input, language, languageString)
    .split('\n')
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join('\n');

const CodeInput: React.FC<Props> = ({ label, note, name }) => {
  const [code, setCode] = useState('');
  const editorRef = useRef(null);

  const { defaultValue, fieldName, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: editorRef.current,
      path: '_input.value',
      setValue(_: any, value: string) {
        setCode(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {note && <small>{note}</small>}

      <Editor
        className="editor"
        textareaId={fieldName}
        value={code}
        defaultValue={defaultValue}
        onValueChange={setCode}
        highlight={code =>
          hightlightWithLineNumbers(code, languages.markup, 'markup')
        }
        padding={15}
        ref={editorRef}
      />

      {error && <span>{error}</span>}
    </Container>
  );
};

export default CodeInput;
