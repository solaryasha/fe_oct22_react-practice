import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import photosFromServer from './api/photos';
import { findAlbumById, findUserById } from './helpers/helpers';
import { FullPhoto } from './types/types';
import { PhotoItem } from './components/PhotoItem/PhotoItem';
import users from './api/users';
import albums from './api/albums';

const getPreparedPhotos = (): FullPhoto[] => {
  return photosFromServer.map(photo => {
    const album = findAlbumById(photo.albumId);

    const user = findUserById(album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
};

export const App: React.FC = () => {
  const [photos, setPhotos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedAlbumsId, setSelectedAlbumsId] = useState<number[]>([]);

  const resetAllFilters = () => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedAlbumsId([]);
  };

  const handleSelectAlbum = (albumId: number) => {
    if (selectedAlbumsId.includes(albumId)) {
      setSelectedAlbumsId(selectedAlbumsId.filter(id => id !== albumId));
    } else {
      setSelectedAlbumsId(albumsIds => [
        ...albumsIds,
        albumId,
      ]);
    }
  };

  const moveUp = (photoId: number) => {
    setPhotos(currentPhotos => {
      const selectedPosition = currentPhotos.findIndex(photo => (
        photo.id === photoId
      ));

      if (selectedPosition === 0) {
        return currentPhotos;
      }

      const currentPhoto = currentPhotos[selectedPosition];
      const previousPhoto = currentPhotos[selectedPosition - 1];

      const newPhotos = [...currentPhotos];

      newPhotos[selectedPosition] = previousPhoto;
      newPhotos[selectedPosition - 1] = currentPhoto;

      return newPhotos;
    });
  };

  const moveDown = (photoId: number) => {
    setPhotos(currentPhotos => {
      const selectedPosition = currentPhotos.findIndex(photo => (
        photo.id === photoId
      ));

      if (selectedPosition === currentPhotos.length - 1) {
        return currentPhotos;
      }

      const currentPhoto = currentPhotos[selectedPosition];
      const nextPhoto = currentPhotos[selectedPosition + 1];

      const newPhotos = [...currentPhotos];

      newPhotos[selectedPosition] = nextPhoto;
      newPhotos[selectedPosition + 1] = currentPhoto;

      return newPhotos;
    });
  };

  const normalizedQuery = query.toLowerCase().trim();

  const visiblePhotos = photos.filter(photo => {
    const normalizedTitle = photo.title.toLowerCase();

    const isUserIdSelected = selectedUserId !== 0
      ? photo.user?.id === selectedUserId
      : true;

    const isQueryMatch = query
      ? normalizedTitle.includes(normalizedQuery)
      : true;

    const isAlbumMatch = selectedAlbumsId.length
      ? selectedAlbumsId.includes(photo.albumId)
      : true;

    return isUserIdSelected && isQueryMatch && isAlbumMatch;
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
                  key={user.id}
                  href="#/"
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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn(
                  'button is-success mr-6',
                  { 'is-outlined': selectedAlbumsId.length },
                )}
                onClick={() => setSelectedAlbumsId([])}
              >
                All
              </a>

              {albums.map(album => (
                <a
                  key={album.id}
                  className={cn(
                    'button mr-2 my-1',
                    { 'is-info': selectedAlbumsId.includes(album.id) },
                  )}
                  href="#/"
                  onClick={() => handleSelectAlbum(album.id)}
                >
                  {album.title.split(' ')[0]}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            ) : (
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
                    <PhotoItem
                      key={photo.id}
                      photo={photo}
                      onMoveUp={moveUp}
                      onMoveDown={moveDown}
                    />
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
