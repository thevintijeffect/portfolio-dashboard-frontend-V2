import { useEffect, useState } from "react"
import {
PieChart,
Pie,
Cell,
ResponsiveContainer,
BarChart,
Bar,
XAxis,
Tooltip
} from "recharts"

const API="YOUR_RENDER_BACKEND_URL"

const COLORS=[
"#00D4FF",
"#00E5A0",
"#FFB830",
"#8B5CF6",
"#FF4D6A"
]

export default function App(){

const [loading,setLoading]=useState(true)
const [portfolio,setPortfolio]=useState(null)
const [analytics,setAnalytics]=useState(null)

useEffect(()=>{

async function load(){

try{

const p=await fetch(`${API}/portfolio`)
const pdata=await p.json()

const a=await fetch(`${API}/analytics`)
const adata=await a.json()

setPortfolio(pdata)
setAnalytics(adata)

}
catch(err){

console.log(err)

}
finally{

setLoading(false)

}

}

load()

},[])

if(loading){

return(

<div
style={{
background:"#080C12",
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"white",
fontSize:"24px"
}}
>

Loading Portfolio...

</div>

)

}

const allocationData=Object.entries(
portfolio.allocation
).map(([k,v])=>({

name:k,
value:v

}))

const countryData=Object.entries(
analytics.country_exposure
).map(([k,v])=>({

country:k,
value:v

}))

return(

<div
style={{
background:"#080C12",
minHeight:"100vh",
padding:"30px",
color:"white",
fontFamily:"Arial"
}}
>

<h1 style={{fontSize:"40px"}}>

Portfolio Dashboard V2

</h1>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px",
marginTop:"30px"
}}
>

<Card
title="Net Worth"
value={`S$ ${portfolio.summary.networth_sgd.toLocaleString()}`}
/>

<Card
title="Profit"
value={`S$ ${portfolio.summary.profit_sgd.toLocaleString()}`}
/>

<Card
title="Diversification"
value={`${analytics.diversification.score}`}
/>

<Card
title="Largest Holding"
value={`${analytics.concentration.largest_holding_pct}%`}
/>

</div>


<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"30px",
marginTop:"40px"
}}
>

<div className="panel">

<h2>

Asset Allocation

</h2>

<ResponsiveContainer
width="100%"
height={300}
>

<PieChart>

<Pie
data={allocationData}
dataKey="value"
outerRadius={110}
>

{

allocationData.map(
(entry,index)=>

<Cell
key={index}
fill={COLORS[index%COLORS.length]}
/>

)

}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>


<div className="panel">

<h2>

Country Exposure

</h2>

<ResponsiveContainer
width="100%"
height={300}
>

<BarChart
data={countryData}
>

<XAxis dataKey="country"/>

<Tooltip/>

<Bar
dataKey="value"
fill="#00D4FF"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>


<div
className="panel"
style={{
marginTop:"40px"
}}
>

<h2>

Top Holdings

</h2>

<table
style={{
width:"100%"
}}
>

<thead>

<tr>

<th>Name</th>

<th>Value SGD</th>

</tr>

</thead>

<tbody>

{

portfolio.top_holdings.map(
(x,i)=>(

<tr key={i}>

<td>

{x.asset}

</td>

<td>

S$ {x.value_sgd.toLocaleString()}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>


<style>

{`

.panel{

background:#111820;

padding:25px;

border-radius:18px;

border:1px solid #1c2635;

}

table{

border-collapse:collapse;

}

th,td{

padding:12px;

border-bottom:1px solid #1c2635;

text-align:left;

}

`}

</style>

</div>

)

}


function Card({title,value}){

return(

<div
style={{
background:"#111820",
padding:"25px",
borderRadius:"18px",
border:"1px solid #1c2635"
}}
>

<div
style={{
color:"#8CA0B3",
fontSize:"14px"
}}
>

{title}

</div>

<div
style={{
fontSize:"32px",
marginTop:"10px",
fontWeight:"bold"
}}
>

{value}

</div>

</div>

)

}
