import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{alignItems:"center",background:"#fffaf4",borderRadius:14,color:"#b98a4a",display:"flex",fontFamily:"serif",fontSize:36,height:"100%",justifyContent:"center",width:"100%"}}>✦</div>,
    size,
  );
}
