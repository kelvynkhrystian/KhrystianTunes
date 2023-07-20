import React, { ChangeEvent, useState } from 'react';
import searchAlbumsAPI, { SearchResult } from '../services/searchAlbumsAPI';

import Header from '../components/Header';
import Loading from '../components/Loading';
import {
  SearchPage,
  SearchInput,
  SearchList,
  SearchButton,
  AlbumCard,
} from '../styles/pages/SeachStyles';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(true);
  const [list, setList] = useState(false);
  const [api, setApi] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState('');

  const SimlateLoading = () => {
    setTimeout(() => {
      setList(true);
      setLoading(false);
    }, 500);
  };

  const InputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    value.length < 2 || value.length > 15 ? setbutton(true) : setbutton(false);
    setSearchText(value);
  };

  const SearchApi = async (search: string) => {
    try {
      const listApi = await searchAlbumsAPI(search);
      setApi(listApi);
    } catch (error) {
      console.error('Erro na busca de álbuns:', error);
      setApi([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !button) {
      SearchClick();
    }
  };

  const SearchClick = () => {
    setLoading(true);
    setList(false);
    SimlateLoading();
    SearchApi(searchText);
    setSearching(searchText);
    setSearchText('');
  };

  return (
    <>
      <Header />
      <SearchPage>
        <SearchInput>
          <input
            type="text"
            value={searchText}
            onChange={InputChange}
            placeholder="Busque um artista ou banda"
            onKeyDown={handleKeyDown}
          />
          <SearchButton type="button" disabled={button} onClick={SearchClick}>
            Pesquisar
          </SearchButton>
        </SearchInput>
        <SearchList>
          {loading && <Loading />}
          {list ? (
            <section>
              <p>
                Resultado de álbuns de: <strong>{` ${searching}`}</strong>
              </p>
              <article>
                {api.length > 0 ? (
                  api.map((album) => (
                    <AlbumCard key={album.collectionId}>
                      <img src={album.artworkUrl100} alt="album" />
                      <p>{album.collectionName.slice(0, 10)}</p>
                      <h4>{album.artistName.slice(0, 10)}</h4>
                      <Link
                        key={album.collectionId}
                        to={`/album/${album.collectionId}`}
                      >
                        Album
                      </Link>
                    </AlbumCard>
                  ))
                ) : (
                  <p>Nenhum álbum foi encontrado</p>
                )}
              </article>
            </section>
          ) : null}
        </SearchList>
      </SearchPage>
    </>
  );
};

export default Search;
