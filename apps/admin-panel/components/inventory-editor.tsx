"use client";
import { FormEvent, useState } from "react";
import type { InventoryItem } from "../lib/api";
import { updateInventory } from "../lib/api";
export function InventoryEditor({ initial }: { initial: InventoryItem[] }) {
  const [items,setItems]=useState(initial);
  async function save(event:FormEvent<HTMLFormElement>, item:InventoryItem){event.preventDefault();const d=new FormData(event.currentTarget);const saved=await updateInventory(item.id,{quantity:Number(d.get("quantity")),low_stock_threshold:Number(d.get("threshold"))});setItems(xs=>xs.map(x=>x.id===item.id?saved:x));}
  return <div className="table"><div className="row inventory-row"><strong>تنوع</strong><strong>تعداد / رزرو</strong><strong>هشدار و عملیات</strong></div>{items.length?items.map(item=><form className="row inventory-row" key={item.id} onSubmit={e=>save(e,item)}><span dir="ltr">{item.variant}</span><span><input name="quantity" type="number" min="0" defaultValue={item.quantity}/> / {item.reserved_quantity}</span><span><input name="threshold" type="number" min="0" defaultValue={item.low_stock_threshold}/><button>ذخیره</button>{item.is_low_stock&&<b className="text-danger"> کم‌موجودی</b>}</span></form>):<div className="empty-state">موجودی ثبت نشده است.</div>}</div>;
}
