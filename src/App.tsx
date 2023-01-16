import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

import { Album, PreparedPhotos, User } from './types/types';

const getPreparedPhotos = (): PreparedPhotos[] => {
  return photosFromServer.map(photo => {
    const foundAlbum = albumsFromServer.find(album => (
      album.id === photo.albumId)) as Album;
    const foundUser = usersFromServer.find(user => (
      user.id === foundAlbum?.userId)) as User;

    return ({
      ...photo,
      albumtitle: foundAlbum?.title,
      username: foundUser.name,
      user: foundUser,
    });
  });
};

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
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

  const normalizedQuery = query.toLowerCase().trim();

  const visiblePhotos = photos.filter(photo => {
    const normalizedTitle = photo.title.toLowerCase();

    const isUserIdSelected = selectedUserId !== 0
      ? photo.user?.id === selectedUserId
      : true;

    const isQueryMatch = query
      ? normalizedTitle.includes(normalizedQuery)
      : true;

    const isAlbumsMatch = selectedAlbumsIds.length
      ? selectedAlbumsIds.includes(photo.albumId)
      : true;

    return isUserIdSelected && isQueryMatch && isAlbumsMatch;
  });

  const resetAllFilters = () => {
    setQuery('');
    setSelectedUserId(0);
    setSelectedAlbumsIds([]);
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
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedAlbumsIds([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedAlbumsIds.includes(album.id),
                    },
                  )}
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
                onClick={() => resetAllFilters()}
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
              <tr>
                <td className="has-text-weight-bold">
                  1
                </td>

                <td>accusamus beatae ad facilis cum similique qui sunt</td>
                <td>quidem molestiae enim</td>

                <td className="has-text-link">
                  Max
                </td>
              </tr>
            </tbody>
          </table>
            )}
        </div>
      </div>
    </div>
  );
};
