import { Author } from './Author';

export type Challenge = {
  id: string,
  title: string,
  description: string,
  author: Author,
  created_at: string,
}
