import cn from 'classnames';
import { FC } from 'react';
import { PreparedPhoto } from './types/preparedPhotos';

interface Props {
  photo: PreparedPhoto,
}

export const PhotoComponent: FC<Props> = ({ photo }) => {
  const {
    id,
    title,
    album,
    user,
  } = photo;

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
    </tr>
  );
};
