import styled from 'styled-components';

export const Container = styled.main`
  width: 100%;
  padding: 30px;

  > header {
    display: flex;
    margin-bottom: 15px;

    > h1 {
      margin-right: auto;
    }

    button {
      margin-left: 10px;
    }
  }

  > div {
    > strong {
      display: block;
      font-size: 14px;
      opacity: 0.7;
      margin-bottom: 5px;

      &:not(:first-child) {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #252131;
      }
    }
  }
`;

export const MessageContent = styled.div`
  background: #fff;
  color: #222;
  padding: 12px 15px;
  width: 100%;
  margin-top: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: initial;
  border: 1px solid #eee;
  border-radius: 4px;

  h1,
  h2,
  h3,
  h4,
  h5 {
    color: inherit;
  }
`;
