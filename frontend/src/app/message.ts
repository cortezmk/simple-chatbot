export type Message = {
  id: number;
  content: string;
  added: Date;
  author: 'User' | 'Assistant';
  reaction?: string;
}