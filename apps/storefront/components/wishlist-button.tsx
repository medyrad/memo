"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { addWishlistProduct } from "../lib/account";

export function WishlistButton({productId}:{productId:string}){const [message,setMessage]=useState("");return <div><button className="ms-outline-button" type="button" onClick={async()=>{try{await addWishlistProduct(productId);setMessage("به علاقه‌مندی‌ها اضافه شد.");}catch(error){setMessage(error instanceof Error?error.message:"ثبت انجام نشد.");}}}>افزودن به علاقه‌مندی‌ها <Heart size={18}/></button>{message?<small>{message}</small>:null}</div>;}
