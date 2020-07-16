import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import axios from '../../services/axios';

import { Container } from './styles';
import Box from '../../components/Box';
import Button from '../../components/Button';
import { Form, Input } from '../../components/Form';

interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface RouteParams {
  id: string;
}

type Props = RouteComponentProps<RouteParams>;

const SenderForm: React.FC<Props> = ({ history, match }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);
  const { id } = match.params;

  useEffect(() => {
    async function loadData() {
      const response = await axios.get(`/senders/${id}`);

      formRef.current?.setData(response.data);
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const navigateToList = useCallback(() => {
    history.push('/senders');
  }, [history]);

  const handleSaveSender = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          email: Yup.string().required('O e-mail é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (id) {
          await axios.put(`/senders/${id}`, data);
        } else {
          await axios.post('/senders', data);
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
          alert('Falha para cadastrar remetente!');
        }
      }
    },
    [id, navigateToList],
  );

  return (
    <Container>
      <header>
        <h1>Criar remetente</h1>
        <Button color="cancel" onClick={navigateToList}>
          Cancelar
        </Button>
      </header>
      <Box>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Input label="Nome" name="name" />

          <Input label="E-mail" name="email" disabled={!!id} />

          <Button loading={loading} size="big" type="submit">
            Salvar remetente
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default SenderForm;
