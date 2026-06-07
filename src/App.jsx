import { useEffect, useState } from "react"

import {
PieChart,
Pie,
Cell,
ResponsiveContainer,
Tooltip,
BarChart,
Bar,
XAxis
}

from "recharts"

const API="https://portfolio-dashboard-backend-4ull.onrender.com"

const COLORS=[

"#00D4FF",
"#00E5A0",
"#FFB830",
"#8B5CF6",
"#FF4D6A"

]

export default function App(){

const [loading,setLoading]=useState(true)

const [portfolio,setPortfolio]=useState({})

const [selected,setSelected]=useState(null)

useEffect(()=>{

async function load(){

try{

const res=

await fetch(

`${API}/portfolio`

)

const data=

await res.json()

setPortfolio(data)

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

if(

loading ||

!portfolio.summary

){

return(

<div style={{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:"#080C12",

color:"white"

}}>

Loading Portfolio...

</div>

)

}

const allocation=

Object.entries(

portfolio.allocation || {}

).map(

([k,v])=>({

name:k,

value:v

})

)

const countries=

Object.entries(

portfolio.currency_exposure || {}

).map(

([k,v])=>({

country:k,

value:v

})

)

const holdings=

selected

?

(portfolio.holdings || []).filter(

x=>x.sub_type===selected

)

:

[]

const grouped={}

holdings.forEach(h=>{

if(

!grouped[h.currency]

){

grouped[h.currency]=[]

}

grouped[h.currency].push(h)

})

return(

<div style={{

background:"#080C12",

minHeight:"100vh",

padding:"30px",

fontFamily:"Arial",

color:"white",

maxWidth:"1500px",

margin:"auto"

}}>

<h1>

Portfolio Dashboard

</h1>


<div style={{

display:"grid",

gridTemplateColumns:

"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

marginTop:"25px"

}}>

<Card

title="Net Worth"

value={`S$ ${portfolio.summary.networth_sgd.toLocaleString()}`}

/>

<Card

title="Profit"

value={`S$ ${portfolio.summary.profit_sgd.toLocaleString()}`}

/>

<Card

title="Asset Classes"

value={

portfolio.asset_class_breakdown?.length || 0

}

/>

<Card

title="Holdings"

value={

portfolio.holdings?.length || 0

}

/>

</div>


<div style={{

display:"grid",

gridTemplateColumns:"1fr 1fr",

gap:"30px",

marginTop:"40px"

}}>

<div className="panel">

<h2>

Allocation

</h2>

<ResponsiveContainer

width="100%"

height={300}

>

<PieChart>

<Tooltip/>

<Pie

data={allocation}

dataKey="value"

outerRadius={110}

>

{

allocation.map(

(x,i)=>

<Cell

key={i}

fill={COLORS[i%5]}

/>

)

}

</Pie>

</PieChart>

</ResponsiveContainer>

</div>


<div className="panel">

<h2>

Currency Exposure

</h2>

<ResponsiveContainer

width="100%"

height={300}

>

<BarChart

data={countries}

>

<XAxis

dataKey="country"

/>

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

marginTop:"30px"

}}

>

<h2>

Asset Classes

</h2>

<table>

<thead>

<tr>

<th>

Asset Class

</th>

<th>

Current Value

</th>

<th>

Portfolio %

</th>

</tr>

</thead>

<tbody>

{

portfolio.asset_class_breakdown?.map(

(row,i)=>(

<tr

key={i}

onClick={()=>

setSelected(

row.asset_class

)

}

style={{

cursor:"pointer"

}}

>

<td>

{row.asset_class}

</td>

<td>

S$

{row.total_value_sgd.toLocaleString()}

</td>

<td>

{row.percentage}%

</td>

</tr>

)

)

}

</tbody>

</table>

</div>


{

selected &&

<div

className="panel"

style={{

marginTop:"30px"

}}

>

<h2>

{selected}

Holdings

</h2>

{

Object.entries(

grouped

).map(

([currency,list])=>{

const totalValue=

list.reduce(

(a,b)=>a+b.value_sgd,

0

)

const totalProfit=

list.reduce(

(a,b)=>a+b.profit_sgd,

0

)

return(

<div

key={currency}

style={{

marginBottom:"40px"

}}

>

<h3>

{currency}

Holdings

</h3>

<table>

<thead>

<tr>

<th>Name</th>

<th>Value SGD</th>

<th>Profit SGD</th>

</tr>

</thead>

<tbody>

{

list.map(

(h,i)=>(

<tr key={i}>

<td>

{h.asset}

</td>

<td>

S$

{h.value_sgd.toLocaleString()}

</td>

<td>

S$

{h.profit_sgd.toLocaleString()}

</td>

</tr>

)

)

}

<tr>

<td>

TOTAL

</td>

<td>

S$

{totalValue.toLocaleString()}

</td>

<td>

S$

{totalProfit.toLocaleString()}

</td>

</tr>

</tbody>

</table>

</div>

)

}

)

}

</div>

}


<style>

{`

.panel{

background:#111820;

padding:25px;

border-radius:18px;

border:1px solid #1C2635;

}

table{

width:100%;

border-collapse:collapse;

}

td,th{

padding:14px;

border-bottom:1px solid #1C2635;

text-align:left;

}

tr:hover{

background:#16212F;

}

`}

</style>

</div>

)

}

function Card({

title,

value

}){

return(

<div style={{

background:"#111820",

padding:"25px",

borderRadius:"18px",

border:"1px solid #1C2635"

}}>

<div style={{

color:"#7F8A9B"

}}>

{title}

</div>

<div style={{

fontSize:"30px",

marginTop:"10px",

fontWeight:"bold"

}}>

{value}

</div>

</div>

)

}
