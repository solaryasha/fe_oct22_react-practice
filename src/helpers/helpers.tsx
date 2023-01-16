import { PrepearedPhotos } from '../types/types';

interface Filters {
  searchQuery: string,
  selectedUserId: number,
  selectedAlbums: number[],
}

export const filterPhotos = (
  photos: PrepearedPhotos[],
  filters: Filters,
) => {
  const {
    searchQuery,
    selectedUserId,
    selectedAlbums,
  } = filters;

  return photos.filter(photo => {
    const search = searchQuery.toLowerCase();

    const isSearchQueryMatch = photo.title.toLowerCase().includes(search)
      || photo.album?.title.toLowerCase().includes(search)
      || photo.album?.owner?.name.toLowerCase().includes(search);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.album?.owner?.id === selectedUserId
      : true;

    const isAlbumIdMatch = selectedAlbums.length
      ? selectedAlbums.includes(photo.album?.id || 0)
      : true;

    return isSearchQueryMatch && isUserIdMatch && isAlbumIdMatch;
  });
};
