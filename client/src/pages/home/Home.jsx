import React from 'react'
import "./home.css"
import Featured from '../../components/featured/Featured'
import Chart from '../../components/chart/Chart'
import AreaChart from '../../components/areaChart/AreaChart'


const Home = () => {
  return (
    <div className='home'>
        <Featured/>
        <Chart/>
    </div>
  )
}

export default Home