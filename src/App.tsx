import React, { useState } from 'react';
import classNames from 'classnames';
import { getPreparedPhotos } from './api/getPreparedPhotos';
import './App.scss';
import users from './api/users';
import albums from './api/albums';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumsId, setSelectedAlbumsId] = useState<number[]>([]);

  const handleSelectAlbumFilter = (id: number) => {
    setSelectedAlbumsId(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const handleSelectedAllAlbums = () => {
    setSelectedAlbumsId([]);
  };

  const handleResetAllFilters = () => {
    handleSelectedAllAlbums();
    setSearch('');
    setSelectedUserId(0);
  };

  const visiblePhotos = photos.filter(photo => {
    const isSearchMatch = photo.title.toLowerCase()
      .includes(search.toLowerCase());
    const isUserIdMatch = selectedUserId
      ? photo.owner?.id === selectedUserId
      : true;
    const isAlbumIdMatch = selectedAlbumsId.length
      ? selectedAlbumsId.includes(photo.album?.id || 0)
      : true;

    return isSearchMatch && isUserIdMatch && isAlbumIdMatch;
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
                className={classNames({
                  'is-active': selectedUserId === 0,
                })}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  href="#/"
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {search && (
                  /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={classNames('button is-success mr-6', {
                  'is-outlined': selectedAlbumsId.length,
                })}
                onClick={handleSelectedAllAlbums}
              >
                All
              </a>

              {albums.map(album => (
                <a
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedAlbumsId.includes(album.id),
                  })}
                  href="#/"
                  onClick={() => handleSelectAlbumFilter(album.id)}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!(visiblePhotos.length) && (
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

                  <td className={classNames({
                    'has-text-link': photo.owner?.sex === 'm',
                    'has-text-danger': photo.owner?.sex === 'f',
                  })}
                  >
                    {photo.owner?.name}
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
