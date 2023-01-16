import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { preparePhotosForRender } from './helpers';
import { Table } from './table';
import { PreparedPhoto } from './types/preparedPhotos';
import usersFromServer from './api/users';

export const App: React.FC = () => {
  const [photos] = useState<PreparedPhoto[]>(preparePhotosForRender);
  const [selectedUser, setSelectedUser] = useState(0);

  const visiblePhotos = selectedUser === 0
    ? photos
    : photos.filter(photo => photo.user?.id === selectedUser);

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
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>

              {
                usersFromServer.map(({ name, id }) => (
                  <a
                    key={id}
                    href={`#/${id}`}
                    className={cn({ 'is-active': selectedUser === id })}
                    onClick={() => setSelectedUser(id)}
                  >
                    {name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
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

          <Table photos={visiblePhotos} />
        </div>
      </div>
    </div>
  );
};
