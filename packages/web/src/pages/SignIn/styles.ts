import styled from 'styled-components';

export const Container = styled.div`
  background: #191622;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 320px;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 320px;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  img {
    margin-bottom: 30px;
  }
`;
