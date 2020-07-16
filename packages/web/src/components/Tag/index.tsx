import styled from 'styled-components';

interface TagProps {
  color?: string;
}

export default styled.span<TagProps>`
  background: ${props => props.color || '#FF79C6'};
  color: #fff;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  display: inline-block;
  font-weight: bold;
  text-transform: uppercase;
`;
