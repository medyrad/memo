import { CartView } from "../../components/cart-view";
import { getProducts } from "../../lib/api";
import { toCatalogProduct } from "../../lib/catalog";

export default async function CartPage() {
  const suggestions = (await getProducts()).slice(0, 4).map(toCatalogProduct);
  return <main className="ms-container"><CartView suggestions={suggestions}/></main>;
}
