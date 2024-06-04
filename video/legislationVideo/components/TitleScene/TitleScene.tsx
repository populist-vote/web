import React from "react";
import { Animated } from "remotion-animated";
import { Move, Fade } from "remotion-animated";
import { IssueTags, LegislationStatusBox } from "../../../../components";
import { splitAtDigitAndJoin } from "../../../../utils/strings";
import { AnimatedDivider } from "../AnimatedDivider";
import styles from "./TitleScene.module.scss";
import { getYear } from "../../../../utils/dates";
import { BillStatus, IssueTagResult, State } from "generated";

interface TitleSceneProps {
  title: string;
  issueTags?: IssueTagResult[];
  status: BillStatus;
  state?: State;
  billNumber: string;
  startDate: string;
  endDate: string;
}

const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  issueTags = [],
  status,
  state,
  billNumber,
  startDate,
  endDate,
}) => {
  const issueTagNames = issueTags.map((tag) => tag.name);
  const formattedState = state ? splitAtDigitAndJoin(state) : "U.S.";
  const formattedBillNumber = billNumber
    ? splitAtDigitAndJoin(billNumber)
    : "No Bill Number";

  return (
    <div className={styles.titleScene}>
      <header>
        <div className={styles.topContainer}>
          <Animated
            animations={[
              Move({ y: 0, initialY: 30 }),
              Fade({ to: 1, initial: 0 }),
            ]}
            delay={20}
            style={{ opacity: 0 }}
          >
            <h3>
              {getYear(startDate)} - {endDate ? getYear(endDate) : "CURRENT"}{" "}
              SESSION
            </h3>
          </Animated>
        </div>

        <div className={styles.middleContainer}>
          <AnimatedDivider />
        </div>

        <div className={styles.bottomContainer}>
          <Animated
            animations={[
              Move({ y: 0, initialY: 30 }),
              Fade({ to: 1, initial: 0 }),
            ]}
            delay={40}
            style={{ opacity: 0 }}
          >
            <h2>
              {formattedState ? `${formattedState} - ` : "U.S. - "}
              {splitAtDigitAndJoin(formattedBillNumber)}
            </h2>
          </Animated>
        </div>
      </header>
      <div>
        <Animated
          animations={[
            Move({ y: 0, initialY: 30 }),
            Fade({ to: 1, initial: 0 }),
          ]}
          style={{ opacity: 0 }}
          delay={60}
        >
          <h1>{title}</h1>
        </Animated>

        {issueTagNames.length > 0 && (
          <Animated
            animations={[
              Move({ y: 0, initialY: 30 }),
              Fade({ to: 1, initial: 0 }),
            ]}
            style={{ opacity: 0 }}
            delay={80}
          >
            <div className={styles.issueTagsContainer}>
              <IssueTags tags={issueTags} />
            </div>
          </Animated>
        )}
        <Animated
          animations={[
            Move({ y: 0, initialY: 30 }),
            Fade({ to: 1, initial: 0 }),
          ]}
          delay={100}
          style={{ opacity: 0 }}
        >
          <div className={styles.legislationStatusContainer}>
            <LegislationStatusBox status={status} />
          </div>
        </Animated>
      </div>
    </div>
  );
};

export default TitleScene;
