import React from 'react'
import TaskChartStuts from './chartTaskStuts'
import DoctorChartArea from './chartdoctors'
import ChartTaskNumber from './chartTaskNumber'
import ChartTaskNumberType from './chartTaskNumberType'

const page = () => {
  return (
    <div>
       <TaskChartStuts/>
       <DoctorChartArea/>
       <ChartTaskNumber/>
       <ChartTaskNumberType/>
  

   </div>
  )
}

export default page