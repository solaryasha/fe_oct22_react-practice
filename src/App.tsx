import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { PhotoFull } from './types/Types';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const PreparedPhotos: PhotoFull[] = (
  photosFromServer.map(photo => {
    const album = albumsFromServer.find(a => a.id === photo.albumId);
    const user = usersFromServer.find(u => u.id === album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  })
);

export const App: React.FC = () => {
  const [photoSearch, setPhotoSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPhotoSearch(value);
  };

  const visiblePhotos = PreparedPhotos.filter(photo => {
    const title = photo.title.toLowerCase();
    const editedPhotoName = photoSearch.toLowerCase().trim();

    const isTitleMatch = title.includes(editedPhotoName);
    const isUserIdMatch = selectedUser !== 0
      ? photo.album?.userId === selectedUser
      : true;

    return isTitleMatch && isUserIdMatch;
  });

  const reset = () => {
    setPhotoSearch('');
  };

  function handleDelete() {
    reset();
  }

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
                className={classNames(
                  { 'is-active': selectedUser === 0 },
                )}
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>
              {PreparedPhotos.map(user => (
                <a
                  className={classNames(
                    { 'is-active': selectedUser === user.id },
                  )}
                  key={user.id}
                  href="#/"
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.user?.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={photoSearch}
                  onChange={handleChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {photoSearch
                && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleDelete}
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

              <a
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Album 1
              </a>

              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 2
              </a>

              <a
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Album 3
              </a>
              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 4
              </a>
              <a
                className="button mr-2 my-1"
                href="#/"
              >
                Album 5
              </a>
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"

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
            <tbody>
              {visiblePhotos.map(photo => (
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td
                    className={classNames({
                      'has-text-link': photo.user?.sex === 'm',
                      'has-text-danger': photo.user?.sex === 'f',
                    })}
                  >
                    {photo.user?.name}
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
