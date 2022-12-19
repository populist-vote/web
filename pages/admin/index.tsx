/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import { Layout } from "components";
import { useAuth } from "hooks/useAuth";
import { Role, State, useUserCountByStateQuery } from "generated";
import styles from "./admin.module.scss";
import clsx from "clsx";

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

const AdminPanel: NextPage = () => {
  useAuth({ redirectTo: "/login", minRole: Role.Staff });

  const { data: totalUserCount } = useUserCountByStateQuery();
  const { data: coUserCount } = useUserCountByStateQuery({ state: State.Co });
  const { data: mnUserCount } = useUserCountByStateQuery({ state: State.Mn });

  return (
    <Layout navItems={adminNavItems} hideFooter>
      <div className={styles.adminContainer}>
        <div className={clsx(styles.adminBox)}>
          <div className={styles.dotSpread}>
            <span className={styles.itemHeader}>Total Users</span>
            <span className={styles.dots} />
            <h1>{totalUserCount?.userCount}</h1>
          </div>
          <div className={styles.flexBetween}>
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
    </Layout>
  );
};

export default AdminPanel;
