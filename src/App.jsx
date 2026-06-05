import {

useEffect,

useState

}

from "react"

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
"#8B5CF6"

]

export default function App(){

const [portfolio,setPortfolio]=useState({})

const [selected,setSelected]=useState(null)

useEffect(()=>{

fetch(`${API}/portfolio`)

.then(

r=>r.json()

)

.then(

setPortfolio

)

},[])

if(!portfolio.summary){

return <div>Loading...</div>

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

const holdings=

selected

?

portfolio.holdings.filter(

x=>x.sub_type===selected

)

:

[]

const grouped={}

holdings.forEach(h=>{

if(!grouped[h.currency])

grouped[h.currency]=[]

grouped[h.currency].push(h)

})

return(

<div style={{

background:"#080C12",

color:"white",

padding:"30px",

minHeight:"100vh"

}}>

<h1>

Portfolio Dashboard

</h1>

<ResponsiveContainer

width="100%"

height={300}

>

<PieChart>

<Pie

data={allocation}

dataKey="value"

outerRadius={100}

>

{

allocation.map(

(x,i)=>

<Cell

fill={COLORS[i%4]}

key={i}

/>

)

}

</Pie>

</PieChart>

</ResponsiveContainer>

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

Investment

</th>

<th>

Current

</th>

<th>

Profit

</th>

<th>

Profit %

</th>

</tr>

</thead>

<tbody>

{

portfolio.asset_summary?.map(

(row,i)=>(

<tr

key={i}

onClick={()=>setSelected(

row.sub_type

)}

style={{

cursor:"pointer"

}}

>

<td>

{row.sub_type}

</td>

<td>

S$

{row.investment_sgd.toLocaleString()}

</td>

<td>

S$

{row.value_sgd.toLocaleString()}

</td>

<td>

S$

{row.profit_sgd.toLocaleString()}

</td>

<td>

{row.profit_pct.toFixed(2)}%

</td>

</tr>

)

)

}

</tbody>

</table>


{

selected &&

<div>

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

(a,b)=>a+b.market_value,

0

)

const totalInv=

list.reduce(

(a,b)=>a+b.investment_value,

0

)

const totalSGD=

list.reduce(

(a,b)=>a+b.value_sgd,

0

)

return(

<div key={currency}>

<h3>

{currency}

</h3>

<table>

<thead>

<tr>

<th>Name</th>

<th>Qty</th>

<th>Price</th>

<th>Market</th>

<th>Inv Price</th>

<th>Investment</th>

<th>Gain%</th>

<th>Gain</th>

</tr>

</thead>

<tbody>

{

list.map(

(h,i)=>(

<tr key={i}>

<td>{h.asset}</td>

<td>{h.qty}</td>

<td>{h.current_price}</td>

<td>{h.market_value}</td>

<td>{h.investment_price}</td>

<td>{h.investment_value}</td>

<td>{h.profit_pct.toFixed(2)}%</td>

<td>{(h.market_value-h.investment_value).toFixed(2)}</td>

</tr>

)

)

}

<tr>

<td>

TOTAL

</td>

<td/>

<td/>

<td>

{totalValue.toFixed(2)}

</td>

<td/>

<td>

{totalInv.toFixed(2)}

</td>

<td/>

<td>

{(totalValue-totalInv).toFixed(2)}

</td>

</tr>

<tr>

<td>

TOTAL SGD

</td>

<td/>

<td/>

<td>

S$

{totalSGD.toFixed(2)}

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

</div>

)

}
