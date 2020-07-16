import React, { useMemo } from 'react';
import { PaginatedRequest } from '../../services/usePaginatedRequest';

import { DataTable, Pagination, Loading } from './styles';
import Button from '../Button';

interface Props {
  request: PaginatedRequest<unknown, unknown>;
  children: React.ReactNode;
}

const PaginatedTable: React.FC<Props> = ({ request, children }) => {
  const {
    data,
    response,
    hasPreviousPage,
    hasNextPage,
    loadPrevious,
    loadNext,
  } = request;

  const numberOfRegisters = useMemo(() => response?.headers['x-total-count'], [
    response,
  ]);

  const numberOfPages = useMemo(() => response?.headers['x-total-page'], [
    response,
  ]);

  return (
    <>
      {data && (
        <Pagination>
          <p>
            <span>
              {numberOfRegisters}
              registro(s)
            </span>
            <span>
              {numberOfPages}
              página(s)
            </span>
          </p>

          <nav>
            <Button
              size="small"
              disabled={!hasPreviousPage}
              onClick={loadPrevious}
            >
              Anterior
            </Button>
            <Button size="small" disabled={!hasNextPage} onClick={loadNext}>
              Próxima
            </Button>
          </nav>
        </Pagination>
      )}

      {data ? (
        <DataTable>{children}</DataTable>
      ) : (
        <Loading>Carregando dados...</Loading>
      )}
    </>
  );
};

export default PaginatedTable;
