import { SimplePost } from '@/model/post';
import Image from 'next/image';
import ActionBar from './ActionBar';
import Avatar from './Avatar';
import CommentForm from './CommentForm';

type Props = {
  post: SimplePost;
  priority?: boolean;
};

export default function PostListCard({ post, priority = false }: Props) {
  const { userImage, username, image, createdAt, likes, text } = post;

  return (
    <article className="rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center p-2">
        <Avatar image={userImage} size="medium" highlight />
        <span className="text-gray-900 font-bold ml-2">{username}</span>
      </div>
      <Image className="w-full object-cover aspect-square" priority={priority} src={image} alt={`photo by ${username}`} width={500} height={500} />
      <ActionBar likes={likes} username={username} text={text} createdAt={createdAt} />
      <CommentForm />
    </article>
  );
}
