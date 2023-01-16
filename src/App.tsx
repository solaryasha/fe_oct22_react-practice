import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { PrepPhotoWithUserAndAlbum } from './types/types';

const getPreparedPhoto = (): PrepPhotoWithUserAndAlbum[] => {
  return photosFromServer.map(photo => {
    const album = albumsFromServer.find(alb => alb.id === photo.albumId);

    const user = usersFromServer.find(us => us.id === album?.userId);

    return {
      ...photo,
      user,
      album,
    };
  });
};

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhoto);
  const [serchedQuery, setSerchedQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<number[]>([]);

  const onSelectedAlbumIds = (id: number) => {
    setSelectedAlbumIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbums = () => {
    setSelectedAlbumIds([]);
  };

  const preparedSeserchedQuery = serchedQuery.toLowerCase();

  const resetAllFilters = () => {
    setSerchedQuery('');
    setSelectedUserId(0);
    setSelectedAlbumIds([]);
  };

  const visiblePhotos = photos.filter(photo => {
    const isSerchedQueryMatch = photo.title.toLowerCase()
      .includes(preparedSeserchedQuery);

    const isUserIdMatch = selectedUserId
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbumsMatch = selectedAlbumIds.length
      ? selectedAlbumIds.includes(photo.albumId)
      : true;

    return isSerchedQueryMatch && isUserIdMatch && isAlbumsMatch;
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
                className={cn({ 'is-active': selectedUserId === 0 })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  href="#/"
                  key={user.id}
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
                  value={serchedQuery}
                  onChange={(event) => setSerchedQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {serchedQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSerchedQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                // className="button is-success mr-6 is-outlined"
                className={cn('button is-success mr-6',
                  { 'is-outlined': selectedAlbumIds.length })}
                onClick={clearSelectedAlbums}
              >
                All
              </a>

              {albumsFromServer.map(albom => (
                <a
                  // className="button mr-2 my-1 is-info"
                  className={cn('button mr-2 my-1',
                    { 'is-info': selectedAlbumIds.includes(albom.id) })}
                  href="#/"
                  key={albom.id}
                  onClick={() => onSelectedAlbumIds(albom.id)}
                >
                  {albom.title}
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
          <p data-cy="NoMatchingMessage">
            No photos matching selected criteria
          </p>

          <table
            className="table is-striped is-narrow is-fullwidth"
          >
            {visiblePhotos.map(photo => (
              <thead key={photo.id}>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {photo.id}

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {photo.title}

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {photo.album?.title}

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span
                      className={cn({
                        'is-flex is-flex-wrap-nowrap has-text-link':
                        photo.user?.sex === 'm',
                        'is-flex is-flex-wrap-nowrap has-text-danger':
                        photo.user?.sex === 'f',
                      })}
                    >
                      {photo.user?.name}

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            ))}
            {/* <tbody>
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
            </tbody> */}

          </table>

        </div>
      </div>
    </div>
  );
};
