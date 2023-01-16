import React, { useState } from 'react';
import cn from 'classnames';
import { getPreparedPhotos } from './api/getPreparedPhoto';
import './App.scss';
import users from './api/users';
import albums from './api/albums';

// import usersFromServer from './api/users';
// import photosFromServer from './api/photos';
// import albumsFromServer from './api/albums';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(0);

  const [
    selectedAlbumsIds, setSelectedAlbumsIds,
  ] = useState<number[]>([]);

  const onSelectedAlbumIds = (id: number) => {
    setSelectedAlbumsIds(previous => {
      if (previous.includes(id)) {
        return previous.filter(item => item !== id);
      }

      return [...previous, id];
    });
  };

  const clearSelectedAlbum = () => {
    setSelectedAlbumsIds([]);
  };

  const normalizedQuery = searchQuery.toLowerCase();
  const visiblePhotos = photos.filter(photo => {
    const { title } = photo;
    const albumId = photo.album?.id || 0;

    const preparedName = title.toLowerCase();
    const isSearchQueryMatch = preparedName.includes(normalizedQuery);
    const userIdMatch = selectedUser
      ? photo.album?.owner?.id === selectedUser
      : true;

    const albumMath = selectedAlbumsIds.length
      ? selectedAlbumsIds.includes(albumId)
      : true;

    return isSearchQueryMatch && userIdMatch && albumMath;
  });

  const clearFilter = () => {
    clearSelectedAlbum();
    setSearchQuery('');
    setSelectedUser(0);
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
                className={cn({ 'is-active': selectedUser === 0 })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>
              {users.map(user => (
                <a
                  className={cn({ 'is-active': selectedUser === user.id })}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUser(user.id)}
                  key={user.id}
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
                      data-cy="ClearButton"
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
                  'is-outlined': selectedAlbumsIds.length,
                })}
                onClick={clearSelectedAlbum}
              >
                All
              </a>
              {albums.map(album => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbumsIds.includes(album.id),
                  })}
                  href="#/"
                  onClick={() => onSelectedAlbumIds(album.id)}
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
              { visiblePhotos.map(photo => (
                <tr key={photo.id}>
                  <td>
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td
                    className={cn({
                      'has-text-link': photo.album?.owner?.sex === 'm',
                      'has-text-danger': photo.album?.owner?.sex === 'f',
                    })}
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
