import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

import { Album, User, PreparedPhotos } from './types/types';

function getAlbumById(id: number): Album | null {
  return albumsFromServer.find(album => album.id === id) || null;
}

function getUserById(id: number | undefined): User | null {
  return usersFromServer.find(user => user.id === id) || null;
}

const preparedPhotos: PreparedPhotos[] = photosFromServer.map(photo => {
  const foundAlbum = getAlbumById(photo.albumId);
  const foundUser = getUserById(foundAlbum?.userId);

  return {
    ...photo,
    album: foundAlbum,
    user: foundUser,
  };
});

export const App: React.FC = () => {
  const [photos] = useState(preparedPhotos);
  const [selectedUserID, setSelectedUserID] = useState(0);
  const [query, setQuery] = useState('');

  let visiblePhotos = [...photos];

  if (selectedUserID) {
    visiblePhotos = visiblePhotos.filter(photo => (
      photo.user?.id === selectedUserID
    ));
  }

  if (query) {
    visiblePhotos = visiblePhotos.filter(photo => {
      const productName = photo.title.toLowerCase();

      const normalizedQuery = query
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .join(' ');

      return productName.includes(normalizedQuery);
    });
  }

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
                onClick={() => setSelectedUserID(0)}
                className={classNames(
                  {
                    'is-active': selectedUserID === 0,
                  },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserID(user.id)}
                  className={classNames(
                    {
                      'is-active': user.id === selectedUserID,
                    },
                  )}
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
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Album 1
              </a>

              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 2
              </a>

              <a
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Album 3
              </a>
              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 4
              </a>
              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 5
              </a>
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setSelectedUserID(0);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          )}

          {visiblePhotos.length > 0 && (
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
                  <tr>
                    <td className="has-text-weight-bold">
                      {photo.id}
                    </td>

                    <td>{photo.title}</td>
                    <td>{photo.album?.title}</td>

                    <td
                      className={classNames(
                        {
                          'has-text-link': photo.user?.sex === 'm',
                          'has-text-danger': photo.user?.sex === 'f',
                        },
                      )}
                    >
                      {photo.user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};
