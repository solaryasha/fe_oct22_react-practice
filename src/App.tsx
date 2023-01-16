import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { PreparedPhoto, User } from './types';

const preparedPhotos: PreparedPhoto[] = photosFromServer.map(photo => {
  const album = albumsFromServer.find(alb => alb.id === photo.albumId);
  const user = usersFromServer.find(u => u.id === album?.userId);

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const defaultAlbumIds: number[] = [];
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [photos, setPhotos] = useState(preparedPhotos);
  const [query, setQuery] = useState('');
  const [selectedAlbumIds, setSelectedAlbumIds] = useState(defaultAlbumIds);

  const visiblePhotos = photos.filter(photo => {
    const normalizedPhotoName = photo.title.toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();
    const isAlbumSelected = selectedAlbumIds.length
      ? selectedAlbumIds.includes(photo.albumId)
      : true;

    return normalizedPhotoName.includes(normalizedQuery) && isAlbumSelected;
  });

  const handleSelectUser = (user: User) => {
    if (selectedUserId === user.id) {
      return;
    }

    setSelectedUserId(user.id);
    setPhotos(preparedPhotos.filter(photo => {
      return photo.user?.id === user.id;
    }));
  };

  const handleAllClick = () => {
    setPhotos(preparedPhotos);
    setSelectedUserId(0);
  };

  const handleClearQueryClick = () => {
    setQuery('');
  };

  const handleResetClick = () => {
    setPhotos(preparedPhotos);
    setQuery('');
    setSelectedUserId(0);
  };

  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbumIds(prev => {
      if (prev.includes(albumId)) {
        return prev.filter(id => id !== albumId);
      }

      return [
        ...prev,
        albumId,
      ];
    });
  };

  const handleClearSelectedAlbum = () => {
    setSelectedAlbumIds(defaultAlbumIds);
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
                onClick={handleAllClick}
                href="#/"
                className={classNames({ 'is-active': selectedUserId === 0 })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  className={classNames({
                    'is-active': user.id === selectedUserId,
                  })}
                  href="#/"
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
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

                {query !== '' && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={handleClearQueryClick}
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={classNames('button is-success mr-6 ', {
                  'is-outlined': selectedAlbumIds.length !== 0,
                })}
                onClick={handleClearSelectedAlbum}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={classNames('button mr-2 my-1 ', {
                    'is-info': selectedAlbumIds.includes(album.id),
                  })}
                  href="#/"
                  key={album.id}
                  onClick={() => handleAlbumSelect(album.id)}
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetClick}
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
            )
            : (
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
                    <tr>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>{photo.title}</td>
                      <td>{photo.url}</td>

                      <td className={classNames({
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
            )}
        </div>
      </div>
    </div>
  );
};
