import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import { FullPhoto } from './api/types';
import albumsFromServer from './api/albums';

export const getPrepeatedPhotos: FullPhoto[]
  = photosFromServer.map((photo) => {
    const album = albumsFromServer.find((albom) => albom.id === photo.albumId);
    const user = usersFromServer.find((u) => u.id === album?.id);

    return {
      ...photo,
      album,
      user,
    };
  });

export const App: React.FC = () => {
  const [photos] = useState(getPrepeatedPhotos);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);

  const visiblePhotos = photos.filter(photo => {
    const { title } = photo;

    const searchQuearyMatch = title.toLowerCase().includes(
      search.toLowerCase(),
    );

    const matthedpHoto = selectedUserId
      ? photo.album?.id === selectedUserId
      : true;

    return searchQuearyMatch && matthedpHoto;
  });

  const resetFilters = () => {
    setSearch('');
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
                href="#/"
                className={cn({
                  'is-active': selectedUserId === 0,

                })}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  href="#/"
                  className={cn({
                    'is-active': selectedUserId === user.id,

                  })}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                (
                {search && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  </span>
                )}
                )
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albumsFromServer.map((albums) => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={albums.id}
                >
                  {albums.title}
                </a>
              ))}

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
          <p data-cy="NoMatchingMessage">
            No photos matching selected criteria
          </p>

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

              {visiblePhotos.map((photo) => (
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td
                    className={cn({
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
        </div>
      </div>
    </div>
  );
};
