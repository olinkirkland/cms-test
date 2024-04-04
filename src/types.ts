import { MarkdownBlock } from './markdown-converter';

export type Post = {
  id: number;
  slug: string;
  title: string;
  body: MarkdownBlock[];
};
