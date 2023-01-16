import cn from 'classnames';
import { FC } from 'react';
import { PreparedPhoto } from './types/preparedPhotos';

interface Props {
  photo: PreparedPhoto,
  onMove: React.Dispatch<React.SetStateAction<PreparedPhoto[]>>,
}

export const PhotoComponent: FC<Props> = ({ photo, onMove }) => {
  const {
    id,
    title,
    album,
    user,
  } = photo;

  const handleMoveUp = () => {
    onMove(photos => {
      const index = photos.indexOf(photo);
      const newPhotos = [...photos];

      if (index === 0) {
        return photos;
      }

      const [currentPhoto, prevPhoto] = [photos[index], photos[index - 1]];

      newPhotos[index] = prevPhoto;
      newPhotos[index - 1] = currentPhoto;

      return newPhotos;
    });
  };

  const handleMoveDown = () => {
    onMove(photos => {
      const index = photos.indexOf(photo);
      const newPhotos = [...photos];

      if (index === photos.length - 1) {
        return photos;
      }

      const [currentPhoto, nextPhoto] = [photos[index], photos[index + 1]];

      newPhotos[index] = nextPhoto;
      newPhotos[index + 1] = currentPhoto;

      return newPhotos;
    });
  };

  return (
    <tr>
      <td className="has-text-weight-bold">
        {id}
      </td>

      <td>{title}</td>
      <td>{album?.title}</td>

      <td
        className={cn({
          'has-text-link': user?.sex === 'm',
          'has-text-danger': user?.sex === 'f',
        })}
      >
        {user?.name}
      </td>

      <td>
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          className="button"
          onClick={handleMoveUp}
        >
          ↑
        </button>
      </td>

      <td>
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          className="button"
          onClick={handleMoveDown}
        >
          ↓
        </button>
      </td>
    </tr>
  );
};
