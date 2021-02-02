import { FaShoppingCart } from 'react-icons/fa';
import {useCart} from '../../hooks/use-cart';
import styles from './Nav.module.css';

import Link from 'next/link';

const Nav = () => {
  
    const { subtotal, checkout} = useCart();

  return (
    <nav className={styles.nav}>
      <p className={styles.navTitle}>
        <Link href="/">
            <a>Space Jelly Shop</a>
          </Link>
      </p>
      <p className={styles.navCart}>
        <Link href="/cart">
          <a><FaShoppingCart /> ${subtotal}</a>
        </Link>
      </p>
    </nav>
  )
}

export default Nav;