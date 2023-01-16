/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

import { PreparedPhotos } from './Types/PreparedPhotos';

export const App: React.FC = () => {
  function getUser(userId: number) {
    const foundUser = usersFromServer
      .find(user => user.id === userId);

    return foundUser;
  }

  const albumsWithUser = albumsFromServer.map(album => (
    {
      ...album,
      user: getUser(album.userId),
    }
  ));

  const preparedPhotos = photosFromServer.map(photo => {
    const album = albumsWithUser.find(a => a.id === photo.albumId);

    const relatableAlbum = album
      ? {
        album: {
          ...album,
        },
      }
      : {};

    return {
      ...photo,
      ...relatableAlbum,
    };
  });

  const [selectedUser, setSelectedUser] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
  const [photoOrder, setPhotoOrder] = useState(preparedPhotos);

  const getTruncatedTitle = (fullTitle: string) => {
    return fullTitle.length >= 20
      ? `${fullTitle.substring(0, 15)}...`
      : fullTitle;
  };

  const handleResetButton = () => {
    setSelectedUser(() => 0);
    setSelectedAlbums(() => []);
    setSearchQuery(() => '');
  };

  const handleAlbumSelector = (albumId: number) => {
    if (!selectedAlbums.includes(albumId)) {
      setSelectedAlbums((prev) => ([...prev, albumId]));
    }

    if (selectedAlbums.includes(albumId)) {
      const newSelectedAlbums = selectedAlbums.filter(e => e !== albumId);

      setSelectedAlbums(() => (newSelectedAlbums));
    }
  };

  const visiblePhotos = photoOrder.filter(
    photo => {
      const searchFilter = photo.title.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const userFilter = selectedUser === 0
        ? true
        : selectedUser === photo.album?.userId;

      const albumsFilter = selectedAlbums.length
        ? selectedAlbums.includes(photo.albumId)
        : true;

      return (
        searchFilter
        && userFilter
        && albumsFilter
      );
    },
  );

  const changeOrderUp = (selectedP: PreparedPhotos) => {
    setPhotoOrder(currOrder => {
      const newOrder = [...currOrder];
      const currentOrder: number = newOrder
        .findIndex((element) => element === selectedP);

      if (currentOrder === 0) {
        return newOrder;
      }

      const itemToReplace = currOrder[currentOrder - 1];

      newOrder[currentOrder - 1] = selectedP;

      newOrder[currentOrder] = itemToReplace;

      return newOrder;
    });
  };

  const changeOrderDown = (selectedP: PreparedPhotos) => {
    setPhotoOrder(currOrder => {
      const newOrder = [...currOrder];
      const currentOrder: number = newOrder
        .findIndex((element) => element === selectedP);

      if (currentOrder === newOrder.length - 1) {
        return newOrder;
      }

      const itemToReplace = currOrder[currentOrder + 1];

      newOrder[currentOrder + 1] = selectedP;

      newOrder[currentOrder] = itemToReplace;

      return newOrder;
    });
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
                className={cn(
                  { 'is-active': selectedUser === 0 },
                )}
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  className={cn(
                    { 'is-active': user.id === selectedUser },
                  )}
                  onClick={() => setSelectedUser(user.id)}
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
                  onChange={(event) => setSearchQuery(event.target.value)}
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
                className={cn(
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': selectedAlbums.length === 0 },
                )}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    { 'is-info': selectedAlbums.includes(album.id) },
                  )}
                  href="#/"
                  onClick={() => handleAlbumSelector(album.id)}
                >
                  {`Album ${album.id}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleResetButton()}
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

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Reorder

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
                    <tr>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>
                        {photo.title}
                      </td>

                      <td>
                        {photo.album && (
                          getTruncatedTitle(photo.album?.title)
                        )}
                      </td>

                      {photo.album?.user && (
                        <td className={cn(
                          { 'has-text-link': photo.album.user.sex === 'm' },
                          { 'has-text-danger': photo.album.user.sex === 'f' },
                        )}
                        >
                          {photo.album.user.name}
                        </td>
                      )}

                      <td>
                        <span
                          className="icon"
                          onClick={() => changeOrderUp(photo)}
                        >
                          <i className="fas fa-sort-up" />
                        </span>

                        <span
                          className="icon"
                          onClick={() => changeOrderDown(photo)}
                        >
                          <i className="fas fa-sort-down" />
                        </span>
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
