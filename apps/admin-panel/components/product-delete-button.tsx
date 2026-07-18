"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "../lib/api";
export function ProductDeleteButton({id}:{id:string}){const router=useRouter();return <button className="delete" title="حذف" onClick={async()=>{if(confirm("این محصول حذف شود؟")){await deleteProduct(id);router.refresh();}}}><Trash2/></button>}
