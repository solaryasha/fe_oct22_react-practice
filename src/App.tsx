import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { Photo } from './types/Photo';
import { Album } from './types/Album';
import { User } from './types/User';

function findAlbum(albumId: number): Album {
  return albumsFromServer.find(album => albumId === album.id)
  || albumsFromServer[0]; // wrong but ommits ts errors
}

function findUser(userId: number): User {
  return usersFromServer.find(user => userId === user.id)
   || usersFromServer[0]; // wrong but ommits ts errors
}

const photos: Photo[] = photosFromServer.map(photo => {
  const album = findAlbum(photo.albumId);

  return {
    ...photo,
    album,
    user: findUser(album.userId),
  };
});

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

  const searchTextByQuery = (text: string) => {
    const preparedQuery = query.toLowerCase().trim();

    return text.toLowerCase().includes(preparedQuery);
  };

  const visiblePhotos = photos.filter(photo => {
    const checkUser = userName ? photo.user.name === userName : true;
    const checkAlbum = selectedAlbums.length
      ? selectedAlbums.includes(photo.album.title) : true;

    return searchTextByQuery(photo.title) && checkUser && checkAlbum;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={classNames({
                  'is-active': !userName,
                })}
                onClick={(event) => {
                  event.preventDefault();
                  setUserName('');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  className={classNames({
                    'is-active': userName === user.name,
                  })}
                  onClick={(event: React.BaseSyntheticEvent) => {
                    event.preventDefault();
                    setUserName(event.target.innerText);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={classNames('button is-success mr-6', {
                  'is-outlined': !selectedAlbums.length,
                })}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>

              {albumsFromServer.map(category => (
                <a
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedAlbums.includes(category.title),
                  })}
                  href="#/"
                  onClick={(event: React.BaseSyntheticEvent) => {
                    event.preventDefault();
                    if (selectedAlbums.includes(category.title)) {
                      setSelectedAlbums(
                        selectedAlbums.filter(
                          categoryName => categoryName !== category.title,
                        ),
                      );

                      return;
                    }

                    setSelectedAlbums(
                      [...selectedAlbums, category.title],
                    );
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setUserName('');
                  setSelectedAlbums([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length
            ? (
              <table
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Photo name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-down" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Album name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePhotos.map(photo => (
                    <tr key={photo.id}>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>{photo.title}</td>
                      <td>{photo.album.title}</td>

                      <td className={classNames({
                        'has-text-link': photo.user.sex === 'm',
                        'has-text-danger': photo.user.sex === 'f',
                      })}
                      >
                        {photo.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            : (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
