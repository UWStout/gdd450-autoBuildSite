import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Link } from '@mui/material'

export default function Copyright (props) {
  const { siteText, siteHref, copyrightYear } = props
  return (
    <Typography variant="body2" color="textSecondary" align="center" rel="noreferrer" target="_blank">
      {'Web Site Content Copyright © '}
      <Link color="inherit" href={siteHref}>
        {siteText}
      </Link>
      {' '}
      {(copyrightYear || new Date().getFullYear())}
      {'.'}
    </Typography>
  )
}

Copyright.propTypes = {
  copyrightYear: PropTypes.number,
  siteHref: PropTypes.string.isRequired,
  siteText: PropTypes.string.isRequired
}

Copyright.defaultProps = {
  copyrightYear: 2023
}
