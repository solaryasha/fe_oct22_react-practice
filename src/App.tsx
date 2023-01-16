import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import { PreparedPhoto } from './types/PreparedPhoto';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const preparedPhotos: PreparedPhoto[] = photosFromServer.map(photo => {
  const album = albumsFromServer.find(photoAlbum => (
    photoAlbum.id === photo.albumId
  ));
  const user = usersFromServer.find(albumsOwner => (
    albumsOwner.id === album?.userId
  ));

  return (
    {
      ...photo,
      album,
      user,
    }
  );
});

export const App: React.FC = () => {
  const [photos, setPhotos] = useState(preparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedAlbumsIds, setSelectedAlbumsIds] = useState<number[]>([]);

  const resetFilters = () => {
    setSelectedUserId(0);
    setFilterQuery('');
    setSelectedAlbumsIds([]);
  };

  const handleClickSelectAlbumId = (albumId: number) => {
    setSelectedAlbumsIds(prevIds => {
      if (prevIds.includes(albumId)) {
        return prevIds.filter(prevId => prevId !== albumId);
      }

      return [...prevIds, albumId];
    });
  };

  const moveUp = (photoId: number) => {
    setPhotos(prev => {
      const index = prev.findIndex(photo => photo.id === photoId);

      if (index === 0) {
        return prev;
      }

      const photosCopy = [...prev];
      const temp = photosCopy[index];

      photosCopy[index] = photosCopy[index - 1];
      photosCopy[index - 1] = temp;

      return photosCopy;
    });
  };

  const moveDown = (photoId: number) => {
    setPhotos(prev => {
      const index = prev.findIndex(photo => photo.id === photoId);

      if (index === prev.length - 1) {
        return prev;
      }

      const photosCopy = [...prev];
      const temp = photosCopy[index];

      photosCopy[index] = photosCopy[index + 1];
      photosCopy[index + 1] = temp;

      return photosCopy;
    });
  };

  const normalizedQuery = filterQuery.toLowerCase();

  const visiblePhotos = photos.filter(photo => {
    const normalizedPhotoTitle = photo.title.toLowerCase();
    const isQueryMatch = normalizedPhotoTitle.includes(normalizedQuery);

    const isSelectedUserIdMatch = selectedUserId !== 0
      ? selectedUserId === photo.user?.id
      : true;

    const isSelectedAlbumIdsMatch = selectedAlbumsIds.length
      ? selectedAlbumsIds.includes(photo.album?.id || 0)
      : true;

    return isQueryMatch && isSelectedUserIdMatch && isSelectedAlbumIdsMatch;
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
                className={cn(
                  { 'is-active': !selectedUserId },
                )}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={cn(
                    { 'is-active': selectedUserId === user.id },
                  )}
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
                  value={filterQuery}
                  onChange={event => setFilterQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setFilterQuery('')}
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
                  { 'is-outlined': selectedAlbumsIds.length },
                )}
                onClick={() => setSelectedAlbumsIds([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    { 'is-info': selectedAlbumsIds.includes(album.id) },
                  )}
                  href="#/"
                  onClick={() => handleClickSelectAlbumId(album.id)}
                >
                  {album.title.slice(0, album.title.indexOf(' '))}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length
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
                    <th> </th>
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
                        className={cn(
                          { 'has-text-link': photo.user?.sex === 'm' },
                          { 'has-text-danger': photo.user?.sex === 'f' },
                        )}
                      >
                        {photo.user?.name}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="button"
                          onClick={() => moveUp(photo.id)}
                        >
                          &uarr;
                        </button>
                        <button
                          type="button"
                          className="button"
                          onClick={() => moveDown(photo.id)}
                        >
                          &darr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
