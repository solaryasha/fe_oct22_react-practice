import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import users from './api/users';
import photos from './api/photos';
import albums from './api/albums';
import { PhotoFull } from './types/Photos';
import { AlbumWithUser } from './types/Albums';
import { filterPhotos } from './helpers/filterPhotos';

const getAlbumsWithUser = (): AlbumWithUser[] => {
  return albums.map(album => ({
    ...album,
    user: users.find(user => user.id === album.userId),
  }));
};

const getFullPhotos = (): PhotoFull[] => {
  const albumsWithUser = getAlbumsWithUser();

  return photos.map(photo => {
    const albumWithUser = albumsWithUser.find(
      album => album.id === photo.albumId,
    );

    return {
      ...photo,
      albumWithUser,
    };
  });
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);

  const fullPhotos = getFullPhotos();

  const visiblePhotos = filterPhotos(
    fullPhotos,
    { query, selectedUserId },
  );

  const reset = () => {
    setQuery('');
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
                className={cn({ 'is-active': selectedUserId === 0 })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {users.map(user => (
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
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
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
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albums.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {album.id}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}

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
                    {photo.albumWithUser?.title}
                  </td>

                  <td
                    className={cn({
                      'has-text-link': photo.albumWithUser?.user?.sex === 'm',
                      'has-text-danger': photo.albumWithUser?.user?.sex === 'f',
                    })}
                  >
                    {photo.albumWithUser?.user?.name}
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
