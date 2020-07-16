import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import axios from '../../services/axios';

import { Container } from './styles';
import Box from '../../components/Box';
import Button from '../../components/Button';
import { Form, Input, CodeInput } from '../../components/Form';

interface Template {
  _id: string;
  title: string;
}

interface RouteParams {
  id: string;
}

type Props = RouteComponentProps<RouteParams>;

const TemplateForm: React.FC<Props> = ({ history, match }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);
  const { id } = match.params;

  useEffect(() => {
    async function loadData() {
      const response = await axios.get(`/templates/${id}`);

      formRef.current?.setData(response.data);
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const navigateToList = useCallback(() => {
    history.push('/templates');
  }, [history]);

  const handleCreateTemplate = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          title: Yup.string().required('O título é obrigatório'),
          content: Yup.string()
            .required('O conteúdo é obrigatório')
            .matches(
              /\{\{ message_content \}\}/,
              'Inclua a variável {{ message_content }} no template.',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (id) {
          await axios.put(`/templates/${id}`, data);
        } else {
          await axios.post('/templates', data);
        }

        navigateToList();
      } catch (err) {
        setLoading(false);

        const validationErrors: { [key: string]: string } = {};

        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((error: Yup.ValidationError) => {
            validationErrors[error.path] = error.message;
          });

          formRef.current?.setErrors(validationErrors);
        } else {
          alert('Falha para cadastrar template!');
        }
      }
    },
    [id, navigateToList],
  );

  return (
    <Container>
      <header>
        <h1>Criar template</h1>
        <Button color="cancel" onClick={navigateToList}>
          Cancelar
        </Button>
      </header>
      <Box>
        <Form ref={formRef} onSubmit={handleCreateTemplate}>
          <Input label="Título" name="title" />

          <CodeInput
            label="Conteúdo"
            note="Inclua {{ message_content }} para injetar o conteúdo da mensagem"
            name="content"
          />

          <Button loading={loading} size="big" type="submit">
            Salvar template
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default TemplateForm;
