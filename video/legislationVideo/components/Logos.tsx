import React from "react";
import { LogoText } from "../../../components/Logo";
import Image from "next/image";
import MPRLogo from "../../../public/images/video-generator/MPR-logo.png";
import styles from "../LegislationVideo.module.scss";
import { Animated, Fade, Move } from "remotion-animated";

const Logos = () => {
  return (
    <section className={styles.endTitle}>
      <div>
        logo
        <Image height={346} width={826} src={MPRLogo} alt="MPR Logo" />
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

export default Logos;
