import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const photosWithAlbum = photosFromServer.map(photo => ({
  ...photo,
  album: albumsFromServer.find(album => album.id === photo.albumId),
}));

const photosWithAlbumAndUser = photosWithAlbum.map(photo => ({
  ...photo,
  user: usersFromServer.find(user => user.id === photo?.album?.userId),
}));

export const App: React.FC = () => {
  const [photos] = useState(photosWithAlbumAndUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumsIds, setSelectedAlbumsIds] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setSelectedAlbumsIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(albumId => albumId !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbums = () => {
    setSelectedAlbumsIds([]);
  };

  const visiblePhotos = photos.filter(photo => {
    const filterByName = selectedUserId !== 0
      ? photo.album?.userId === selectedUserId
      : true;

    const filterByInput = photo.title.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const filterByAlbum = selectedAlbumsIds.length
      ? selectedAlbumsIds.includes(photo.album?.id || 0)
      : true;

    return filterByInput && filterByName && filterByAlbum;
  });

  const resetAllFilters = () => {
    clearSelectedAlbums();
    setSearchQuery('');
    setSelectedUserId(0);
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
              {usersFromServer.map((user) => (
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
              <a href="#/" className="button is-success mr-6 is-outlined">
                All
              </a>

              {albumsFromServer.map((album) => (
                <a
                  key={album.id}
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  //               className="button mr-2 my-1 is-info"
                >
                  {album.title}
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
          <p data-cy="NoMatchingMessage">
            No photos matching selected criteria
          </p>
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
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">{photo.id}</td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td className="has-text-link">{photo.user?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
