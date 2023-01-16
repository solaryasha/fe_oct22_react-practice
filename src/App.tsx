import { useState, useEffect } from 'react';
import './App.scss';
import { PhotoTable } from './components/PhotoTable';
import { PhotoFull } from './types/types';

import users from './api/users';
import photosFromServer from './api/photos';
import albums from './api/albums';

export const getPreparedPhoto = (): PhotoFull[] => {
  return photosFromServer.map(photo => {
    const album = albums.find(element => element.id === photo.albumId);
    const owner = users.find(user => user.id === album?.userId);

    return {
      ...photo,
      album,
      owner,
    };
  });
};

export const App: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoFull[]>([]);
  const [SearchQuery, setSearchQuery] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  const visiblePhotos = photos.filter(photo => {
    const searchQueryMathed = photo.title.toLowerCase().includes(
      SearchQuery.toLowerCase(),
    );

    const isSelectedUserMathed = selectedUserId !== 0
      ? photo.owner?.id === selectedUserId
      : true;

    return searchQueryMathed && isSelectedUserMathed;
  });

  useEffect(() => {
    setPhotos(getPreparedPhoto());
  }, []);

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
                className={selectedUserId === 0 ? 'is-active' : ''}
              >
                All
              </a>
              {users.map(user => (
                <a
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  className={selectedUserId === user.id ? 'is-active' : ''}
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
                  value={SearchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {SearchQuery && (
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
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {album.title}
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

        <PhotoTable photos={visiblePhotos} />
      </div>
    </div>
  );
};
