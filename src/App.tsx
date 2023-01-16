import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
// import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { getPreparedPhoto } from './helpers/helpers';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhoto());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserById, setSelectedUserBYId] = useState(0);
  const [selectedAlbumByrId, setSelectedAlbumByrId] = useState<number[]>([]);

  const filteredSelectedAlbumById = (id: number) => {
    setSelectedAlbumByrId(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const resetSelectedAlbumById = () => {
    setSelectedAlbumByrId([]);
  };

  const visiblePhotos = photos.filter(photo => {
    const isUserMatch = selectedUserById
      ? photo.album?.user?.id === selectedUserById
      : true;

    return photo.title.toLowerCase().includes(
      searchQuery.toLocaleLowerCase(),
    ) && isUserMatch;
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
                className={cn({
                  'is-active': selectedUserById === 0,
                })}
                href="#/"
                onClick={() => setSelectedUserBYId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  onClick={() => filteredSelectedAlbumById(user.id)}
                  key={user.id}
                  className={cn({
                    'is-active': selectedUserById === user.id,
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
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedAlbumByrId.length,
                })}
                onClick={() => resetSelectedAlbumById}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbumByrId.includes(album.id),
                  })}
                  href="#/"
                  key={album.id}
                  onClick={() => filteredSelectedAlbumById(album.id)}
                >
                  {album.id}
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
              {visiblePhotos.map(photo => (
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td className={cn({
                    'has-text-link': photo.album?.user?.sex === 'm',
                    'has-text-danger': photo.album?.user?.sex === 'f',
                  })}
                  >
                    {photo.album?.user?.name}
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
