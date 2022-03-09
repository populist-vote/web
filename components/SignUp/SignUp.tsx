import { LogoText } from "components/LogoText/LogoText";
import styles from "./SignUp.module.scss";

export function SignUp() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div>
          <LogoText />
        </div>
      </div>
      <div className={styles.formWrapper}>
        <h1 className="title">Get Started</h1>
        <p>All we need is your email to get started.</p>
        <form>
          <input type="text" name="email" placeholder="Email" />
          <button>Create Account</button>
        </form>
      </div>
    </div>
  );
}
