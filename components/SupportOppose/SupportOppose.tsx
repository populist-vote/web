import { useMemo, useCallback, useState, CSSProperties } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getRandomInt, getRandomBool } from "utils/numbers";
import { addAlphaToHexColor } from "utils/strings";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import styles from "./SupportOppose.module.scss";

/** This section will pull from generated.ts when we have data */

type SupportOpposeType = "support" | "oppose";

interface SupportOpposeActionProps {
  type: SupportOpposeType;
  selected?: boolean;
  votes: number;
  toggle: () => void;
}

function SupportOpposeAction({
  type,
  selected = false,
  votes,
  toggle,
}: SupportOpposeActionProps) {
  const Icon = type === "support" ? FaCheck : FaTimes;

  const style = useDocumentBaseStyle();

  const color = type === "support" ? "--green-support" : "--red";
  const rawColor = useMemo(() => style.getPropertyValue(color), [color, style]);

  const styleVars: CSSProperties & {
    "--action-color": string;
    "--action-background-color": string;
    "--icon-background-color": string;
    "--icon-border-color": string;
  } = {
    [`--action-color`]: `var(${color})`,
    [`--action-background-color`]: selected
      ? addAlphaToHexColor(rawColor, type === "support" ? 0.1 : 0.2)
      : "none",
    [`--icon-background-color`]: selected ? `var(${color})` : "none",
    [`--icon-border-color`]: selected ? `var(${color})` : "var(--blue)",
  };

  return (
    <div className={styles.action} style={styleVars}>
      <div className={styles.actionInner}>
        <div className={styles.votesContainer}>
          <span className={styles.iconWrapper}>
            <Icon onClick={toggle} size="1.825rem" />
          </span>
          <span className={styles.votes}>{votes}</span>
        </div>
        <div className={styles.actionText}>
          {type === "support" ? "Support" : "Oppose"}
        </div>
      </div>
    </div>
  );
}

function SupportOppose() {
  const [supportVotes, setSupportVotes] = useState(getRandomInt(400));
  const [opposeVotes, setOpposeVotes] = useState(getRandomInt(400));
  const [selected, setSelected] = useState<SupportOpposeType | null>(
    getRandomBool() ? (getRandomBool() ? "support" : "oppose") : null
  );

  const toggleSupport = useCallback(() => {
    if (selected === null) {
      setSelected("support");
      setSupportVotes(supportVotes + 1);
    } else if (selected === "support") {
      setSelected(null);
      setSupportVotes(supportVotes - 1);
    } else if (selected === "oppose") {
      setSelected("support");
      setOpposeVotes(opposeVotes - 1);
      setSupportVotes(supportVotes + 1);
    }
  }, [opposeVotes, selected, supportVotes]);

  const toggleOppose = useCallback(() => {
    if (selected === null) {
      setSelected("oppose");
      setOpposeVotes(opposeVotes + 1);
    } else if (selected === "oppose") {
      setSelected(null);
      setOpposeVotes(opposeVotes - 1);
    } else if (selected === "support") {
      setSelected("oppose");
      setOpposeVotes(opposeVotes + 1);
      setSupportVotes(supportVotes - 1);
    }
  }, [opposeVotes, selected, supportVotes]);

  return (
    <div className={styles.container}>
      <SupportOpposeAction
        type="support"
        selected={selected === "support"}
        votes={supportVotes}
        toggle={toggleSupport}
      />
      <SupportOpposeAction
        type="oppose"
        selected={selected === "oppose"}
        votes={opposeVotes}
        toggle={toggleOppose}
      />
    </div>
  );
}

export { SupportOppose };
