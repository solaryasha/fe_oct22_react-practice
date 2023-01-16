import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { preparePhotosForRender } from './helpers';
import { Table } from './table';
import { PreparedPhoto } from './types/preparedPhotos';
import usersFromServer from './api/users';
import albumsFromServer from './api/albums';

export const App: React.FC = () => {
  const [photos, setPhotos] = useState<PreparedPhoto[]>(preparePhotosForRender);
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleClearAll = () => {
    setSelectedUser(0);
    setQuery('');
    setSelectedAlbums([]);
  };

  const handleAlbumClick = (id: number) => {
    setSelectedAlbums(albums => {
      return albums.includes(id)
        ? albums.filter(album => album !== id)
        : [...albums, id];
    });
  };

  const visiblePhotos = photos.filter(photo => {
    const lowerTitle = photo.title.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const albumId = photo.album?.id;

    const condition1 = selectedUser === 0
      ? true
      : photo.user?.id === selectedUser;

    const condition2 = lowerTitle.includes(lowerQuery);

    const condition3 = selectedAlbums.length === 0
      ? true
      : albumId && selectedAlbums.includes(albumId);

    return condition1 && condition2 && condition3;
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
                className={cn({ 'is-active': selectedUser === 0 })}
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>

              {
                usersFromServer.map(({ name, id }) => (
                  <a
                    key={id}
                    href={`#/${id}`}
                    className={cn({ 'is-active': selectedUser === id })}
                    onClick={() => setSelectedUser(id)}
                  >
                    {name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  query && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    </span>
                  )
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn(
                  'button is-success mr-6',
                  { 'is-outlined': selectedAlbums.length !== 0 },
                )}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>

              {
                albumsFromServer.map(({ title, id }) => (
                  <a
                    className={cn(
                      'button mr-2 my-1 albumBatton',
                      { 'is-info': selectedAlbums.includes(id) },
                    )}
                    href={`#/${id}`}
                    key={id}
                    onClick={() => handleAlbumClick(id)}
                  >
                    {title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleClearAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">

          {
            visiblePhotos.length === 0
              ? (
                <p data-cy="NoMatchingMessage">
                  No photos matching selected criteria
                </p>
              )
              : <Table photos={visiblePhotos} onMove={setPhotos} />
          }

        </div>
      </div>
    </div>
  );
};
