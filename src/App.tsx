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

const allPhotos = getPreparedPhoto();

export const App: React.FC = () => {
  const [photos, setPhotos] = useState(allPhotos);
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

  // const moveUpPhoto = (id: number) => {
  //   const position = photos.findIndex(photo => photo.id === id);

  //   if (position === 0) {
  //     return photos;
  //   }

  //   const prevPhoto = photos[position - 1];
  //   const currentPhoto = photos[position];

  //   const newPhotos = [...photos];

  //   newPhotos[position - 1] = currentPhoto;
  //   newPhotos[position] = prevPhoto;

  //   return setPhotos(newPhotos);
  // };

  // const moveDownPhoto = (id: number) => {
  //   const position = photos.findIndex(photo => photo.id === id);

  //   if (position === photos.length - 1) {
  //     return photos;
  //   }

  //   const prevPhoto = photos[position];
  //   const currentPhoto = photos[position + 1];

  //   const newPhotos = [...photos];

  //   newPhotos[position] = currentPhoto;
  //   newPhotos[position + 1] = prevPhoto;

  //   return setPhotos(newPhotos);
  // };

  const preparedSeserchedQuery = serchedQuery.toLowerCase();

  const resetAllFilters = () => {
    setSerchedQuery('');
    setSelectedUserId(0);
    setSelectedAlbumIds([]);
    setPhotos(getPreparedPhoto);
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

  const moveUpPhoto = (id: number) => {
    const position = visiblePhotos.findIndex(photo => photo.id === id);

    if (position === 0) {
      return visiblePhotos;
    }

    const prevPhoto = visiblePhotos[position - 1];
    const currentPhoto = visiblePhotos[position];

    const newPhotos = [...visiblePhotos];

    newPhotos[position - 1] = currentPhoto;
    newPhotos[position] = prevPhoto;

    return setPhotos(newPhotos);
  };

  const moveDownPhoto = (id: number) => {
    const position = visiblePhotos.findIndex(photo => photo.id === id);

    if (position === visiblePhotos.length - 1) {
      return visiblePhotos;
    }

    const prevPhoto = visiblePhotos[position];
    const currentPhoto = visiblePhotos[position + 1];

    const newPhotos = [...visiblePhotos];

    newPhotos[position] = currentPhoto;
    newPhotos[position + 1] = prevPhoto;

    return setPhotos(newPhotos);
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
                onClick={() => {
                  setSelectedUserId(0);
                  setPhotos(allPhotos);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  href="#/"
                  key={user.id}
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setPhotos(allPhotos);
                  }}
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
                  onChange={(event) => {
                    setSerchedQuery(event.target.value);
                    setPhotos(allPhotos);
                  }}
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
                className={cn('button is-success mr-6',
                  { 'is-outlined': selectedAlbumIds.length })}
                onClick={clearSelectedAlbums}
              >
                All
              </a>

              {albumsFromServer.map(albom => (
                <a
                  className={cn('button mr-2 my-1 myButtons',
                    { 'is-info': selectedAlbumIds.includes(albom.id) })}
                  href="#/"
                  key={albom.id}
                  onClick={() => {
                    onSelectedAlbumIds(albom.id);
                    setPhotos(allPhotos);
                  }}
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

            {visiblePhotos.map(photo => (
              <tbody key={photo.id}>
                <tr>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td className={cn(photo.user?.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger')}
                  >
                    {photo.user?.name}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => moveDownPhoto(photo.id)}
                    >
                      &darr;
                    </button>

                    <button
                      type="button"
                      onClick={() => moveUpPhoto(photo.id)}
                    >
                      &uarr;
                    </button>
                  </td>

                </tr>
              </tbody>
            ))}
          </table>

        </div>
      </div>
    </div>
  );
};
