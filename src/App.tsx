import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

interface Album {
  userId: number,
  id: number,
  title: string,
}

interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

interface User {
  id: number,
  name: string,
  sex: string
}

interface FullAlbum extends Album {
  user?: User;
}

interface FullPhoto extends Photo {
  album?: FullAlbum;
}

const getPreparedAlbum = (): FullAlbum[] => {
  return albumsFromServer.map(album => ({
    ...album,
    user: usersFromServer.find(user => user.id === album.userId),
  }));
};

const getPreparedPhotos = (): FullPhoto[] => {
  const preparedAlbum = getPreparedAlbum();

  return photosFromServer.map(photo => ({
    ...photo,
    album: preparedAlbum.find(album => album.id === photo.albumId),
  }));
};

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);

  const preparedSearchQuery = searchQuery.toLowerCase();
  const visiblePhotos = photos.filter(photo => {
    const { title } = photo;
    const preparedTitle = title.toLowerCase();

    const isSearchQuaryMatch = preparedTitle.includes(preparedSearchQuery);
    const isUserIdMatch = selectedUserId !== 0
      ? photo.album?.user?.id === selectedUserId : true;

    return isSearchQuaryMatch && isUserIdMatch;
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
                onClick={() => setSelectedUserId(0)}
                className={classNames({
                  'is-active': selectedUserId === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  key={user.id}
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}

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
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
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
                <tr
                  key={photo.id}
                >
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td className={classNames({
                    'has-text-link': photo.album?.user?.sex === 'm',
                    'has-text-danger': photo.album?.user?.sex === 'f',
                  })}
                  >
                    {photo.album?.user?.name}
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
