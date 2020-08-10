import React, {
  useMemo,
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  useRef,
} from 'react';
import { format, parseISO } from 'date-fns';
import {
  MdFileUpload,
  MdSearch,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import Modal from 'react-modal';

import debounce from 'lodash.debounce';
import { mutate } from 'swr';
import api from '../../services/axios';
import usePaginatedRequest from '../../services/usePaginatedRequest';

import { Container } from './styles';
import Tag from '../../components/Tag';
import Button from '../../components/Button';
import PaginatedTable from '../../components/PaginatedTable';

import Import from './Import';

Modal.setAppElement('#root');

interface Contact {
  _id: string;
  email: string;
  createdAt: string;
  subscribed: true;
  tags: Array<{
    _id: string;
    title: string;
  }>;
}

const Contacts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const debouncedSetSearch = useRef(debounce(setSearch, 500)).current;

  const request = usePaginatedRequest<Contact[]>({
    url: '/contacts',
    params: {
      search,
    },
  });

  const contacts = useMemo(() => {
    if (!request.data) {
      return [];
    }

    return request.data.map(contact => ({
      ...contact,
      createdAtFormatted: format(
        parseISO(contact.createdAt),
        "dd/MM/yyyy HH:mm'h'",
      ),
      tags: contact.tags.map(tag => <Tag key={tag._id}>{tag.title}</Tag>),
    }));
  }, [request.data]);

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch],
  );

  const handleSubmitSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      request.revalidate();
    },
    [request],
  );

  const changeContactSubscriptionStatus = useCallback(
    async (contact_id: string, subscribed: boolean) => {
      await api.patch<Contact>(`/contacts/${contact_id}/subscription`, {
        subscribed,
      });

      mutate(
        request.requestKey,
        {
          ...request.response,
          data: request.data?.map(contact => {
            if (contact._id === contact_id) {
              return { ...contact, subscribed };
            }

            return contact;
          }),
        },
        false,
      );
    },
    [request.data, request.requestKey, request.response],
  );

  const handleRemoveSubscription = useCallback(
    (contact_id: string) => {
      changeContactSubscriptionStatus(contact_id, false);
    },
    [changeContactSubscriptionStatus],
  );

  const handleAddSubscription = useCallback(
    (contact_id: string) => {
      changeContactSubscriptionStatus(contact_id, true);
    },
    [changeContactSubscriptionStatus],
  );

  return (
    <>
      <Container>
        <header>
          <h1>Contatos</h1>
          <form onSubmit={handleSubmitSearch}>
            <input
              type="text"
              onChange={handleSearchInputChange}
              value={searchInput}
              placeholder="Buscar contato"
            />
            <Button color="secundary" type="submit">
              <MdSearch size={16} color="#FFF" />
            </Button>
          </form>
          <Button onClick={() => setIsModalOpen(true)}>
            <MdFileUpload size={16} color="#FFF" /> Importar CSV
          </Button>
        </header>
        <PaginatedTable request={request}>
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Data de inscrição</th>
              <th>Tags</th>
              <th style={{ textAlign: 'center' }}>Inscrito</th>
              <th style={{ width: 180 }} />
            </tr>
          </thead>
          <tbody>
            {contacts?.map(contact => (
              <tr key={contact._id}>
                <td>{contact.email}</td>
                <td>{contact.createdAtFormatted}</td>
                <td>{contact.tags}</td>
                <td style={{ textAlign: 'center' }}>
                  {contact.subscribed ? (
                    <MdCheckCircle color="#67e480" size={16} />
                  ) : (
                    <MdCancel color="#E96379" size={16} />
                  )}
                </td>
                <td>
                  {contact.subscribed ? (
                    <Button
                      inline
                      size="small"
                      onClick={() => handleRemoveSubscription(contact._id)}
                    >
                      Remover inscrição
                    </Button>
                  ) : (
                    <Button
                      inline
                      size="small"
                      onClick={() => handleAddSubscription(contact._id)}
                    >
                      Adicionar inscrição
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </Container>

      <Modal
        style={{
          overlay: {
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            position: 'relative',
            width: 400,
            top: 'auto',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            background: '#191622',
            border: 0,
            overflow: 'visible',
          },
        }}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Import closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Contacts;
