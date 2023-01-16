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

const photos: PreparedPhoto[] = photosFromServer.map(photo => {
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
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [inputQuery, setInputQuery] = useState('');

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

  const resetAllFilters = () => {
    visiblePhotos = photos;
    setSelectedUserId(0);
    setInputQuery('');
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
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={album.id}
                >
                  {album.title}
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
                  </tr>
                </thead>

                <tbody>
                  {visiblePhotos.map(photo => (
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
