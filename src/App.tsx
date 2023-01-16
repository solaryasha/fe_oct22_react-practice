import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { User, Album, Photo } from './types/types';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const PhotoWithUsers = photosFromServer.map(photo => {
  const album = albumsFromServer.find((item: Album) => (
    item.id === photo.albumId
  )) || null;
  const user = usersFromServer.find((person: User) => (
    person.id === album?.userId
  )) || null;

  return {
    ...photo,
    album,
    user,
  };
});

export const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(PhotoWithUsers);
  const [selectedUser, setSelectedUser] = useState(-1);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  const handleClickFilterUser = (user: number) => {
    setSelectedUser(user);

    setPhotos(
      [...PhotoWithUsers.filter(photo => photo.user && photo.user.id === user)],
    );
  };

  const handleChangePhoto = () => {
    setPhotos(PhotoWithUsers.filter((photo: Photo) => (
      photo.title.includes(selectedPhoto)
    )));
  };

  const handleClickAlbum = (album: number) => {
    setPhotos(PhotoWithUsers.filter((photo: Photo) => (
      photo.album?.id === album
    )));
  };

  const hadnleClearForm = () => {
    setPhotos(PhotoWithUsers);
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
                className={cn({ 'is-active': selectedUser === 0 })}
                onClick={() => setPhotos(PhotoWithUsers)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  className={cn({ 'is-active': user.id === selectedUser })}
                  onClick={() => handleClickFilterUser(user.id)}
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
                  value={selectedPhoto}
                  onChange={(event) => {
                    setSelectedPhoto(event.target.value);
                    handleChangePhoto();
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  onClick={() => handleClickAlbum(album.id)}
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={hadnleClearForm}
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
              {photos.map(photo => {
                const { user, album } = photo;

                return (
                  <tr>
                    <td className="has-text-weight-bold">
                      {photo.id}
                    </td>

                    <td>{photo.title}</td>
                    <td>{album?.title}</td>

                    <td className={cn(
                      { 'has-text-link': user?.sex === 'm' },
                      { 'has-text-danger': user?.sex === 'f' },
                    )}
                    >
                      {user?.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
