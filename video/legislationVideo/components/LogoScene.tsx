import React from "react";
import styles from "../LegislationVideo.module.scss";
import { Animated, Fade, Move } from "remotion-animated";
import { LogoText } from "components";
import { Img, staticFile } from "remotion";

// Need to make this dynamic
const MPRLogoPath = "/images/mpr-logo.png";

const LogoScene = () => {
  return (
    <section className={styles.endTitle}>
      <div>
        <Img
          height={346}
          width={826}
          src={staticFile(MPRLogoPath)}
          alt="MPR Logo"
        />
      </div>
      <Animated
        animations={[Move({ y: 0, initialY: 20 }), Fade({ to: 1, initial: 0 })]}
        delay={20}
        style={{ opacity: 0 }}
      >
        <div className={styles.container}>
          <span className={styles.poweredBy}>Powered by</span>
          <div className={styles.logo}>
            <LogoText />
          </div>
        </div>
      </Animated>
    </section>
  );
};

export default LogoScene;
