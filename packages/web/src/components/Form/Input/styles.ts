import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 16px;
  }

  > small {
    font-size: 13px;
    display: block;
    margin-bottom: 11px;
    opacity: 0.6;
  }

  > input,
  > textarea {
    display: block;
    resize: vertical;
    margin-top: 3px;
    background: #15121e;
    border: 2px solid #15121e;
    color: #e1e1e6;
    border-radius: 4px;
    padding: 12px 15px;
    width: 100%;
    transition: border-color 0.2s;

    &:focus {
      border-color: #7159c1;
    }

    &[disabled] {
      cursor: not-allowed;
      background: #201b2d;
    }
  }

  > textarea {
    min-height: 200px;
  }

  > span {
    color: #ce4a4a;
    display: block;
    margin-top: 5px;
  }
`;
