import React, { useState } from 'react';
import cl from 'classnames';

import { getPreparedProducts } from './api/helper';
import './App.scss';

import usersFromServer from './api/users';
import albumsFromServer from './api/albums';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedProducts);
  const [query, setQuery] = useState('');
  const [selectedPhotoId, setSelectedPhotoId] = useState(0);
  const [selectedPhotosName, setSelectedPhotosName] = useState([]);

  const clearButton = () => setQuery('');

  let visiblePhotos = photos;

  if (query) {
    const lowerQuery = query.toLowerCase().trim();

    visiblePhotos
    = photos.filter((photo) => photo.title.toLowerCase().includes(lowerQuery));
  }

  if (selectedPhotoId) {
    visiblePhotos = visiblePhotos.filter(
      (photo) => photo.owner?.id === selectedPhotoId,
    );
  }

  if (selectedPhotoId) {
    visiblePhotos = visiblePhotos.filter(
      (photo) => photo.owner?.id === selectedPhotoId,
    );
  }

  if (selectedPhotosName.length > 0) {
    visiblePhotos
    = visiblePhotos
        .filter((photo) => selectedPhotosName
          .includes(photo.album?.title));
  }

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
                onClick={() => setSelectedPhotoId(0)}
                className={cl({
                  'is-active': Number(selectedPhotoId) === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  href="#/"
                  onClick={() => setSelectedPhotoId(user.id)}
                  className={cl({
                    'is-active': Number(selectedPhotoId) === user.id,
                  })}
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

                <span className="icon is-right">
                  {query && (
                    <>
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={clearButton}
                      />
                    </>
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cl('button mr-6 is-outlined', {
                  'is-success': selectedPhotosName.length === 0,
                })}
                onClick={() => {
                  setSelectedPhotosName([]);
                }}
              >
                All
              </a>

              {albumsFromServer.map((album) => (
                <a
                  href="#/"
                  className={cl('button mr-2 my-1', {
                    'is-info': selectedPhotosName.includes(album.title),
                  })}
                  onClick={() => {
                    setSelectedPhotosName((prev) => {
                      if (prev.includes(album.title)) {
                        return prev.filter((name) => name !== album.title);
                      }

                      return [...prev, album.title];
                    });
                  }}
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => setSelectedPhotosName([])}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visiblePhotos.length ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <table className="table is-striped is-narrow is-fullwidth">
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
                {visiblePhotos.map((photo) => (
                  <tr>
                    <td className="has-text-weight-bold">{photo.id}</td>

                    <td>{photo.title}</td>
                    <td>{photo.album?.title}</td>

                    <td className="has-text-link">{photo.owner?.name}</td>
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
