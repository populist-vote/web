import { BasicLayout, Button } from "components";
import { useConfirmUserEmailMutation } from "generated";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "components/Auth/Auth.module.scss";
import layoutStyles from "components/BasicLayout/BasicLayout.module.scss";
import Link from "next/link";
import { LoaderFlag } from "components";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Confirm your email",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig,
      )),
    },
  };
}

function ConfirmEmail() {
  const { query, isReady } = useRouter();
  const { token } = query;
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const confirmation = useRef<{
    token: string;
    request: Promise<unknown>;
  } | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (typeof token !== "string" || !token) {
      setStatus("error");
      return;
    }
    // Reuse the same request when Strict Mode replays effects: confirmation
    // tokens are single-use. Each effect subscribes to the result separately.
    if (confirmation.current?.token !== token) {
      confirmation.current = {
        token,
        request: useConfirmUserEmailMutation.fetcher({ token })(),
      };
    }
    let active = true;
    setStatus("pending");
    confirmation.current.request.then(
      () => {
        if (active) setStatus("success");
      },
      () => {
        if (active) setStatus("error");
      },
    );
    return () => {
      active = false;
    };
  }, [token, isReady]);

  if (status === "pending") return <LoaderFlag />;

  if (status === "error")
    return (
      <div className={styles.container}>
        <h1>Whoops!</h1>
        <div
          className={styles.formWrapper}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>
            Your email could not be verified. You can reach out to us at{" "}
            <a
              href="mailto: info@populist.us"
              className={layoutStyles.textLink}
            >
              info@populist.us
            </a>{" "}
            for help.
          </p>
          <Link href="/login" passHref>
            <Button variant="primary" size="large" label="Log in now" />
          </Link>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1>Congratulations, your account has been confirmed!</h1>
      <p>We're excited to have you.</p>
      <Link href="/login" passHref>
        <Button variant="primary" size="large" label="Log in now" />
      </Link>
    </div>
  );
}

ConfirmEmail.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter>{page}</BasicLayout>
);

export default ConfirmEmail;
