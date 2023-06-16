import React from 'react'

import profilePng from "../../images/Profile.png"
import { Rating } from '@material-ui/lab'
function ReviewCard({review}) {
    const options = {
        readOnlt:true,
        value: review.rating,
        size: "large",
        precison:0.5
    }

  return (
    <div className='reviewCard'>
        <img src={profilePng} alt="User" />
        <p>{review.name}</p>
        <Rating {...options}/>
        <span>{review.comment }</span>
    </div>
  )
}

export default ReviewCard
