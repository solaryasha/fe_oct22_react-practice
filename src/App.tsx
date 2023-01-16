import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

import {
  User,
  Album,
  PreparedPhoto,
} from './types/types';

function getAlbumById(albumId: number): Album | null {
  return albumsFromServer.find(album => album.id === albumId) || null;
}

function getUserById(userId: number): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

const preparedPhotos: PreparedPhoto[] = photosFromServer.map(photo => {
  const album = getAlbumById(photo.albumId);
  const user = album
    ? getUserById(album.userId)
    : null;

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const [photos, setPhotos] = useState(preparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<number[]>([]);

  let visiblePhotos = photos;

  if (selectedUserId) {
    visiblePhotos = visiblePhotos.filter(photo => (
      photo.user?.id === selectedUserId
    ));
  }

  if (inputQuery) {
    const validQuery = inputQuery.toLowerCase().trim();

    visiblePhotos = visiblePhotos.filter(photo => (
      photo.title.toLowerCase().includes(validQuery)
    ));
  }

  if (selectedAlbumIds.length) {
    visiblePhotos = visiblePhotos.filter(photo => {
      return photo.album !== null
        ? selectedAlbumIds.includes(photo.album?.id)
        : photo;
    });
  }

  const filterByAlbum = (id: number) => {
    let newAlbums;

    if (selectedAlbumIds.includes(id)) {
      newAlbums = selectedAlbumIds
        .filter(albumId => albumId !== id);
    } else {
      newAlbums = [...selectedAlbumIds];
      newAlbums.push(id);
    }

    setSelectedAlbumIds(newAlbums);
  };

  const moveDown = (index: number) => {
    setPhotos(prev => {
      if (index === prev.length - 1) {
        return prev;
      }

      const newVisiblePhotos = [...prev];
      const currentPhoto = newVisiblePhotos[index];

      newVisiblePhotos[index] = newVisiblePhotos[index + 1];
      newVisiblePhotos[index + 1] = currentPhoto;

      return newVisiblePhotos;
    });
  };

  const moveUp = (index: number) => {
    setPhotos(prev => {
      if (index === 0) {
        return prev;
      }

      const newVisiblePhotos = [...prev];
      const currentPhoto = newVisiblePhotos[index];

      newVisiblePhotos[index] = newVisiblePhotos[index - 1];
      newVisiblePhotos[index - 1] = currentPhoto;

      return newVisiblePhotos;
    });
  };

  const resetAllFilters = () => {
    visiblePhotos = photos;
    setSelectedUserId(0);
    setInputQuery('');
    setSelectedAlbumIds([]);
  };

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
                onClick={() => setSelectedUserId(0)}
                className={classNames({
                  'is-active': selectedUserId === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}
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
                  value={inputQuery}
                  onChange={(event) => setInputQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {inputQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setInputQuery('')}
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
                    'is-outlined': selectedAlbumIds.length
                      && selectedAlbumIds.length !== albumsFromServer.length,
                  },
                )}
                onClick={() => setSelectedAlbumIds([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedAlbumIds.includes(album.id),
                    },
                  )}
                  href="#/"
                  key={album.id}
                  onClick={() => filterByAlbum(album.id)}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
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

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Reordering
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePhotos.map((photo, index) => (
                    <tr key={photo.id}>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>{photo.title}</td>
                      <td>{photo.album?.title}</td>

                      <td
                        className={classNames({
                          'has-text-link': photo.user?.sex === 'm',
                          'has-text-danger': photo.user?.sex === 'f',
                        })}
                      >
                        {photo.user?.name}
                      </td>
                      <button
                        type="button"
                        className="button"
                        onClick={() => moveDown(index)}
                      >
                        &darr;
                      </button>

                      <button
                        type="button"
                        className="button"
                        onClick={() => moveUp(index)}
                      >
                        &uarr;
                      </button>
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
