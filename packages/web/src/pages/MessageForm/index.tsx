import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { OptionTypeBase } from 'react-select';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import axios from '../../services/axios';

import { Container } from './styles';
import Box from '../../components/Box';
import Button from '../../components/Button';
import { Form, Input, CodeInput, AsyncSelect } from '../../components/Form';

interface Tag {
  _id: string;
  title: string;
}

interface Template {
  _id: string;
  title: string;
}

interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface RouteParams {
  id: string;
}

type Props = RouteComponentProps<RouteParams>;

const MessageForm: React.FC<Props> = ({ history, match }) => {
  const formRef = useRef<FormHandles>(null);
  const [recipients, setRecipients] = useState(0);

  const [loading, setLoading] = useState(false);
  const { id } = match.params;

  useEffect(() => {
    async function loadData() {
      const response = await axios.get(`/message/${id}`);

      formRef.current?.setData(response.data);
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const navigateToList = useCallback(() => {
    history.push('/messages');
  }, [history]);

  const handleCreateMessage = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          subject: Yup.string().required('O assunto é obrigatório'),
          tags: Yup.array(Yup.string()).required('Selecione no mínimo uma tag'),
          sender: Yup.string().required('O remetente é obrigatório'),
          template: Yup.string().required('O template é obrigatório'),
          body: Yup.string().required('O conteúdo da mensagem é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await axios.post('/messages', data);

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
          alert('Falha para cadastrar mensagem!');
        }
      }
    },
    [navigateToList],
  );

  const loadTags = useCallback(async search => {
    const response = await axios.get<Tag[]>('/tags', {
      params: { search },
    });

    return response.data.map(tag => ({
      value: tag._id,
      label: tag.title,
    }));
  }, []);

  const loadTemplates = useCallback(async search => {
    const response = await axios.get<Template[]>('/templates', {
      params: { search },
    });

    return response.data.map(template => ({
      value: template._id,
      label: template.title,
    }));
  }, []);

  const loadSenders = useCallback(async search => {
    const response = await axios.get<Sender[]>('/senders', {
      params: { search },
    });

    return response.data.map(sender => ({
      value: sender._id,
      label: `${sender.name} <${sender.email}>`,
    }));
  }, []);

  const handleCountRecipients = useCallback(async value => {
    const tags = value.map((tag: OptionTypeBase) => tag.value).join(',');

    const response = await axios.get<{ recipients: number }>(
      '/tags/recipients',
      {
        params: { tags },
      },
    );

    setRecipients(response.data.recipients);
  }, []);

  return (
    <Container>
      <header>
        <h1>Criar mensagem</h1>
        <Button color="cancel" onClick={navigateToList}>
          Cancelar
        </Button>
      </header>
      <Box>
        <Form ref={formRef} onSubmit={handleCreateMessage}>
          <Input label="Assunto" name="subject" />

          <AsyncSelect
            label="Tags"
            name="tags"
            note={
              recipients
                ? `Total de ${recipients} recipientes.`
                : 'Selecione as tags para calcular'
            }
            isMulti
            placeholder="Selecione as tags..."
            defaultOptions
            loadingMessage={() => 'Carregando tags...'}
            loadOptions={loadTags}
            onChange={handleCountRecipients}
          />

          <AsyncSelect
            label="Template"
            name="template"
            placeholder="Selecione o template"
            defaultOptions
            loadingMessage={() => 'Buscando templates...'}
            loadOptions={loadTemplates}
          />

          <AsyncSelect
            label="Remetente"
            name="sender"
            placeholder="Selecione o remetente"
            defaultOptions
            loadingMessage={() => 'Buscando remetentes...'}
            loadOptions={loadSenders}
          />

          <CodeInput label="Conteúdo" name="body" />

          <Button loading={loading} size="big" type="submit">
            Salvar mensagem
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default MessageForm;
