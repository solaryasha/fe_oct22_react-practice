import './App.scss';
import classNames from 'classnames';
import React, { useState } from 'react';

import { FullPhoto } from './types/PreparedTypes';

import users from './api/users';
import photos from './api/photos';
import albums from './api/albums';

const allPhoto: FullPhoto[] = photos.map(photo => {
  const album = albums.find(alb => alb.id === photo.albumId);
  const user = users.find(us => us.id === album?.userId);

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const [photosF] = useState(allPhoto);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<number[]>([]);

  const visibleProducts = photosF.filter(photo => {
    const prepQuery = query.toLowerCase();
    const isQueryInclude = photo.title.toLowerCase().includes(prepQuery);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbumMatch = selectedAlbumId.length
      ? selectedAlbumId.includes(photo.albumId)
      : true;

    return isQueryInclude && isUserIdMatch && isAlbumMatch;
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
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  href="#/"
                  className={classNames(
                    { 'is-active': user.id === selectedUserId },
                  )}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {`User ${user.id}`}
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
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedAlbumId(0)}
              >
                All
              </a>

              {albums.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  onClick={() => selectedAlbumId === album.id}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"

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
              {visibleProducts.map(photo => (
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.id}</td>

                  <td className={photo.user?.sex === 'm' ? (
                    'has-text-link'
                  ) : (
                    'has-text-danger')}
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
