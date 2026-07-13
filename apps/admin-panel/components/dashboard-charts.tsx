"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#c7973e", "#dc8179", "#dbc398", "#9ca3af", "#34464c", "#82a27a"];

export function SalesChart({ data }: { data: Array<{ date: string; value: string; orders: number }> }) {
  const chart = data.map(item => ({ ...item, value: Number(item.value), label: new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" }).format(new Date(item.date)) }));
  if (!chart.length) return <ChartEmpty />;
  return <div className="real-chart"><ResponsiveContainer width="100%" height={230}><AreaChart data={chart}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c6912d" stopOpacity={.3}/><stop offset="1" stopColor="#c6912d" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eee9e2" vertical={false}/><XAxis dataKey="label" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} width={45}/><Tooltip formatter={(value:number) => `${value.toLocaleString("fa-IR")} تومان`}/><Area dataKey="value" fill="url(#salesFill)" stroke="#c6912d" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div>;
}

export function CategoryCharts({ data }: { data: Array<{ name: string; value: string }> }) {
  const chart = data.map(item => ({ ...item, value: Number(item.value) }));
  if (!chart.length) return <ChartEmpty />;
  return <div className="category-real-charts"><ResponsiveContainer width="48%" height={220}><PieChart><Pie data={chart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>{chart.map((entry,index)=><Cell key={entry.name} fill={colors[index%colors.length]}/>)}</Pie><Tooltip formatter={(value:number)=>value.toLocaleString("fa-IR")}/></PieChart></ResponsiveContainer><ResponsiveContainer width="52%" height={220}><BarChart data={chart} layout="vertical"><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={72} tick={{fontSize:10}}/><Tooltip formatter={(value:number)=>value.toLocaleString("fa-IR")}/><Bar dataKey="value" fill="#c6912d" radius={[4,4,4,4]}/></BarChart></ResponsiveContainer></div>;
}

function ChartEmpty(){return <div className="chart-empty">هنوز دادهٔ کافی برای نمایش نمودار وجود ندارد.</div>}
