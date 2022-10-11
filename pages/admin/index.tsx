/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import { Layout } from "components";
import { useAuth } from "hooks/useAuth";
import { Role, useUserCountQuery } from "generated";
import styles from "./admin.module.scss";
import classNames from "classnames";

const adminNavItems = [
  {
    label: "Users",
    href: "/admin/users",
  },
  {
    label: "Data",
    href: "/admin/data",
  },
];

const AdminPanel: NextPage = () => {
  useAuth({ redirectTo: "/login", minRole: Role.Staff });

  const { data } = useUserCountQuery();

  return (
    <Layout navItems={adminNavItems} hideFooter>
      <div className={styles.adminContainer}>
        <div className={classNames(styles.flexBetween, styles.adminBox)}>
          <span className={styles.itemHeader}>Total Users</span>
          <span className={styles.dots} />
          <h1>{data?.userCount}</h1>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
