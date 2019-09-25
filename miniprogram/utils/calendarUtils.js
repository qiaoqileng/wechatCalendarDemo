/**
 * 默认计算6个月(前后3个月)
 */
export const getResultDays = (targetDays,dateRange=6)=>{
  if(Array.isArray(targetDays) && targetDays.length > 0){
    targetDays.forEach(targetDay=>{
      let date = new Date(targetDay.date)

    })
  } else {
    return targetDays
  }
} 