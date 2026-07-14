import { PaymentResult } from "../../../components/payment-result";

export default function PaymentFailurePage({ searchParams }: { searchParams: { payment?: string } }) {
  return <main className="ms-container"><div className="ms-result-page"><PaymentResult expected="failure" paymentId={searchParams.payment}/></div></main>;
}
