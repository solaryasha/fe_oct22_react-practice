import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import users from './api/users';
import './App.scss';
import { getPreparedPhotos } from './helpers/getPreparedPhotos';
import albums from './api/albums';
import { PhotosList } from './components/PhotosList';
import { getShortString } from './helpers/getShortString';

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

  const visiblePhotos = useMemo(() => {
    return getFiltredPhotos();
  }, [selectedUserId, selectedAlbumIds, nameFilter]);

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

                {nameFilter && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setNameFilter('')}
                    />
                  </span>
                )}
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
                  {getShortString(title, 15)}
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
              <PhotosList photos={visiblePhotos} />
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
