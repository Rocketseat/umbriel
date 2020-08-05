import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #191622;
    color: #E1E1E6;
    font: 14px Roboto, sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }

  button {
    font: inherit;
  }

  input, textarea {
    font-size: 16px;
  }

  #app {
    display: flex;
    align-items: stretch;
  }

  h1, h2, h3, h4, h5 {
    color: #E1E1E6;
  }
`;
