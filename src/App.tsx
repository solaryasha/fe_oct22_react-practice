import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { Prepared } from './types/Photo';
import { Album } from './types/Album';
import { User } from './types/User';
import { filterPhotos } from './helpers/filterPhotos';

function findUserById(userId: number | undefined): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

function findAlbumById(albumId: number): Album | null {
  return albumsFromServer
    .find(album => album.id === albumId) || null;
}

const preparedPhotos: Prepared[] = photosFromServer
  .map(photo => ({
    ...photo,
    album: findAlbumById(photo.albumId),
    user: findUserById(findAlbumById(photo.albumId)?.userId),
  }));

export const App: React.FC = () => {
  const [photos] = useState(preparedPhotos);
  const [selectedUserId, setselectedUserId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [
    selectedAlbomsIds, setselectedAlbomsIds,
  ] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setselectedAlbomsIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbum = () => {
    setselectedAlbomsIds([]);
  };

  const clearFilters = () => {
    clearSelectedAlbum();
    setSearchQuery('');
    setselectedUserId(0);
  };

  const visiblePhotos = filterPhotos(
    photos,
    { searchQuery, selectedAlbomsIds, selectedUserId },
  );

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
                  { 'is-active': selectedUserId === 0 },
                )}
                onClick={() => {
                  setselectedUserId(0);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  className={cn(
                    { 'is-active': selectedUserId === user.id },
                  )}
                  onClick={() => {
                    setselectedUserId(user.id);
                  }}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    type="button"
                    className="delete"
                    onClick={() => setSearchQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedAlbomsIds.length,
                })}
                onClick={clearSelectedAlbum}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbomsIds.includes(album.id),
                  })}
                  href="#/"
                  onClick={() => onSelectAlbumFilter(album.id)}
                  key={album.id}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visiblePhotos.length && (
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
