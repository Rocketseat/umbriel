import React, { useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { mutate } from 'swr';
import { MdMail } from 'react-icons/md';
import useRequest from '../../services/useRequest';
import axios from '../../services/axios';

import { Container, MessageContent } from './styles';
import Box from '../../components/Box';
import Button from '../../components/Button';

interface Message {
  _id: string;
  subject: string;
  sentAt: string;
  finalBody: string;
  recipientsCount: number;
  sentCount: number;
  sentAtFormatted?: string;
  tags: Array<{
    _id: string;
    title: string;
  }>;
  sender: {
    name: string;
    email: string;
  };
}

interface RouteParams {
  id: string;
}

type Props = RouteComponentProps<RouteParams>;

const MessageForm: React.FC<Props> = ({ match }) => {
  const { id } = match.params;

  const { data, requestKey } = useRequest<Message>({
    url: `/messages/${id}`,
  });

  const message = useMemo(() => {
    if (!data) {
      return null;
    }

    return {
      ...data,
      sentAtFormatted: data.sentAt
        ? format(parseISO(data.sentAt), "dd/MM/yyyy HH:mm'h'")
        : 'Não enviada',
    };
  }, [data]);

  const handleSendMessage = useCallback(async () => {
    try {
      const response = await axios.post(`/messages/${id}/send`);

      mutate(requestKey, response, false);
    } catch (err) {
      alert('Erro ao enviar mensagem');
    }
  }, [id, requestKey]);

  return (
    <Container>
      <header>
        <h1>Mensagem</h1>
        {!message?.sentAt && (
          <Button color="secundary" onClick={handleSendMessage}>
            <MdMail size={16} color="#FFF" /> Realizar envio
          </Button>
        )}
      </header>
      {message ? (
        <Box>
          <strong>ASSUNTO</strong>
          <h2>{message.subject}</h2>

          <strong>REMETENTE</strong>
          <h3>
            {message.sender
              ? `${message.sender.name} - ${message.sender.email}`
              : 'Padrão'}
          </h3>

          <strong>RECIPIENTES</strong>
          <h3>{message.recipientsCount}</h3>

          <strong>ENTREGUE PARA</strong>
          <h3>{message.sentCount}</h3>

          <strong>ENVIADA EM</strong>
          <h3>{message.sentAtFormatted}</h3>

          <strong>CONTEÚDO</strong>
          <MessageContent
            dangerouslySetInnerHTML={{ __html: message.finalBody }}
          />
        </Box>
      ) : (
        <p>Carregando...</p>
      )}
    </Container>
  );
};

export default MessageForm;
