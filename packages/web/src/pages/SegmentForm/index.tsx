/* eslint-disable @typescript-eslint/ban-types */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import axios from '../../services/axios';

import { Container } from './styles';
import Box from '../../components/Box';
import Button from '../../components/Button';
import { Form, Input, AsyncSelect } from '../../components/Form';

interface Tag {
  title: string;
}

interface RouteParams {
  id: string;
}

type Props = RouteComponentProps<RouteParams>;

const SegmentForm: React.FC<Props> = ({ history, match }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);
  const { id } = match.params;

  useEffect(() => {
    async function loadData() {
      const response = await axios.get(`/segments/${id}`);
      const tags: object[] = [];

      response.data.tags.forEach((tag: { title: string }) => {
        const tagObject = {
          label: tag.title,
          value: tag.title,
        };

        tags.push(tagObject);
      });

      formRef.current?.setData({
        title: response.data.title,
        tags,
      });
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const navigateToList = useCallback(() => {
    history.push('/segments');
  }, [history]);

  const handleCreateSegment = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          title: Yup.string().required('O título é obrigatório'),
          tags: Yup.array(Yup.string()).required('Selecione no mínimo uma tag'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await axios.post('/segments', {
          title: data.title,
          tags: data.tags,
          id,
        });

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
          alert('Falha ao cadastrar segmento!');
        }
      }
    },
    [id, navigateToList],
  );

  const loadTags = useCallback(async search => {
    const response = await axios.get<Tag[]>('/tags', {
      params: { search },
    });

    return response.data.map(tag => ({
      value: tag.title,
      label: tag.title,
    }));
  }, []);

  return (
    <Container>
      <header>
        <h1>{id ? 'Editar segmento' : 'Criar segmento'}</h1>
        <Button color="cancel" onClick={navigateToList}>
          Cancelar
        </Button>
      </header>
      <Box>
        <Form ref={formRef} onSubmit={handleCreateSegment}>
          <Input label="Título" name="title" />

          <AsyncSelect
            label="Tags"
            name="tags"
            isMulti
            placeholder="Selecione a(s) tag(s)"
            defaultOptions
            loadingMessage={() => 'Carregando tags...'}
            loadOptions={loadTags}
          />

          <Button loading={loading} size="big" type="submit">
            Salvar segmento
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default SegmentForm;
