import styles from "./BillCard.module.scss"

type Bill = {
  billNumber: string,
  title: string,
  legislationStatus:string,
}

const BillCard = ({
  bill
} : {
  bill: Bill
}) => {

  return (
    <div className={styles.billCard} key={bill.billNumber}>
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
