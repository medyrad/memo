import { ImageResponse } from "next/og";
export const size={width:64,height:64};export const contentType="image/png";
export default function Icon(){return new ImageResponse(<div style={{alignItems:"center",background:"#fffaf4",borderRadius:14,display:"flex",height:"100%",justifyContent:"center",width:"100%"}}><div style={{background:"#b98a4a",height:24,transform:"rotate(45deg)",width:24}}/></div>,size)}
