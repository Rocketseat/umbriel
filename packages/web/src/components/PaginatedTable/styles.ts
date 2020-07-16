import styled from 'styled-components';

export const DataTable = styled.table`
  width: 100%;

  th {
    padding: 12px;
    text-align: left;
  }

  tr {
    td {
      vertical-align: middle;
      padding: 12px;
      border-top: 1px solid #252131;

      h3 {
        margin: 0;
        font-weight: 500;
      }

      span {
        margin-right: 5px;
      }

      &:last-child button {
        margin-left: 8px;
      }
    }

    &.no-border td {
      border: 0;
      padding-top: 0;
    }
  }
`;

export const Loading = styled.p`
  text-align: center;
  margin: 30px 0;
`;

export const Pagination = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;

  > p {
    opacity: 0.8;

    span + span {
      border-left: 1px solid #252131;
      padding-left: 10px;
      margin-left: 10px;
    }
  }

  nav {
    display: flex;

    button {
      margin-left: 5px;
    }
  }
`;
