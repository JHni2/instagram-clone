'use client';

import Link from 'next/link';
import HomeFillIcon from './ui/icons/HomeFillIcon';
import HomeIcon from './ui/icons/HomeIcon';
import PlusSquareFillIcon from './ui/icons/PlusSquareFillIcon';
import PlusSquareIcon from './ui/icons/PlusSquareIcon';
import SearchFillIcon from './ui/icons/SearchFillIcon';
import SearchIcon from './ui/icons/SearchIcon';
import { usePathname } from 'next/navigation';

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
    <div>
      <Link href="/">
        <h1>Instagram</h1>
      </Link>
      <nav>
        <ul>
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{pathName === item.href ? item.clickedIcon : item.icon}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
