import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

interface Album {
  user: string,
  sexUser: string,
  id: number,
  title: string,
}

interface Photo {
  album: Album,
  id: number,
  title: string,
  url: string,
}

export const App: React.FC = () => {
  let userFilter: string;
  let query: string;
  const arrAlbumsFilter: boolean[] = [];

  arrAlbumsFilter.fill(false);

  const albums = albumsFromServer.map(album => ({
    user: (usersFromServer.find(user => album.userId === user.id))?.name,
    sexUser: (usersFromServer.find(user => album.userId === user.id))?.sex,
    id: album.id,
    title: album.title,
  }));

  const photos = photosFromServer.map(photo => ({
    album: albums.find(album => photo.albumId === album.id),
    id: photo.id,
    title: photo.title,
    url: photo.url,
  }));

  const [filterPhotos, setFilterPhotos] = useState([...photos]);

  const filterArrayOfPhotos = () => {
    if (userFilter !== '' && userFilter !== 'All') {
      setFilterPhotos(photos.filter(photo => photo.album?.user === userFilter));
    } else if (userFilter === 'All') {
      setFilterPhotos([...photos]);
    }
  };

  const setActiveUserFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    userFilter = event.currentTarget.text;

    filterArrayOfPhotos();
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
                onClick={setActiveUserFilter}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  onClick={setActiveUserFilter}
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
              {filterPhotos.map(photo => (
                <tr>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album?.title}</td>

                  <td
                    className={cn(
                      { 'has-text-link': photo.album?.sexUser === 'm' },
                      { 'has-text-danger': photo.album?.sexUser === 'f' },
                    )}
                  >
                    {photo.album?.user}
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
