import React from 'react';
import { NavLink } from 'react-router-dom';

import { MdAccountCircle } from 'react-icons/md';
import { Container, Nav, Profile } from './styles';
import logo from '../../assets/logo-u.svg';

const Sidebar: React.FC = () => {
  return (
    <Container>
      <img src={logo} alt="Umbriel" />

      <Nav>
        <NavLink to="/contacts">Contatos</NavLink>
        <NavLink to="/messages">Mensagens</NavLink>
        <NavLink to="/templates">Templates</NavLink>
        <NavLink to="/senders">Remetentes</NavLink>
      </Nav>

      <Profile>
        <MdAccountCircle size={24} color="#FFF" />
        <span>Rocketseat</span>
      </Profile>
    </Container>
  );
};

export default Sidebar;
