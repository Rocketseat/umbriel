import styled, { css } from 'styled-components';
import { shade, tint } from 'polished';

interface Props {
  size?: 'small' | 'default' | 'big';
  color?: 'primary' | 'secundary' | 'cancel' | 'danger';
  loading?: boolean;
  inline?: boolean;
}

const sizes = {
  small: css`
    padding: 4px 8px;
    font-size: 12px;
  `,
  default: css`
    padding: 6px 12px;
    font-size: 14px;
  `,
  big: css`
    padding: 14px 20px;
    font-size: 15px;
  `,
};

const colors = {
  primary: css`
    background: #7159c1;
    color: #fff;

    &:hover {
      background: ${shade(0.1, '#7159c1')};
    }
  `,
  secundary: css`
    background: #ff79c6;
    color: #fff;

    &:hover {
      background: ${shade(0.1, '#FF79C6')};
    }
  `,
  danger: css`
    background: #e96379;
    color: #fff;

    &:hover {
      background: ${shade(0.1, '#E96379')};
    }
  `,
  cancel: css`
    background: transparent;
    border: 2px solid ${props => tint(0.3, '#7159c1')};
    color: ${props => tint(0.3, '#7159c1')};

    &:hover {
      background: transparent;
      color: #7159c1;
      border-color: #7159c1;
    }
  `,
};

const ButtonStyled = styled.button.attrs<Props>(props => ({
  disabled: props.disabled || !!props.loading,
  loading: props.loading ? 1 : 0,
}))<Props>``;

export default styled(ButtonStyled)`
  background: #7159c1;
  border: 0;
  border-radius: 4px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-block' : 'flex')};
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    margin-right: 5px;
  }

  ${props => (props.size ? sizes[props.size] : sizes.default)}
  ${props => (props.color ? colors[props.color] : colors.primary)}
`;
