/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const allDataFromServer = photosFromServer.map(photo => {
  const album = albumsFromServer.find(albumId => albumId.id === photo.albumId);
  const user = usersFromServer.find(userId => userId.id === album?.userId);

  return {
    id: photo.id,
    title: photo.title,
    albumTitle: album?.title,
    userName: user?.name,
    sex: user?.sex,
  };
});

export const App: React.FC = () => {
  const [photos] = useState(allDataFromServer);
  const [query, setQuery] = useState('');
  const [filterBy, setFilter] = useState('All');
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

  const photosFilter = () => {
    const newQuery = query.toLowerCase().trim();

    return photos.filter(photo => {
      if (filterBy === 'All') {
        return (selectedAlbums.length === 0
          || (photo.albumTitle && selectedAlbums.includes(photo.albumTitle)))
          && photo?.title.toLowerCase().includes(newQuery);
      }

      return photo?.userName === filterBy
        && (selectedAlbums.length === 0
          || (photo.albumTitle && selectedAlbums.includes(photo.albumTitle)))
        && photo?.title.toLowerCase().includes(newQuery);
    });
  };

  const visiblePhotos = photosFilter();

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
                  { 'is-active': filterBy === 'All' },
                )}
                onClick={() => setFilter('All')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={cn(
                    { 'is-active': filterBy === user.name },
                  )}
                  onClick={() => setFilter(user.name)}
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
                  onChange={event => setQuery(event.currentTarget.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn('button is-success mr-6',
                  { 'is-outlined': selectedAlbums.length !== 0 })}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn('button mr-2 my-1',
                    { 'is-info': selectedAlbums.includes(album.title) })}
                  href="#/"
                  onClick={() => setSelectedAlbums(
                    [...selectedAlbums, album.title],
                  )}
                >
                  {album.title.split(' ')[0]}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setFilter('All');
                  setSelectedAlbums([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length > 0
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
                  </tr>
                </thead>

                <tbody>
                  {visiblePhotos.map(photo => {
                    return (
                      <tr key={photo.id}>
                        <td>{photo.id}</td>
                        <td>{photo.title}</td>
                        <td>{photo.albumTitle}</td>
                        <td
                          className={cn(
                            { 'has-text-link': photo?.sex === 'm' },
                            { 'has-text-danger': photo?.sex === 'f' },
                          )}
                        >
                          {photo.userName}
                        </td>
                      </tr>
                    );
                  })}
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
