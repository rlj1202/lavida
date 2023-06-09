import { Comment } from './comment';
import { User } from './user';

export interface Article {
  id: number;
  title: string;
  content: string;
  author?: User;
  authorId: number;
  boardId: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
