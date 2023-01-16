import usersFromServer from '../api/users';
import albumsFromServer from '../api/albums';

export const findAlbumById = (albumId: number) => {
  return albumsFromServer.find(album => album.id === albumId);
};

export const findUserById = (userId: number | undefined) => {
  return usersFromServer.find(user => user.id === userId);
};
