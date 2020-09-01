import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { mutate } from 'swr';
import usePaginatedRequest from '../../services/usePaginatedRequest';
import axios from '../../services/axios';

import { Container } from './styles';
import Button from '../../components/Button';
import PaginatedTable from '../../components/PaginatedTable';

interface Segment {
  _id: string;
  title: string;
}

type Props = RouteComponentProps;

const Segments: React.FC<Props> = ({ history }) => {
  const request = usePaginatedRequest<Segment[]>({
    url: '/segments',
  });

  const navigateToCreate = () => {
    history.push('/segments/create');
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Deseja realmente deletar esse segmento? Olha lá o que tu vai fazer...',
      );

      if (confirmed) {
        try {
          await axios.delete(`/segments/${id}`);

          mutate(
            request.requestKey,
            {
              ...request.response,
              data: request.data?.filter(segment => segment._id !== id),
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
        <h1>Segmentos</h1>
        <Button onClick={navigateToCreate}>
          <MdAdd size={16} color="#FFF" /> Criar segmento
        </Button>
      </header>
      <PaginatedTable request={request}>
        <thead>
          <tr>
            <th>Título</th>
            <th style={{ width: 165 }} />
          </tr>
        </thead>
        <tbody>
          {request.data?.map(segment => (
            <tr key={segment._id}>
              <td>{segment.title}</td>
              <td>
                <Button
                  inline
                  size="small"
                  onClick={() => history.push(`/segments/edit/${segment._id}`)}
                >
                  Editar
                </Button>
                <Button
                  inline
                  size="small"
                  color="danger"
                  onClick={() => handleDelete(segment._id)}
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

export default Segments;
