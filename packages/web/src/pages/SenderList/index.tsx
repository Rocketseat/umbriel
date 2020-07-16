import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { mutate } from 'swr';
import usePaginatedRequest from '../../services/usePaginatedRequest';
import axios from '../../services/axios';

import { Container } from './styles';
import Button from '../../components/Button';
import PaginatedTable from '../../components/PaginatedTable';

interface Sender {
  _id: string;
  name: string;
  email: string;
}

type Props = RouteComponentProps;

const Senders: React.FC<Props> = ({ history }) => {
  const request = usePaginatedRequest<Sender[]>({
    url: '/senders',
  });

  const navigateToCreate = () => {
    history.push('/senders/create');
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Deseja realmente deletar esse remetente? Olha lá o que tu vai fazer...',
      );

      if (confirmed) {
        try {
          await axios.delete(`/senders/${id}`);

          mutate(
            request.requestKey,
            {
              ...request.response,
              data: request.data?.filter(sender => sender._id !== id),
            },
            false,
          );
        } catch (err) {
          alert('Erro ao deletar template');
        }
      }
    },
    [request.data, request.requestKey, request.response],
  );

  return (
    <Container>
      <header>
        <h1>Remetentes</h1>
        <Button onClick={navigateToCreate}>
          <MdAdd size={16} color="#FFF" /> Criar remetente
        </Button>
      </header>
      <PaginatedTable request={request}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th style={{ width: 165 }} />
          </tr>
        </thead>
        <tbody>
          {request.data?.map(sender => (
            <tr key={sender._id}>
              <td>{sender.name}</td>
              <td>{sender.email}</td>
              <td>
                <Button
                  inline
                  size="small"
                  onClick={() => history.push(`/senders/edit/${sender._id}`)}
                >
                  Editar
                </Button>
                <Button
                  inline
                  size="small"
                  color="danger"
                  onClick={() => handleDelete(sender._id)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </Container>
  );
};

export default Senders;
