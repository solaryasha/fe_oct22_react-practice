import albumsFromServer from '../api/albums';
import photosFromServer from '../api/photos';
import usersFromServer from '../api/users';
import { AlbumFull, PhotoFull } from '../types/types';

const getPreparedAlbums = (): AlbumFull[] => {
  return albumsFromServer.map(album => ({
    ...album,
    user: usersFromServer.find(u => u.id === album.userId),
  }));
};

export const getPreparedPhoto = (): PhotoFull[] => {
  const preparedAlbums = getPreparedAlbums();

  return photosFromServer.map(photo => {
    const album = preparedAlbums.find(a => a.id === photo.albumId);

    return {
      ...photo,
      album,
    };
  });
};
