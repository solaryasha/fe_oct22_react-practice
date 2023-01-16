import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import albumsFromServer from './api/albums';

import { getPreparedPhotos } from './getPreparedPhotos';
import { filterPhotos } from './filterPhotos';
import { Photo } from './types/types';

export const App: React.FC = () => {
  const [photos, setPhotos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [
    selectedAlbumsIds, setSelectedAlbumsIds,
  ] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setSelectedAlbumsIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbum = () => {
    setSelectedAlbumsIds([]);
  };

  const clearFilters = () => {
    clearSelectedAlbum();
    setSearchQuery('');
    setSelectedUserId(0);
  };

  const moveUp = (selectedPhoto: Photo) => {
    setPhotos((prev) => {
      const photosArr = prev;
      const position = photosArr.findIndex(
        (photo) => photo.id === selectedPhoto.id,
      );

      if (position === 0) {
        return prev;
      }

      const currentPhoto = photosArr[position];
      const previousPhoto = photosArr[position - 1];

      const newPhotos = [
        ...photosArr,
      ];

      newPhotos[position] = previousPhoto;
      newPhotos[position - 1] = currentPhoto;

      return [...newPhotos];
    });
  };

  const moveDown = (selectedPhoto: Photo) => {
    setPhotos((prev) => {
      const photosArr = prev;
      const position = photosArr.findIndex(
        (photo) => photo.id === selectedPhoto.id,
      );

      if (position === photosArr.length - 1) {
        return prev;
      }

      const currentPhoto = photosArr[position];
      const nextPhoto = photosArr[position + 1];

      const newPhotos = [
        ...photosArr,
      ];

      newPhotos[position] = nextPhoto;
      newPhotos[position + 1] = currentPhoto;

      return [...newPhotos];
    });
  };

  const visiblePhotos = filterPhotos(
    photos,
    { searchQuery, selectedAlbumsIds, selectedUserId },
  );

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

              {usersFromServer.map(user => (
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

              {albumsFromServer.map(album => (
                <a
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbumsIds.includes(album.id),
                  })}
                  href="#/"
                  onClick={() => onSelectAlbumFilter(album.id)}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visiblePhotos.length && (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          )}

          {!!visiblePhotos.length && (
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
                    <td>
                      {photo.album?.title}
                    </td>

                    <td
                      className={cn({
                        'has-text-link': photo.album?.user?.sex === 'm',
                        'has-text-danger': photo.album?.user?.sex === 'f',
                      })}
                    >
                      {photo.album?.user?.name}
                    </td>
                    <td className="is-flex is-flex-wrap-nowrap">
                      <a
                        href="#/"
                        onClick={() => moveDown(photo)}
                      >
                        &darr;
                      </a>
                    </td>

                    <td>
                      <a
                        href="#/"
                        onClick={() => moveUp(photo)}
                      >
                        &uarr;
                      </a>
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
