import styled from 'styled-components';

export const Container = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 30px;

  > header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    form {
      display: flex;
      flex-direction: row;
      margin-left: auto;
      margin-right: 20px;

      button svg {
        margin: 0;
      }

      input {
        margin-right: 5px;
        background: #15121e;
        border: 2px solid #15121e;
        color: #e1e1e6;
        border-radius: 4px;
        padding: 5px 12px;
        transition: border-color 0.2s;
        font-size: 14px;

        &:focus {
          border-color: #7159c1;
        }
      }
    }
  }
`;
