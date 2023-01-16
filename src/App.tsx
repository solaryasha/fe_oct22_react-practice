import React, { useState } from 'react';
import cn from 'classnames';
import albums from './api/albums';
import users from './api/users';
import './App.scss';
import { getPreparedPhotos } from './api/getPreparedphotos';
// import { filterPhotos } from './filterPhotos';

export const App: React.FC = () => {
  const [photos] = useState(getPreparedPhotos);
  const [selectedUserId, setSelectedUseriD] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedAlbumsIds, setSelectedAlbumsIds] = useState<number[]>([]);

  // const onSelectAlbumsFilter = (id: number) => {
  //   setSelectedAlbumsIds((prev) => {
  //     if (prev.includes(id)) {
  //       return prev.filter(l => l !== id);
  //     }

  //     return [...prev, id];
  //   });
  // };

  // const visiblePhotos = filterPhotos(
  //   photos,
  //   { searchQuery, selectedAlbumsIds, selectedUserId },
  // );

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
              >
                All
              </a>

              {users.map(user => (
                <a
                  href="#/"
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  key={user.id}
                  onClick={() => setSelectedUseriD(user.id)}
                >
                  {`User ${user.id}`}
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
              {albums.map(album => (
                <a
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {`Album ${album.id}`}
                </a>
              ))}
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

            {photos.map(photo => (
              <tbody>
                <tr>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{photo.title}</td>
                  <td>{photo.album.title}</td>

                  <td
                    className={cn(
                      'has-text-link',
                      { 'has-text-danger': photo.user.sex === 'f' },
                    )}
                  >
                    {photo.user.name}
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
