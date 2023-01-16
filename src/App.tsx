import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { getPreparedPhotos } from './api/getPreparedPhotos';
import users from './api/users';
import albums from './api/albums';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setSelectedAlbumIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbum = () => {
    setSelectedAlbumIds([]);
  };

  const clearFilter = () => {
    clearSelectedAlbum();
    setSearchQuery('');
    setSelectedUserId(0);
  };

  const preparedQuery = searchQuery.toLowerCase();

  const visiblePhotos = photos.filter(photo => {
    const albumId = photo.album?.id || 0;
    const isSearchQueryMatch = photo.title
      .toLowerCase()
      .includes(preparedQuery);

    const isUserIdMatch = selectedUserId
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbumMatch = selectedAlbumIds.length
      ? selectedAlbumIds.includes(albumId)
      : true;

    return isUserIdMatch && isSearchQueryMatch && isAlbumMatch;
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
                className={cn({ 'is-active': selectedUserId === 0 })}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  className={cn({ 'is-active': selectedUserId === user.id })}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  'is-outlined': selectedAlbumIds.length,
                })}
                onClick={clearSelectedAlbum}
              >
                All
              </a>

              {albums.map(album => (
                <a
                  key={album.id}
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbumIds.includes(album.id),
                  })}
                  href="#/"
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
                onClick={clearFilter}
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
