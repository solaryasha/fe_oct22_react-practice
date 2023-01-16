import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

function findUserById(id: number) {
  return usersFromServer.find(user => user.id === id);
}

function getPreparedAlbums() {
  return albumsFromServer.map(album => (
    {
      ...album,
      user: findUserById(album.userId),
    }
  ));
}

const getPreparedPhotos = photosFromServer.map(photo => {
  const preparedAlbums = getPreparedAlbums();

  const album = preparedAlbums.find(alb => alb.id === photo.albumId);

  return {
    ...photo,
    album,
  };
});

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const visiblePhotos = photos.filter(photo => {
    const filterByName = selectedUserId !== 0
      ? photo.album?.userId === selectedUserId
      : true;

    const filterByInput = photo.title.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return filterByInput && filterByName;
  });

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedUserId(0);
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
                className={cn({ 'is-active': selectedUserId === 0 })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': user.id === selectedUserId })}
                  href="#/"
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
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
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
                onClick={resetAllFilters}
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

          {visiblePhotos.length !== 0 && (
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
                      className={cn(
                        {
                          'has-text-link': photo.album?.user?.sex === 'm',
                          'has-text-danger': photo.album?.user?.sex === 'f',
                        },
                      )}
                    >
                      {photo.album?.user?.name}
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
