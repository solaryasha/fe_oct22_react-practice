import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

// interface Album {
//   user: string,
//   sexUser: string,
//   id: number,
//   title: string,
// }

// interface Photo {
//   album: Album,
//   id: number,
//   title: string,
//   url: string,
// }

export const App: React.FC = () => {
  let userFilter: string;

  userFilter = '';
  const arrFilter: boolean[] = Array(6);

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

  const setUserFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    userFilter = event.currentTarget.text;

    filterArrayOfPhotos();
  };

  const setOptionFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.currentTarget.text) {
      case 'All':
        arrFilter[0] = !(arrFilter[0]);
        break;
      case 'Album 1':
        arrFilter[1] = !arrFilter[1];
        break;
      case 'Album 2':
        arrFilter[2] = !arrFilter[2];
        break;
      case 'Album 3':
        arrFilter[3] = !arrFilter[3];
        break;
      case 'Album 4':
        arrFilter[4] = !arrFilter[4];
        break;
      case 'Album 5':
        arrFilter[5] = !arrFilter[5];
        break;
      default:
        break;
    }

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
                className={cn({ 'is-active': userFilter === 'All' })}
                onClick={setUserFilter}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  className={cn({ 'is-active': user.name === userFilter })}
                  onClick={setUserFilter}
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
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[0] === true })}
                onClick={setOptionFilter}
              >
                All
              </a>

              <a
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[1] === true })}
                href="#/"
                onClick={setOptionFilter}
              >
                Album 1
              </a>

              <a
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[2] === true })}
                href="#/"
                onClick={setOptionFilter}
              >
                Album 2
              </a>

              <a
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[3] === true })}
                href="#/"
                onClick={setOptionFilter}
              >
                Album 3
              </a>
              <a
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[4] === true })}
                href="#/"
                onClick={setOptionFilter}
              >
                Album 4
              </a>
              <a
                className={cn('button', 'mr-2', 'my-1',
                  { 'is-info': arrFilter[5] === true })}
                href="#/"
                onClick={setOptionFilter}
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
