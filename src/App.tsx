import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { FullPhotos } from './types/AllTypes';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

export const App: React.FC = () => {
  const [ownerSelect, setOwnerSelect] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getPreparedPhotos: FullPhotos[] = photosFromServer
    .map(photo => {
      const findAlbumTitle = albumsFromServer
        .find(album => album.id === photo.albumId);

      const findUserName = usersFromServer
        .find(user => user.id === findAlbumTitle?.userId);

      return {
        ...photo,
        albumTitle: findAlbumTitle,
        userName: findUserName,
      };
    });

  const visiblePhotos = getPreparedPhotos.filter(photo => {
    if (ownerSelect === 'All') {
      return photo.title.toLowerCase()
        .includes(searchQuery.toLowerCase());
    }

    return photo.userName?.name === ownerSelect
      && photo.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const clearAllFilters = () => {
    setOwnerSelect('All');
    setSearchQuery('');
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
                className={classNames({
                  'is-active': ownerSelect === 'All',
                })}
                onClick={() => setOwnerSelect('All')}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    href="#/"
                    className={classNames({
                      'is-active': ownerSelect === user.name,
                    })}
                    onClick={() => setOwnerSelect(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
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
                onClick={clearAllFilters}
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
                  <td key={photo.id} className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.albumTitle?.title}</td>

                  <td className={classNames({
                    'has-text-link': photo.userName?.sex === 'm',
                    'has-text-danger': photo.userName?.sex === 'f',
                  })}
                  >
                    {photo.userName?.name}
                  </td>
                </tr>
              ))}

            </tbody>
            ;
          </table>
        </div>
      </div>
    </div>
  );
};
