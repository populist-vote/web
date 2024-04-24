import React from "react";
import { LogoText } from "components/Logo";
import Image from "next/legacy/image";
import MPRLogo from "public/images/video-generator/MPR-logo.png";
import styles from "../LegislationVideo.module.scss";

const Logos = () => {
  return (
    <section className={styles.endTitle}>
      <div>
        <Image src={MPRLogo} alt="MPR Logo" />
      </div>
      <div className={styles.container}>
        <span className={styles.poweredBy}>Powered by</span>
        <div className={styles.logo}>
          <LogoText />
        </div>
      </div>
    </section>
  );
};

export default Logos;
