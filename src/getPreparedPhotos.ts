import { AlbumFull, PhotoFull } from './types/types';
import photos from './api/photos';
import albums from './api/albums';
import users from './api/users';

const getPreparedAlbums = (): AlbumFull[] => {
  return albums.map(album => ({
    ...album,
    user: users.find(user => user.id === album.userId),
  }));
};

export const getPreparedPhotos = (): PhotoFull[] => {
  const preparedAlbums = getPreparedAlbums();

  return photos.map(photo => {
    const album = preparedAlbums.find(albumEl => albumEl.id === photo.albumId);

    return {
      ...photo,
      album,
    };
  });
};
