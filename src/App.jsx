import {useEffect,useState} from "react"
import {
PieChart,
Pie,
Cell,
ResponsiveContainer,
Tooltip,
BarChart,
Bar,
XAxis
} from "recharts"

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
const [analytics,setAnalytics]=useState({})

useEffect(()=>{

async function load(){

try{

const p=await fetch(`${API}/portfolio`)
const portfolioData=await p.json()

const a=await fetch(`${API}/analytics`)
const analyticsData=await a.json()

setPortfolio(portfolioData)

setAnalytics(analyticsData)

}
catch(e){

console.log(e)

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
height:"100vh",
background:"#080C12",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"white",
fontSize:"30px"
}}
>

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
analytics.country_exposure || {}
).map(
([k,v])=>({
country:k,
value:v
})
)

const assetBreakdown =

portfolio.asset_class_breakdown || []
  
return(

<div
style={{
background:"#080C12",
minHeight:"100vh",
padding:"30px",
color:"white",
fontFamily:"Arial",
maxWidth:"1500px",
margin:"auto"
}}
>

<h1>

Portfolio Dashboard V2

</h1>


<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px",
marginTop:"25px"
}}
>

<Card
title="Net Worth"
value={`S$ ${portfolio.summary?.networth_sgd?.toLocaleString()}`}
/>

<Card
title="Profit"
value={`S$ ${portfolio.summary?.profit_sgd?.toLocaleString()}`}
/>

<Card
title="Diversification"
value={`${analytics.diversification?.score || 0}`}
/>

<Card
title="Top5 Concentration"
value={`${analytics.concentration?.top5_pct || 0}%`}
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

Allocation

</h2>

<ResponsiveContainer
width="100%"
height={300}
>

<PieChart>

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

<BarChart data={countries}>

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
marginTop:"30px"
}}
>

<h2>

Asset Class Breakdown

</h2>

{

assetBreakdown.map(

(asset,index)=>(

<div

key={index}

style={{

marginBottom:"35px",

paddingBottom:"25px",

borderBottom:"1px solid #1C2635"

}}

>

<h3>

{asset.asset_class}

—

S$

{asset.total_value_sgd.toLocaleString()}

(

{asset.percentage}%

)

</h3>


<table>

<thead>

<tr>

<th>

Holding

</th>

<th>

Currency

</th>

<th>

Value

</th>

<th>

Profit

</th>

</tr>

</thead>


<tbody>

{

asset.holdings.map(

(h,i)=>(

<tr key={i}>

<td>

{h.asset}

</td>

<td>

{h.currency}

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

</tbody>

</table> 

</div>

)

)

}

</div>

<h2>

Top Holdings

</h2>

<table>

<thead>

<tr>

<th>Name</th>

<th>Value</th>

</tr>

</thead>

<tbody>

{

portfolio.top_holdings?.map(
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
border:"1px solid #1C2635"
}}
>

<div
style={{
color:"#8492A6"
}}
>

{title}

</div>

<div
style={{
fontSize:"30px",
marginTop:"10px",
fontWeight:"bold"
}}
>

{value}

</div>

</div>

)

}
