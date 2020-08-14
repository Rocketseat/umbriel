import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import Contacts from '../pages/Contacts';

import MessageList from '../pages/MessageList';
import MessageForm from '../pages/MessageForm';
import MessageDetail from '../pages/MessageDetail';

import TemplateList from '../pages/TemplateList';
import TemplateForm from '../pages/TemplateForm';

import SenderList from '../pages/SenderList';
import SenderForm from '../pages/SenderForm';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route isPrivate path="/contacts" exact component={Contacts} />

      <Route isPrivate path="/messages" exact component={MessageList} />
      <Route isPrivate path="/messages/create" exact component={MessageForm} />
      <Route
        isPrivate
        path="/messages/show/:id"
        exact
        component={MessageDetail}
      />

      <Route isPrivate path="/templates" exact component={TemplateList} />
      <Route
        isPrivate
        path="/templates/create"
        exact
        component={TemplateForm}
      />
      <Route
        isPrivate
        path="/templates/edit/:id"
        exact
        component={TemplateForm}
      />

      <Route isPrivate path="/senders" exact component={SenderList} />
      <Route isPrivate path="/senders/create" exact component={SenderForm} />
      <Route isPrivate path="/senders/edit/:id" exact component={SenderForm} />
    </Switch>
  );
};

export default Routes;
