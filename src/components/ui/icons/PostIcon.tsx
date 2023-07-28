import { BsPostcard } from 'react-icons/bs';

type Props = {
  className?: string;
};

export default function PostIcon({ className }: Props) {
  return <BsPostcard className={className || 'w-7 h-7'} />;
}
