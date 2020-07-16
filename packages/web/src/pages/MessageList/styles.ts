import styled from 'styled-components';

interface ProgressProps {
  total: number;
  current: number;
}

export const Container = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 30px;

  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
`;

export const ProgressBar = styled.div<ProgressProps>`
  height: 20px;
  width: 100%;
  border-radius: 4px;
  background: #999;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 13px;
    line-height: 21px;
    z-index: 5;
    color: #fff;
    font-weight: bold;
  }

  &::before {
    content: '';
    width: ${props => (props.current * 100) / props.total}%;
    max-width: 100%;
    height: 100%;
    border-radius: 4px;
    position: absolute;
    left: 0;
    top: 0;
    background: #ff79c6;
  }
`;
