import { showcaseProducts } from "./showcase-data";

export type CheckoutLine = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  visual: string;
  sku: string;
  unitPrice: number;
  quantity: number;
};

export const checkoutLines: CheckoutLine[] = [
  {
    id: "line-heart",
    title: "گردنبند قلب مینیمال",
    subtitle: "رنگ: طلایی | طول زنجیر: ۴۵ سانتی‌متر",
    slug: "minimal-necklace",
    visual: "heart",
    sku: "N112",
    unitPrice: 1390000,
    quantity: 1,
  },
  {
    id: "line-earrings",
    title: "گوشواره مروارید اشکی",
    subtitle: "طلایی / مروارید طبیعی",
    slug: "pearl-earrings",
    visual: "earrings",
    sku: "E205",
    unitPrice: 720000,
    quantity: 1,
  },
  {
    id: "line-bracelet",
    title: "دستبند زنجیری کلاسیک",
    subtitle: "طلایی | سایز: ۱۴ سانتی‌متر",
    slug: "cartier-chain-bracelet",
    visual: "bracelet",
    sku: "B310",
    unitPrice: 750000,
    quantity: 1,
  },
];

export const orderTotals = {
  subtotal: 2860000,
  discount: 269000,
  shipping: 0,
  vatIncluded: 649000,
  payable: 2490000,
  checkoutPayable: 2421000,
};

export const profileOrders = [
  {
    id: "MS-1403-000856",
    number: "۱۰۳۴۵۶",
    date: "۱۴۰۴/۰۳/۱۵",
    status: "در حال آماده‌سازی",
    statusTone: "warm",
    amount: 1290000,
    paid: true,
    eta: "سه‌شنبه ۲۲ خرداد",
    items: checkoutLines,
  },
  {
    id: "MS-1403-000789",
    number: "۱۰۳۹۸۷",
    date: "۱۴۰۳/۰۳/۰۸",
    status: "ارسال شده",
    statusTone: "blue",
    amount: 740000,
    paid: true,
    eta: "تحویل به پست",
    items: checkoutLines.slice(0, 2),
  },
  {
    id: "MS-1403-000654",
    number: "۱۰۳۴۵۱",
    date: "۱۴۰۳/۰۳/۰۳",
    status: "تحویل شده",
    statusTone: "green",
    amount: 450000,
    paid: true,
    eta: "تحویل شده",
    items: checkoutLines.slice(1, 3),
  },
  {
    id: "MS-1403-000421",
    number: "۱۰۲۷۸۴",
    date: "۱۴۰۳/۰۲/۲۵",
    status: "تحویل شده",
    statusTone: "green",
    amount: 320000,
    paid: true,
    eta: "تحویل شده",
    items: checkoutLines,
  },
  {
    id: "MS-1403-000256",
    number: "۱۰۲۴۰۲",
    date: "۱۴۰۳/۰۲/۱۵",
    status: "لغو شده",
    statusTone: "red",
    amount: 280000,
    paid: true,
    eta: "لغو شده",
    items: checkoutLines.slice(0, 1),
  },
];

export const suggestedProducts = showcaseProducts.slice(0, 4);

export function toman(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}
