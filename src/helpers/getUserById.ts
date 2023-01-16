import { User } from '../types/User';
import usersFromServer from '../api/users';

export const getUserById = (id: number): User | undefined => (
  usersFromServer.find(user => user.id === id)
);
