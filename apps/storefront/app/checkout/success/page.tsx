import { PaymentResult } from "../../../components/payment-result";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { payment?: string } }) {
  return <main className="ms-container"><div className="ms-result-page"><PaymentResult expected="success" paymentId={searchParams.payment}/></div></main>;
}
