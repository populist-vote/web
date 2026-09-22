import { BasicLayout, Button, LoaderFlag } from "components";
import styles from "components/Auth/Auth.module.scss";
import { useLogoutMutation } from "generated";
import { useInviteSession } from "hooks/useInviteSession";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { SupportedLocale } from "types/global";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Continue your invitation",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig,
      )),
    },
  };
}

function InviteAccountPage() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const { user, invitedEmail, isChecking, isMismatch } = useInviteSession();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState(false);
  const logout = useLogoutMutation();

  useEffect(() => {
    if (!isChecking && !isMismatch && !switching) {
      void router.replace({ pathname: "/register", query: router.query });
    }
  }, [isChecking, isMismatch, switching, router]);

  async function switchAccounts() {
    setSwitching(true);
    setError(false);
    try {
      const result = await logout.mutateAsync({});
      if (!result.logout) throw new Error("Sign out failed");
      // Discard account-specific client state only after the server signs out.
      localStorage.removeItem("currentOrganizationId");
      sessionStorage.removeItem("__LSM__");
      const localePrefix =
        router.locale && router.locale !== router.defaultLocale
          ? `/${router.locale}`
          : "";
      const destination = new URL(
        `${localePrefix}/register`,
        window.location.origin,
      );
      destination.search = window.location.search;
      // A full navigation also clears the previous account's in-memory caches.
      window.location.replace(destination.toString());
    } catch {
      setError(true);
      setSwitching(false);
    }
  }

  if (isChecking || (!isMismatch && !switching))
    return <LoaderFlag height={100} />;

  return (
    <div className={`${styles.container} ${styles.inviteAccount}`}>
      <h1>{t("invite-account-title")}</h1>
      <p className={styles.subtitle}>
        {t("invite-account-recipient", { email: invitedEmail })}
      </p>
      <p className={styles.subtitle}>
        {t("invite-account-current", { email: user?.email })}
      </p>
      <p className={styles.subtitle}>{t("invite-account-help")}</p>
      <div className={`${styles.formWrapper} ${styles.inviteActions}`}>
        <Button
          type="button"
          label={t(
            switching ? "invite-account-switching" : "invite-account-switch",
          )}
          disabled={switching}
          onClick={() => void switchAccounts()}
          wrapText
        />
        {error && (
          <p role="alert" className={styles.formError}>
            {t("invite-account-error")}
          </p>
        )}
        {!switching && <Link href="/home">{t("invite-account-keep")}</Link>}
      </div>
    </div>
  );
}

InviteAccountPage.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter hideAuthButtons>
    {page}
  </BasicLayout>
);

export default InviteAccountPage;
