import React from 'react';
import { PaginatedRequest } from '../../services/usePaginatedRequest';

import { DataTable, Pagination, Loading } from './styles';
import Button from '../Button';

interface Props {
  request: PaginatedRequest<unknown, unknown>;
  children: React.ReactNode;
}

const PaginatedTable: React.FC<Props> = ({ request, children }) => {
  const { data, response, hasPreviousPage, hasNextPage, loadPrevious, loadNext } = request;

  return (
    <>
      { data && (
        <Pagination>
          <p>
            <span>{response?.headers['x-total-count']} registro(s)</span>
            <span>{response?.headers['x-total-page']} página(s)</span>
          </p>

          <nav>
            <Button size="small" disabled={!hasPreviousPage} onClick={loadPrevious}>Anterior</Button>
            <Button size="small" disabled={!hasNextPage} onClick={loadNext}>Próxima</Button>
          </nav>
        </Pagination>
      )}

      {
        data ? (
          <DataTable>
            {children}
          </DataTable>
        ) : (
          <Loading>Carregando dados...</Loading>
        )
      }
    </>
  );
}

export default PaginatedTable;