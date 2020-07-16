import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  width: 240px;
  background: #15121e;
  border-right: 1px solid #252131;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  overflow: hidden;
`;

export const Nav = styled.nav`
  margin-top: 32px;

  a {
    color: inherit;
    display: block;
    font-weight: bold;
    text-decoration: none;
    text-transform: uppercase;
    padding: 12px 0;
    position: relative;
    opacity: 0.8;
    transition: opacity 0.2s;
    font-size: 13px;

    &.active {
      color: #fff;
    }

    &::before {
      content: '';
      height: calc(100% - 8px);
      width: 4px;
      border-radius: 0 2px 2px 0;
      display: block;
      background: #7159c1;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -28px;
      transition: left 0.2s;
    }

    &.active::before {
      left: -24px;
    }
  }
`;

export const Profile = styled.button`
  margin-top: auto;
  display: flex;
  align-items: center;
  background: transparent;
  border: 0;
  color: inherit;

  span {
    font-weight: bold;
    margin: 0 5px 0 10px;
  }
`;
