import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { FullPhoto } from './types/types';

const allPhoto: FullPhoto[] = photosFromServer.map(photo => {
  const album = albumsFromServer.find(alb => alb.id === photo.albumId);
  const user = usersFromServer.find(us => us.id === album?.userId);

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const [photos] = useState(allPhoto);
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumsId, setSelectedAlbumsId] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('');

  const handleQuery = (str: string) => setQuery(str);
  const clearQuery = () => setQuery('');

  const onSelectAlbum = (id: number) => {
    setSelectedAlbumsId(prev => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const onResetFilter = () => {
    setQuery('');
    setSelectedUserId(0);
    setSelectedAlbumsId([]);
    setSortBy('');
  };

  const handleSort = (str: string) => {
    switch (str) {
      case 'id':
        setSortBy(prev => {
          if (!prev) {
            return 'id';
          }

          if (prev === 'id') {
            return 'idRevers';
          }

          if (prev === 'idRevers') {
            return '';
          }

          return '';
        });
        break;

      case 'photoName':
        setSortBy(prev => {
          if (!prev) {
            return 'photoName';
          }

          if (prev === 'photoName') {
            return 'photoNameRevers';
          }

          if (prev === 'photoNameRevers') {
            return '';
          }

          return '';
        });
        break;

      case 'albumName':
        setSortBy(prev => {
          if (!prev) {
            return 'albumName';
          }

          if (prev === 'albumName') {
            return 'albumNameRevers';
          }

          if (prev === 'albumNameRevers') {
            return '';
          }

          return '';
        });
        break;

      case 'userName':
        setSortBy(prev => {
          if (!prev) {
            return 'userName';
          }

          if (prev === 'userName') {
            return 'userNameReverse';
          }

          if (prev === 'userNameReverse') {
            return '';
          }

          return '';
        });
        break;

      default:
        break;
    }
  };

  const visiblePhoto = photos.filter(photo => {
    const prepQuery = query.toLowerCase();
    const isQueryInclude = photo.title.toLowerCase().includes(prepQuery);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbumMatch = selectedAlbumsId.length
      ? selectedAlbumsId.includes(photo.albumId)
      : true;

    return isQueryInclude && isUserIdMatch && isAlbumMatch;
  });

  visiblePhoto.sort((photo1, photo2) => {
    switch (sortBy) {
      case 'id':
        return photo1.id - photo2.id;

      case 'photoName':
        return photo1.title.localeCompare(photo2.title);

      case 'albumName':
        if (photo1.album && photo2.album) {
          return photo1.album?.title.localeCompare(photo2.album?.title);
        }

        return 1;

      case 'userName':
        if (photo1.user && photo2.user) {
          return photo1.user?.name.localeCompare(photo2.user?.name);
        }

        return 1;

      case 'idRevers':
        return photo2.id - photo1.id;

      case 'photoNameRevers':
        return photo2.title.localeCompare(photo1.title);

      case 'albumNameRevers':
        if (photo1.album && photo2.album) {
          return photo2.album?.title.localeCompare(photo1.album?.title);
        }

        return 1;

      case 'userNameReverse':
        if (photo2.user && photo1.user) {
          return photo2.user?.name.localeCompare(photo1.user?.name);
        }

        return 1;

      default:
        return 1;
    }
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
                className={cn({ 'is-active': !selectedUserId })}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
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
                  value={query}
                  onChange={(event) => handleQuery(event.target.value)}
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
                      onClick={clearQuery}
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
                  { 'is-outlined': !selectedAlbumsId.length })}
                onClick={() => setSelectedAlbumsId([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={cn('button mr-2 my-1',
                    { 'is-info': selectedAlbumsId.includes(album.id) })}
                  href="#/"
                  onClick={() => onSelectAlbum(album.id)}
                >
                  {album.title.slice(0, 10)}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={onResetFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visiblePhoto.length ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <table
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas',
                              {
                                'fa-sort': sortBy !== 'id'
                                  && sortBy !== 'idReverse',
                                'fa-sort-down': sortBy === 'id',
                                'fa-sort-up': sortBy === 'idRevers',
                              })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('photoName')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Photo name

                      <a href="#/">
                        <span className="icon">
                          <i className={cn('fas',
                            {
                              'fa-sort': sortBy !== 'photoName'
                                && sortBy !== 'photoNameReverse',
                              'fa-sort-down': sortBy === 'photoName',
                              'fa-sort-up': sortBy === 'photoNameRevers',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('albumName')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Album name

                      <a href="#/">
                        <span className="icon">
                          <i className={cn('fas',
                            {
                              'fa-sort': sortBy !== 'albumName'
                                && sortBy !== 'albumNameReverse',
                              'fa-sort-down': sortBy === 'albumName',
                              'fa-sort-up': sortBy === 'albumNameRevers',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('userName')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User name

                      <a href="#/">
                        <span className="icon">
                          <i className={cn('fas',
                            {
                              'fa-sort': sortBy !== 'userName'
                                && sortBy !== 'userNameReverse',
                              'fa-sort-down': sortBy === 'userName',
                              'fa-sort-up': sortBy === 'userNameReverse',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visiblePhoto.map(photo => (
                  <tr key={photo.id}>
                    <td className="has-text-weight-bold">
                      {photo.id}
                    </td>

                    <td>{photo.title}</td>
                    <td>{photo.album?.title}</td>

                    <td className={photo.user?.sex === 'm' ? (
                      'has-text-link'
                    ) : (
                      'has-text-danger')}
                    >
                      {photo.user?.name}
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
