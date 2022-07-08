import styles from "./PasswordEntropyMeter.module.scss";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function PasswordEntropyMeter({
  length,
  valid,
  score,
  isLoading,
}: {
  length: number;
  valid: boolean;
  score: number;
  message?: string | null;
  isLoading: boolean;
}) {
  const fill = (score || 1 / 3) * 360;

  const color = valid ? "var(--green)" : "var(--red)";

  if (length < 1) return <div className={styles.container} />;

  return (
    <div className={styles.container}>
      <>
        <small>{valid ? "Strong" : "Too weak"}</small>
        {isLoading ? (
          <AiOutlineLoading3Quarters className={styles.spin} />
        ) : valid ? (
          <svg width="14" height="14" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="var(--border-action)"
              strokeWidth="15"
              fill="transparent"
            ></circle>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="var(--green)"
              strokeWidth="15"
              fill="var(--green)"
            ></circle>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M72.3156 38.0312C73.6824 36.6644 73.6824 34.4483 72.3156 33.0815C70.9488 31.7146 68.7327 31.7146 67.3659 33.0815L41.5565 58.8909L33.4247 50.7591C32.0579 49.3923 29.8418 49.3923 28.475 50.7591C27.1082 52.126 27.1082 54.3421 28.475 55.7089L39.0816 66.3155C40.4484 67.6823 42.6645 67.6823 44.0313 66.3155C44.1514 66.1955 44.2609 66.0689 44.3598 65.9369C44.4918 65.8379 44.6184 65.7284 44.7384 65.6084L72.3156 38.0312Z"
              fill="white"
            ></path>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={color}
              strokeWidth="15"
              fill="transparent"
            ></circle>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="var(--blue)"
              strokeWidth="15"
              fill="transparent"
              strokeDasharray={fill}
              strokeDashoffset={-fill}
              transform="rotate(-90 50 50)"
            ></circle>
          </svg>
        )}
      </>
    </div>
  );
}

export { PasswordEntropyMeter };
