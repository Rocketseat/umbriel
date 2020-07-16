import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input } from '../../components/Form';
import Button from '../../components/Button';
import axios from '../../services/axios';

import logoImg from '../../assets/logo-full.svg';

import { Container, Content } from './styles';

type Props = RouteComponentProps;

const SignIn: React.FC<Props> = ({ history }) => {
  const handleSingIn = useCallback(
    async data => {
      try {
        const response = await axios.post('/sessions', data);

        localStorage.setItem('@Umbriel:token', response.data.token);
        localStorage.setItem(
          '@Umbriel:user',
          JSON.stringify(response.data.user),
        );

        history.push('/contacts');
      } catch (err) {
        alert('Erro no login');
      }
    },
    [history],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="Umbriel" />

        <Form onSubmit={handleSingIn}>
          <Input label="E-mail" name="email" />
          <Input type="password" label="Senha" name="password" />

          <Button size="big" type="submit">
            Entrar
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default SignIn;
