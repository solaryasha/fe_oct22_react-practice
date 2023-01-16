import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { getPepearedPhotos } from './api/FullPhotos';
import users from './api/users';
import albums from './api/albums';
import { filterPhotos } from './helpers/helpers';

export const App: React.FC = () => {
  const [photos] = useState(getPepearedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);

  const onSelectAlbumFilter = (albumId: number) => {
    setSelectedAlbums(prev => {
      if (selectedAlbums.includes(albumId)) {
        return prev.filter(id => id !== albumId);
      }

      return [...prev, albumId];
    });
  };

  const visiblePhotos = filterPhotos(
    photos,
    { selectedUserId, selectedAlbums },
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
                className={cn({
                  'is-active': selectedUserId === 0,
                })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                  href="#/"
                  key={user.id}
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
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn(
                  'button is-success mr-6 ',
                  {
                    'is-outlined': selectedAlbums.length,
                  },
                )}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>

              {albums.map(album => (
                <a
                  className={cn(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedAlbums.includes(album.id),
                    },
                  )}
                  href="#/"
                  key={album.id}
                  onClick={() => onSelectAlbumFilter(album.id)}
                >
                  {album.title}
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

                  <td>
                    {photo.title}
                  </td>
                  <td>
                    {photo.album?.title}
                  </td>

                  <td
                    className={cn(
                      'has-text-link',
                      {
                        'has-text-link': photo.album?.owner?.sex === 'm',
                        'has-text-danger': photo.album?.owner?.sex === 'f',
                      },
                    )}
                  >
                    {photo.album?.owner?.name}
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
