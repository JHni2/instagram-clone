import { SimplePost } from '@/model/post';
import { parseDate } from '@/util/date';
import Image from 'next/image';
import Avatar from './Avatar';
import BookmarkIcon from './ui/icons/BookmarkIcon';
import CommentIcon from './ui/icons/CommentIcon';
import HeartIcon from './ui/icons/HeartIcon';

type Props = {
  post: SimplePost;
};

export default function PostListCard({ post }: Props) {
  const { userImage, username, image, createdAt, likes, text } = post;

  return (
    <>
      <div>
        <Avatar image={userImage} highlight />
        <span>{username}</span>
      </div>
      <Image src={image} alt={`photo by ${username}`} width={500} height={500} />
      <div>
        <HeartIcon />
        <BookmarkIcon />
        <p>{`${likes?.length ?? 0} ${likes?.length > 1 ? 'likes' : 'like'}`}</p>
        <p>
          <span>{username}</span>
          {text}
        </p>
        <p>{parseDate(createdAt)}</p>
        <form>
          <CommentIcon />
          <input type="text" placeholder="Add a comment..." />
          <button>Post</button>
        </form>
      </div>
    </>
  );
}
