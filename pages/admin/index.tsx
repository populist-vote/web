/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";

import { Layout } from "components";
import { FlagSection } from "components";
import { useAuth } from "hooks/useAuth";
import { Role, useUserCountQuery } from "generated";
import styles from "styles/modules/page.module.scss";
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
  useAuth({ redirectTo: "/login?next=admin", minRole: Role.Staff });

  const { data } = useUserCountQuery();

  return (
    <Layout navItems={adminNavItems} hideFooter>
      <div className={styles.contentContainer}>
        <FlagSection title={"Admin Panel"} hideFlagForMobile={true}>
          <div className={classNames(styles.adminBox, styles.flexBetween)}>
            <span className={styles.itemHeader}>Total Users</span>
            <div className={styles.dots} />
            <h1>{data?.userCount}</h1>
          </div>
        </FlagSection>
      </div>
    </Layout>
  );
};

export default AdminPanel;
