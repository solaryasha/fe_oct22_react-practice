import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import { PreparedPhoto } from './types/PreparedPhoto';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const preparedPhotos: PreparedPhoto[] = photosFromServer.map(photo => {
  const album = albumsFromServer.find(photoAlbum => (
    photoAlbum.id === photo.albumId
  ));
  const user = usersFromServer.find(albumsOwner => (
    albumsOwner.id === album?.userId
  ));

  return (
    {
      ...photo,
      album,
      user,
    }
  );
});

export const App: React.FC = () => {
  const [photos] = useState(preparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');

  const resetFilters = () => {
    setSelectedUserId(0);
    setFilterQuery('');
  };

  const normalizedQuery = filterQuery.toLowerCase();

  const visiblePhotos = photos.filter(photo => {
    const normalizedPhotoTitle = photo.title.toLowerCase();
    const isQueryMatch = normalizedPhotoTitle.includes(normalizedQuery);

    const isSelectedUserIdMatch = selectedUserId !== 0
      ? selectedUserId === photo.user?.id
      : true;

    return isQueryMatch && isSelectedUserIdMatch;
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
                className={cn(
                  { 'is-active': !selectedUserId },
                )}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={cn(
                    { 'is-active': selectedUserId === user.id },
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
                  value={filterQuery}
                  onChange={event => setFilterQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setFilterQuery('')}
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
                onClick={resetFilters}
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
                        className={cn(
                          { 'has-text-link': photo.user?.sex === 'm' },
                          { 'has-text-danger': photo.user?.sex === 'f' },
                        )}
                      >
                        {photo.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
