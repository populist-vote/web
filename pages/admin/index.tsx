/* eslint-disable react/no-unescaped-entities */
import { Layout } from "components";
import { useAuth } from "hooks/useAuth";
import { SystemRoleType, State, useUserCountByStateQuery } from "generated";
import styles from "./admin.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";

const adminNavItems = [
  {
    label: "Home",
    href: "/home",
  },
  {
    label: "Admin",
    href: "/admin",
  },
];

function AdminPanel() {
  useAuth({ redirectTo: "/login", minRole: SystemRoleType.Staff });

  const { data: totalUserCount } = useUserCountByStateQuery();
  const { data: coUserCount } = useUserCountByStateQuery({ state: State.Co });
  const { data: mnUserCount } = useUserCountByStateQuery({ state: State.Mn });

  return (
    <div className={styles.adminContainer}>
      <div className={clsx(styles.adminBox)}>
        <div className={styles.dotSpread}>
          <span className={styles.itemHeader}>Total Users</span>
          <span className={styles.dots} />
          <h1>{totalUserCount?.userCount}</h1>
        </div>
        <div className={styles.dotSpread}>
          <span className={styles.itemHeader}>Colorado</span>
          <span className={styles.dots} />
          <h2>{coUserCount?.userCount}</h2>
        </div>
        <div className={styles.dotSpread}>
          <span className={styles.itemHeader}>Minnesota</span>
          <span className={styles.dots} />
          <h2>{mnUserCount?.userCount}</h2>
        </div>
      </div>
    </div>
  );
}

AdminPanel.getLayout = (page: ReactNode) => (
  <Layout navItems={adminNavItems} hideFooter>
    {page}
  </Layout>
);

export default AdminPanel;
