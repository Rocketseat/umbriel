import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { mutate } from 'swr';
import usePaginatedRequest from '../../services/usePaginatedRequest';
import axios from '../../services/axios';

import { Container } from './styles';
import Button from '../../components/Button';
import PaginatedTable from '../../components/PaginatedTable';

interface Template {
  _id: string;
  title: string;
}

type Props = RouteComponentProps;

const Templates: React.FC<Props> = ({ history }) => {
  const request = usePaginatedRequest<Template[]>({
    url: '/templates',
  });

  const navigateToCreate = () => {
    history.push('/templates/create');
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Deseja realmente deletar essa template? Olha lá o que tu vai fazer...',
      );

      if (confirmed) {
        try {
          await axios.delete(`/templates/${id}`);

          mutate(
            request.requestKey,
            {
              ...request.response,
              data: request.data?.filter(template => template._id !== id),
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
        <h1>Templates</h1>
        <Button onClick={navigateToCreate}>
          <MdAdd size={16} color="#FFF" /> Criar template
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
          {request.data?.map(template => (
            <tr key={template._id}>
              <td>{template.title}</td>
              <td>
                <Button
                  inline
                  size="small"
                  onClick={() =>
                    history.push(`/templates/edit/${template._id}`)
                  }
                >
                  Editar
                </Button>
                <Button
                  inline
                  size="small"
                  color="danger"
                  onClick={() => handleDelete(template._id)}
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

export default Templates;
