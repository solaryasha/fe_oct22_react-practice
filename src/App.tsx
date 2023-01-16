import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

import { TotalAlbums, TotalPhotos } from './types/types';

const getPreparedAlbums = (): TotalAlbums[] => {
  return albumsFromServer.map(album => ({
    ...album,
    owner: usersFromServer.find(user => user.id === album.userId),
  }));
};

const getPreparedPhotos = (): TotalPhotos[] => {
  const preparedAlbums = getPreparedAlbums();

  return photosFromServer.map(photo => {
    const album = preparedAlbums.find(c => c.id === photo.albumId);

    return {
      ...photo,
      album,
    };
  });
};

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos());
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbumsId, setSelectedAlbumsId] = useState<number[]>([]);

  const preparedSearchQuery = searchQuery.toLowerCase().trim();

  const visiblePhotos = photos.filter(photo => {
    const preparedTitle = photo.title.toLowerCase();

    const isUserIdSelected = selectedUserId !== 0
      ? photo.album?.owner?.id === selectedUserId
      : true;

    const isQueryTheSame = searchQuery
      ? preparedTitle.includes(preparedSearchQuery)
      : true;

    const isAlbumSelected = selectedAlbumsId.length
      ? selectedAlbumsId.includes(photo.albumId)
      : true;

    return isUserIdSelected && isQueryTheSame && isAlbumSelected;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedUserId(0);
    setSelectedAlbumsId([]);
  };

  const getSelectedAlbums = (albumId: number) => {
    if (selectedAlbumsId.includes(albumId)) {
      setSelectedAlbumsId(selectedAlbumsId.filter(id => id !== albumId));
    } else {
      setSelectedAlbumsId(albumsIds => [
        ...albumsIds,
        albumId,
      ]);
    }
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
                href="#/"
                className={cn({ 'is-active': selectedUserId === 0 })}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
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
                className={cn(
                  'button is-success mr-6',
                  { 'is-outlined': selectedAlbumsId.length },
                )}
                onClick={() => setSelectedAlbumsId([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={cn(
                    'button mr-2 my-1',
                    { 'is-info': selectedAlbumsId.includes(album.id) },
                  )}
                  href="#/"
                  onClick={() => getSelectedAlbums(album.id)}
                >
                  {`Album #${album.id}`}
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
                    <tr>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>
                        {photo.title}
                      </td>

                      <td>
                        {photo.album?.title}
                      </td>

                      <td
                        className={cn({
                          'has-text-link': photo.album?.owner?.sex === 'm',
                          'has-text-danger': photo.album?.owner?.sex === 'f',
                        })}
                      >
                        {photo.album?.owner?.name}
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
