import React from 'react'
import "./chart.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Chart = () => {

    const data = [
        {
          name: 'January',
          "sentMessages" : 4000
        },
        {
          name: 'Febrauary',
          "sentMessages" : 3300
        },
        {
          name: 'March',
          "sentMessages" : 7000
        },
        {
          name: 'April',
          "sentMessages" : 5000
        },
        {
          name: 'May',
          "sentMessages" : 5550
        },
        {
          name: 'Jun',
          "sentMessages" : 3450
        },
        {
          name: 'July',
          "sentMessages" : 7000
        },
        {
          name: 'August',
          "sentMessages" : 6000
        },
        {
          name: 'September',
          "sentMessages" : 2000
        },
        {
          name: 'Octobor',
          "sentMessages" : 4400
        },
        {
          name: 'November',
          "sentMessages" : 7000
        },
        {
          name: 'December',
          "sentMessages" : 3500
        },
      ];



  return (
    <div className='chart'>
        
        <h3 className='chartTitle'>Messages per month</h3>

        <ResponsiveContainer style={{marginTop : "10px"}} width="100%" aspect={4/1}>
            <LineChart data={data}>
                <XAxis dataKey="name" stroke='#427884 '/>
                <Line type="monotone" dataKey="sentMessages" stroke='#427884 '/>
                <Tooltip/>
                <CartesianGrid stroke='#427884 ' strokeDasharray="5 5"/>
            </LineChart>
        </ResponsiveContainer>

    </div>
  )
}


export default Chart