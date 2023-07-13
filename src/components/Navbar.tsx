'use client';

import Link from 'next/link';
import { HomeFillIcon, HomeIcon, PlusSquareFillIcon, PlusSquareIcon, SearchFillIcon, SearchIcon } from './ui/icons';
import { usePathname } from 'next/navigation';
import ColorButton from './ui/ColorButton';

const menu = [
  {
    href: '/',
    icon: <HomeIcon />,
    clickedIcon: <HomeFillIcon />,
  },
  {
    href: '/search',
    icon: <SearchIcon />,
    clickedIcon: <SearchFillIcon />,
  },
  {
    href: '/new',
    icon: <PlusSquareIcon />,
    clickedIcon: <PlusSquareFillIcon />,
  },
];

export default function Navbar() {
  const pathName = usePathname();

  return (
    <div className="flex justify-between items-center px-6">
      <Link href="/">
        <h1 className="text-3xl font-bold">Instagram</h1>
      </Link>
      <nav>
        <ul className="flex gap-4 items-center p-4">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{pathName === item.href ? item.clickedIcon : item.icon}</Link>
            </li>
          ))}
          <ColorButton text="Sign in" onClick={() => {}} />
        </ul>
      </nav>
    </div>
  );
}
