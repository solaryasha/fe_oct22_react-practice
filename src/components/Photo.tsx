import { FC } from 'react';
import cn from 'classnames';
import { FullPhoto } from '../types/Photo';
import { getShortString } from '../helpers/getShortString';

type Props = {
  photo: FullPhoto
};

export const PhotoItem: FC<Props> = ({ photo }) => {
  const { id, title, album } = photo;

  return (
    <tr>
      <td className="has-text-weight-bold">
        {id}
      </td>

      <td>{title}</td>
      <td>
        {album?.title && getShortString(album?.title, 21)}
      </td>

      <td
        className={cn({
          'has-text-link': album?.user?.sex === 'm',
          'has-text-danger': album?.user?.sex === 'f',
        })}
      >
        {album?.user?.name}
      </td>
    </tr>
  );
};
