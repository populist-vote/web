import styles from "./BillCard.module.scss"

type Bill = {
  billNumber: string,
  title: string,
  legislationStatus:string,
}

const BillCard = ({
  bill,
  itemId
} : {
  bill: Bill,
  itemId: string
}) => {

  return (
    <div className={styles.billCard}>
      <div className={styles.cardContent}>
        <h1 className={styles.billNumber}>{bill.billNumber}</h1>
        <h2 className={styles.billTitle}>{bill.title}</h2>
        <span className={styles.statusPill}>
          {bill.legislationStatus}
        </span>
      </div>
    </div>
  )
}

export default BillCard
