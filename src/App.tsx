import React, { useState } from 'react';
import cn from 'classnames';
import photos from './api/photos';
import albums from './api/albums';
import users from './api/users';
import './App.scss';
import { PreparedProduct } from './types/photo';

const getPreparedProduct = (): PreparedProduct[] => {
  return photos.map(photo => {
    const alb = albums.find(a => a?.id === photo.albumId);
    const user = users.find(us => us.id === alb?.userId);

    return {
      ...photo,
      alb,
      user,
    };
  });
};

export const App: React.FC = () => {
  const [fullPhoto] = useState(getPreparedProduct);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);

  let visibleFulllPhoto = fullPhoto.filter(photo => (
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  visibleFulllPhoto = visibleFulllPhoto.filter(photo => {
    if (selectedUserId === 0) {
      return visibleFulllPhoto;
    }

    return photo.user?.id === selectedUserId;
  });

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedUserId(0);
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
                onClick={() => setSelectedUserId(0)}
                href="#/"
              >
                All
              </a>
              {users.map(user => (
                <a
                  className={cn({
                    'is-active':
                  selectedUserId === user.id,
                  })}
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  key={user.id}
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
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albums.map(album => (
                <a
                  key={album.id}
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {album.id}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
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
              {visibleFulllPhoto.map(ph => (
                <tr key={ph.id}>
                  <td className="has-text-weight-bold">
                    {ph.id}
                  </td>

                  <td>{ph.title}</td>
                  <td>{ph.alb?.title}</td>

                  <td
                    className={cn({
                      'has-text-link': ph.user?.sex === 'm',
                      'has-text-dange': ph.user?.sex === 'f',
                    })}
                  >
                    {ph.user?.name}
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
