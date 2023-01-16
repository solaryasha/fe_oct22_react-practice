import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { FullPhoto } from './types/photo';

function findUserById(userId?: number) {
  return usersFromServer.find(user => user.id === userId);
}

function findAlbumById(albumId: number) {
  return albumsFromServer
    .find(album => albumId === album.id);
}

const photos: FullPhoto[] = photosFromServer.map(photo => {
  const albumById = findAlbumById(photo.albumId);
  const user = findUserById(albumById?.userId);

  return {
    ...photo,
    album: albumById,
    user,
  };
});

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [selectedAlbumById, setSelectedAlbumById]
    = useState<number[]>([]);

  let copyPhoto = [...photos];

  if (selectedUserId) {
    copyPhoto = copyPhoto.filter(
      photo => photo.user?.id === selectedUserId,
    );
  }

  if (query !== '') {
    const lowQuery = query.toLowerCase();

    copyPhoto = copyPhoto.filter(photo => (
      photo.title.toLowerCase().includes(lowQuery)
    ));
  }

  if (selectedAlbumById.length > 0) {
    copyPhoto = copyPhoto.filter(photo => (
      selectedAlbumById.includes(photo.albumId)
    ));
  }

  function handleAlbums(albumId: number) {
    const selectedAlbum = [...selectedAlbumById];

    if (selectedAlbum.includes(albumId)) {
      const id = selectedAlbum.indexOf(albumId);

      selectedAlbum.splice(id, 1);
    } else {
      selectedAlbum.push(albumId);
    }

    return selectedAlbum;
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
                className={classNames(
                  { 'is-active': selectedUserId === null },
                )}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  className={classNames(
                    { 'is active': user.id === selectedUserId },
                  )}
                  onClick={() => setSelectedUserId(user.id)}
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
                  onChange={(event) => setQuery(event.target.value)}
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
                className={classNames(
                  'button is-success mr-6',
                  {
                    'is-outlined': selectedAlbumById.length > 0,
                  },
                )}
                onClick={() => setSelectedAlbumById([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedAlbumById.includes(album.id),
                    },
                  )}
                  href="#/"
                  onClick={() => setSelectedAlbumById(
                    handleAlbums(album.id),
                  )}
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUserId(null);
                  setQuery('');
                  setSelectedAlbumById([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {copyPhoto.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          )}

          <table
            className="table is-striped is-narrow is-fullwidth"
          >

            {copyPhoto.length > 0 && (
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
            )}

            <tbody>
              {copyPhoto.map(photo => (
                <tr>
                  <td
                    className="has-text-weight-bold"
                  >
                    {photo.id}
                  </td>

                  <td>
                    {photo.title}
                  </td>
                  <td>
                    {`${photo.album?.title}`}
                  </td>

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
        </div>
      </div>
    </div>
  );
};
