import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { PreparedPhoto } from './types/preparedPhotos';
import { Album } from './types/album';
import { User } from './types/user';

function getAlbum(id: number): Album | undefined {
  return albumsFromServer.find(album => album.id === id);
}

function getUser(id: number): User | undefined {
  return usersFromServer.find(user => user.id === id);
}

export function preparePhotosForRender(): PreparedPhoto[] {
  return photosFromServer.map(photo => {
    const album = getAlbum(photo.albumId);
    const user = album && getUser(album.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
}
