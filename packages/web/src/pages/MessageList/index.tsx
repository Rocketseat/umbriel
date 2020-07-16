import React, { useMemo, useCallback, Fragment } from 'react';
import { MdMail } from 'react-icons/md';
import { format, parseISO } from 'date-fns';
import { RouteComponentProps } from 'react-router-dom';
import { mutate } from 'swr';
import usePaginatedRequest from '../../services/usePaginatedRequest';
import axios from '../../services/axios';

import { Container, ProgressBar } from './styles';
import Tag from '../../components/Tag';
import Button from '../../components/Button';
import PaginatedTable from '../../components/PaginatedTable';

interface Message {
  _id: string;
  subject: string;
  sentAt: string;
  recipientsCount: number;
  sentCount: number;
  sentAtFormatted?: string;
  tags: Array<{
    _id: string;
    title: string;
  }>;
}

type Props = RouteComponentProps;

const Messages: React.FC<Props> = ({ history }) => {
  const request = usePaginatedRequest<Message[]>({
    url: '/messages',
  });

  const messages = useMemo(() => {
    if (!request.data) {
      return [];
    }

    return request.data.map(message => ({
      ...message,
      sentAtFormatted: message.sentAt
        ? format(parseISO(message.sentAt), "dd/MM HH:mm'h'")
        : 'Não enviada',
      visualTags: message.tags
        .slice(0, 2)
        .map(tag => <Tag key={tag._id}>{tag.title}</Tag>),
    }));
  }, [request]);

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Deseja realmente deletar esse remetente? Olha lá o que tu vai fazer...',
      );

      if (confirmed) {
        try {
          await axios.delete(`/messages/${id}`);

          mutate(
            request.requestKey,
            {
              ...request.response,
              data: request.data?.filter(message => message._id !== id),
            },
            false,
          );
        } catch (err) {
          alert('Erro ao deletar mensagem');
        }
      }
    },
    [request.data, request.requestKey, request.response],
  );

  const navigateToCreate = () => {
    history.push('/messages/create');
  };

  return (
    <Container>
      <header>
        <h1>Mensagens</h1>
        <Button onClick={navigateToCreate}>
          <MdMail size={16} color="#FFF" /> Nova mensagem
        </Button>
      </header>
      <PaginatedTable request={request}>
        <tbody>
          {messages.map(message => (
            <Fragment key={message._id}>
              <tr>
                <td colSpan={5}>
                  <h3>{message.subject}</h3>
                </td>
              </tr>
              <tr className="no-border">
                <td style={{ width: 200 }}>
                  <ProgressBar
                    total={message.recipientsCount}
                    current={message.sentCount}
                  >
                    <span>
                      {message.sentCount} / {message.recipientsCount}
                    </span>
                  </ProgressBar>
                </td>
                <td>
                  {message.visualTags}
                  <small>
                    {message.tags.length > 2
                      ? ` e outras ${message.tags.length - 2}`
                      : ''}
                  </small>
                </td>
                <td>{message.sentAtFormatted}</td>
                <td style={{ width: 200 }}>
                  <Button
                    inline
                    size="small"
                    onClick={() =>
                      history.push(`/messages/show/${message._id}`)
                    }
                  >
                    Visualizar
                  </Button>
                  <Button
                    inline
                    disabled={!!message.sentAt}
                    size="small"
                    color="danger"
                    onClick={() => handleDelete(message._id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </PaginatedTable>
    </Container>
  );
};

export default Messages;
