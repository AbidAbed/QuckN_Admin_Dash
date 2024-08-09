import React from 'react'
import "./areachart.css"
import { AreaChart , Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const AreaChartComp = () => {

    const data = [
        {
          name: 'Jan',
          groups: 100,
        },
        {
          name: 'Feb',
          groups: 70,
        },
        {
          name: 'Mar',
          groups: 87,
        },
        {
          name: 'Apr',
          groups: 60,
        },
        {
          name: 'May',
          groups: 70,
        },
        {
          name: 'Jun',
          groups: 90,
        },
        {
          name: 'Jul',
          groups: 30,
        },
      ];

      
      
  return (
    <div className='areaChart'>

        <h3 className='areaChartTitle'>Created Groups</h3>

        <ResponsiveContainer width="95%" aspect={4/1}>
            <AreaChart data={data}>
                <CartesianGrid stroke='#427884 ' strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="groups" stroke="#427884 " fill='#427884 ' />
            </AreaChart>
        </ResponsiveContainer>

    </div>
  )
}


export default AreaChartComp