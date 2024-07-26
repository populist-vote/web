import { useRouter } from "next/router";
import styles from "./EmbedPageTabs.module.scss";
import { EmbedType } from "generated";
import { RadioGroup } from "components/RadioGroup/RadioGroup";
import { kebabCase } from "utils/strings";

export function EmbedPageTabs({
  embedType,
  selectedTab,
}: {
  embedType: EmbedType;
  selectedTab?: string;
}) {
  const router = useRouter();
  const { dashboardSlug, id } = router.query;
  const tabs = ["Manage", "Submissions"];
  const onChange = (tab: string) => {
    void router.push(
      `/dashboard/${dashboardSlug}/embeds/${kebabCase(embedType.toLowerCase())}/${id}/${tab.toLowerCase()}`
    );
  };

  return (
    <div className={styles.container}>
      <RadioGroup options={tabs} selected={selectedTab} onChange={onChange} />
    </div>
  );
}
