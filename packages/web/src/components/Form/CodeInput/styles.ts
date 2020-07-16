import styled from 'styled-components';

export const Container = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Fira+Code:500&display=swap');

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

  .editor {
    min-height: 200px;
    display: block;
    margin-bottom: 15px;
    resize: vertical;
    margin-top: 3px;
    background: #15121e;
    border: 2px solid #15121e;
    color: #fff;
    border-radius: 4px;
    padding: 12px 15px;
    width: 100%;
    transition: border-color 0.2s;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Fira Code';
    font-weight: 500;

    &:focus {
      border-color: #7159c1;
    }

    .editorLineNumber {
      position: absolute;
      left: 0px;
      color: #cccccc;
      text-align: right;
      width: 40px;
      font-weight: 100;
    }

    textarea,
    pre {
      outline: none;
      padding-left: 60px !important;
    }
  }

  > span {
    color: #ce4a4a;
    display: block;
    margin-top: 5px;
  }
`;
