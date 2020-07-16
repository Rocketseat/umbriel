import styled from 'styled-components';
import { shade } from 'polished';
import Creatable from 'react-select/async-creatable';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
  }

  form {
    margin-top: 20px;

    label {
      display: block;
      margin-bottom: 5px;
    }

    > span {
      font-size: 12px;
      display: block;
      font-style: italic;
      margin-bottom: 8px;
      opacity: 0.7;
    }

    > input {
      display: block;
      margin-bottom: 10px;
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
    }

    button {
      margin-top: 20px;
      width: 100%;
    }
  }
`;

export const Select = styled(Creatable)`
  .react-select__control {
    margin-bottom: 10px;
    background: #15121e;
    border: 2px solid #15121e;
    color: #e1e1e6;
    padding: 2px 8px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: none;

    &:hover {
      border-color: #7159c1;
    }
  }

  .react-select__control--is-focused {
    border-color: #7159c1 !important;
    box-shadow: none;
  }

  .react-select__indicator-separator {
    background: #252131;
  }

  .react-select__menu {
    background: #15121e;
    border: 2px solid #15121e;
  }

  .react-select__option {
    background: #201b2d;

    padding: 10px 15px;

    &:active {
      background: #252131;
    }
  }

  .react-select__option--is-focused {
    background: #252131;
  }

  .react-select__multi-value {
    background: #252131;
  }

  .react-select__multi-value__label {
    color: #fff;
    font-family: Roboto;
    font-weight: bold;
    font-size: 10px;
    text-transform: uppercase;
  }

  .react-select__multi-value__remove {
    color: #fff;

    &:hover {
      background: ${props => shade(0.1, '#252131')};
      color: #fff;
    }
  }

  .react-select__input input {
    color: #e1e1e6;
  }
`;
