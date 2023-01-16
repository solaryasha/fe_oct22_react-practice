import React, { useState } from 'react';
import cn from 'classnames';
import users from './api/users';
import './App.scss';
import { getPreparedPhotos } from './helpers/getPreparedPhotos';
import albums from './api/albums';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<number[]>([]);
  const [nameFilter, setNameFilter] = useState('');

  const handleAlbumClick = (newId: number) => {
    if (!selectedAlbumIds.includes(newId)) {
      setSelectedAlbumIds(prev => ([
        ...prev,
        newId,
      ]));
    } else {
      setSelectedAlbumIds(prev => {
        return prev.filter(id => id !== newId);
      });
    }
  };

  const handleResetAllClick = () => {
    setSelectedUserId(0);
    setSelectedAlbumIds([]);
    setNameFilter('');
  };

  const getFiltredPhotos = () => {
    return photos.filter(photo => {
      const userId = photo.album?.user?.id;
      const normalizePhotoName = photo.title.toLowerCase();

      const isSelectedUserIdMatch = (selectedUserId !== 0)
        ? (userId === selectedUserId)
        : true;

      const isSelectedAlbumsMatch = (selectedAlbumIds.length !== 0)
        ? selectedAlbumIds.includes(photo.albumId)
        : true;

      const isNameFilterMatch = normalizePhotoName
        .includes(nameFilter.toLowerCase());

      return isSelectedUserIdMatch
        && isSelectedAlbumsMatch
        && isNameFilterMatch;
    });
  };

  const visiblePhotos = getFiltredPhotos();

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
                  key={user.id}
                  href="#/"
                  className={cn({ 'is-active': user.id === selectedUserId })}
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
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
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
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': selectedAlbumIds.length },
                )}
                onClick={() => setSelectedAlbumIds([])}
              >
                All
              </a>

              {albums.map(({ id, title }) => (
                <a
                  key={id}
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    { 'is-info': selectedAlbumIds.includes(id) },
                  )}
                  href="#/"
                  onClick={() => handleAlbumClick(id)}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllClick}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length > 0
            ? (
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
                  {visiblePhotos.map(({ id, title, album }) => (
                    <tr key={id}>
                      <td className="has-text-weight-bold">
                        {id}
                      </td>

                      <td>{title}</td>
                      <td>
                        {(album?.title && album?.title?.length <= 21)
                          ? album?.title
                          : `${album?.title.slice(0, 21)}...`}
                      </td>

                      <td
                        className={cn({
                          'has-text-link': album?.user?.sex === 'm',
                          'has-text-danger': album?.user?.sex === 'f',
                        })}
                      >
                        {album?.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            : (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
