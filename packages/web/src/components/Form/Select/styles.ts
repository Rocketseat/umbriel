import styled from 'styled-components';
import ReactSelect from 'react-select';
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
    color: #ce4a4a;
    display: block;
    margin-top: 5px;
  }
`;

export const Select = styled(ReactSelect)`
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

  .react-select__single-value {
    color: #e1e1e6;
  }

  .react-select__multi-value__label {
    color: #e1e1e6;
    font-family: Roboto;
    font-weight: bold;
    font-size: 10px;
    text-transform: uppercase;
  }

  .react-select__multi-value__remove {
    color: #e1e1e6;

    &:hover {
      background: ${props => shade(0.1, '#252131')};
      color: #e1e1e6;
    }
  }

  .react-select__input input {
    color: #e1e1e6;
  }
`;
