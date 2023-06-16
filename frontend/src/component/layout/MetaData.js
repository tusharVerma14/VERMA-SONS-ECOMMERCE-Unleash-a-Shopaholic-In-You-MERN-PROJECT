import React from 'react'
// helmet used to set title on each page along with  the  type visted page according to type of page visited
import Helmet from 'react-helmet'
const MetaData = ({title}) => {
  return (
    <Helmet>
        <title>{title}</title>
    </Helmet>
  )
}

export default MetaData;
