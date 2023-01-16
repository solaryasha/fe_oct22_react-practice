import React, { useState } from 'react';
import cn from 'classnames';
import { getPreparedPhotos } from './api/getPreparedProducts';
import './App.scss';
import albums from './api/albums';
import users from './api/users';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumsId, setSelectedAlbumsId] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setSelectedAlbumsId(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const visiblePhotos = photos.filter(photo => {
    const { title } = photo;
    const albumId = photo.album?.id || 0;
    const preparedTitle = title.toLowerCase();

    const isSearchMatch = preparedTitle.includes(search.toLowerCase());
    const isUserIdMatch = selectedUserId !== 0
      ? photo.owner?.id === selectedUserId
      : true;

    const isAlbumsMatch = setSelectedAlbumsId.length
      ? selectedAlbumsId.includes(albumId)
      : true;

    return isSearchMatch && isUserIdMatch && isAlbumsMatch;
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
                className={cn({ 'is-active': selectedUserId === 0 })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  href="#/"
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
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {search && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
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
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albums.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
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
