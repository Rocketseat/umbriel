import styled from 'styled-components';
import Creatable from 'react-select/creatable';
import { shade } from 'polished';

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

  > span {
    color: #CE4A4A;
    display: block;
    margin-top: 5px;
  }
`;

export const Select = styled(Creatable)`
  .react-select__control {
    margin-bottom: 10px;
    background: #15121E;
    border: 2px solid #15121E;
    color: #E1E1E6;
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
    background: #15121E;
    border: 2px solid #15121E;
  }

  .react-select__option {
    background: #201B2D;

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

  .react-select__single-value {
    color: #E1E1E6;
  }

  .react-select__multi-value__label {
    color: #E1E1E6;
    font-family: Roboto;
    font-weight: bold;
    font-size: 10px;
    text-transform: uppercase;
  }

  .react-select__multi-value__remove {
    color: #E1E1E6;

    &:hover {
      background: ${props => shade(0.1, '#252131')};
      color: #E1E1E6;
    }
  }

  .react-select__input input {
    color: #E1E1E6;
  }
`;