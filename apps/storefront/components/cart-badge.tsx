"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentCart } from "../lib/cart";
import { MsIcon } from "./storefront-page-kit";

export function CartBadge(){const [count,setCount]=useState(0);useEffect(()=>{getCurrentCart().then(cart=>setCount(cart?.items.reduce((sum,item)=>sum+item.quantity,0)??0)).catch(()=>setCount(0));},[]);return <Link href="/cart" aria-label={`سبد خرید، ${count} کالا`}><MsIcon name="bag"/>{count?<b>{count.toLocaleString("fa-IR")}</b>:null}</Link>;}
