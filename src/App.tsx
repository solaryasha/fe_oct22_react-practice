import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { PhotosFull } from './types/Photo';

const photosFull: PhotosFull[] = photosFromServer.map(photo => {
  const album = albumsFromServer
    .find(albumElem => albumElem.id === photo.albumId);

  const user = usersFromServer.find(userElem => userElem.id === album?.userId);

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const [photos] = useState(photosFull);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);

  const handleSelectedAlbums = (newId: number) => {
    setSelectedAlbums(state => {
      if (state.includes(newId)) {
        return state.filter(elem => elem !== newId);
      }

      return [...state, newId];
    });
  };

  const visiblePhotos = photos.filter(photo => {
    const queryPrepared = query.toLowerCase().trim();
    const photoTitle = photo.title.toLowerCase();
    const albumId = photo.album?.id || 0;

    const isQueryMatched = photoTitle.includes(queryPrepared);

    const isSelectedUserMatched = selectedUserId !== 0
      ? selectedUserId === photo.user?.id
      : true;

    const isSelectedAlbumsMatched = selectedAlbums.length
      ? selectedAlbums.includes(albumId)
      : true;

    return isQueryMatched
      && isSelectedUserMatched
      && isSelectedAlbumsMatched;
  });

  const handleClearFilters = () => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedAlbums([]);
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
                onClick={() => setSelectedUserId(0)}
                className={cn({
                  'is-active': !selectedUserId,
                })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                >
                  { user.name }
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
                  onChange={event => setQuery(event.target.value)}
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
                  {
                    'is-outlined': selectedAlbums.length !== 0,
                  },
                )}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>
              {albumsFromServer.map(album => (
                <a
                  className={cn(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedAlbums.includes(album.id),
                    },
                  )}
                  href="#/"
                  key={album.id}
                  onClick={() => handleSelectedAlbums(album.id)}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleClearFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No results
            </p>
          )}

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
                    { photo.id }
                  </td>

                  <td>{ photo.title }</td>
                  <td>{ photo.album?.title }</td>

                  <td className={cn({
                    'has-text-link': photo.user?.sex === 'm',
                    'has-text-danger': photo.user?.sex === 'f',
                  })}
                  >
                    { photo.user?.name }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
