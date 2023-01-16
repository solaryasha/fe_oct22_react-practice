import { PrepearedPhotos } from '../types/types';

interface Filters {
  // searchQuery: string,
  selectedUserId: number,
  selectedAlbums: number[],
}

export const filterPhotos = (
  photos: PrepearedPhotos[],
  filters: Filters,
) => {
  const {
    selectedUserId,
    selectedAlbums,
  } = filters;

  return photos.filter(photo => {
    const isUserIdMatch = selectedUserId !== 0
      ? photo.album?.owner?.id === selectedUserId
      : true;

    const isAlbumIdMatch = selectedAlbums.length
      ? selectedAlbums.includes(photo.album?.id || 0)
      : true;

    return isUserIdMatch && isAlbumIdMatch;
  });
};
