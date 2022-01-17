import styles from './Nav.module.scss';
import PopulistLogo from '../../public/images/PopulistLogo.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function Nav({ mobileNavTitle }: { mobileNavTitle?: string }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Image src={PopulistLogo} alt="Populist" height={150} />
        <h5 className={styles.subTitle}>{mobileNavTitle}</h5>
        <ul className={styles.items}>
          <li className={styles.navItem}>
            <Link href="/politicians">Politicians</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
