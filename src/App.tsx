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
  // const [sortBy, setSortBy] = useState('');

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

  // const sortedPhotos = visiblePhoto.sort((photo1, photo2) => {
  //   switch (sortBy) {
  //     case 'id':
  //       return photo1.id - photo2.id;
  //
  //     case 'photoName':
  //       return photo1.title.localeCompare(photo2.title);
  //
  //     case 'albbumName':
  //       return photo1.album?.title.localeCompare(photo2.album.title);
  //
  //     default:
  //       return 1;
  //   }
  // })

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
