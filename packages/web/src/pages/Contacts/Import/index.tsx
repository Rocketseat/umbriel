import React, { useRef, useCallback, useState } from 'react';
import { OptionTypeBase } from 'react-select';
import axios from '../../../services/axios';

import Button from '../../../components/Button';

import { Container, Select } from './styles';

interface Tag {
  title: string;
}

interface Props {
  closeModal(): void;
}

const Import: React.FC<Props> = ({ closeModal }) => {
  const [tags, setTags] = useState<OptionTypeBase[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadTags = useCallback(async search => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = await axios.get<Tag[]>('/tags', {
      params: { search },
    });

    return response.data.map(tag => ({
      value: tag.title,
      label: tag.title,
    }));
  }, []);

  const handleImport = useCallback(
    async e => {
      e.preventDefault();

      setLoading(true);

      try {
        const selectedTags = tags.map(tag => tag.value).join(', ');
        const file = fileRef.current?.files?.[0];

        if (!selectedTags) {
          return;
        }

        if (!file) {
          return;
        }

        const formData = new FormData();

        formData.append('tags', selectedTags);
        formData.append('file', file);

        await new Promise(resolve => setTimeout(resolve, 2000));

        await axios.post('/contacts/import', formData);

        closeModal();
      } catch (err) {
        setLoading(false);
        alert('Erro ao realizar importação de contatos');
      }
    },
    [closeModal, tags],
  );

  return (
    <Container>
      <h2>Importar contatos</h2>

      <form onSubmit={handleImport}>
        <label htmlFor="tags">Tags</label>
        <span>Você pode criar novas tags</span>
        <Select
          isMulti
          loadOptions={loadTags}
          classNamePrefix="react-select"
          placeholder="Selecione as tags..."
          cacheOptions
          defaultOptions
          loadingMessage={() => 'Carregando tags...'}
          formatCreateLabel={(value: string) => `Criar tag "${value}"`}
          value={tags}
          onChange={setTags}
        />

        <label htmlFor="file">Arquivo CSV</label>
        <input
          required
          accept=".csv"
          ref={fileRef}
          type="file"
          name="file"
          id="file"
        />

        <Button loading={loading} size="big" type="submit">
          Realizar importação
        </Button>
      </form>
    </Container>
  );
};

export default Import;
