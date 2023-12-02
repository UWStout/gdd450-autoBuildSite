import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Link } from '@mui/material'

const sidebarSectionSX = {
  marginTop: theme => theme.spacing(1)
}

export default function SidebarLinkList (props) {
  const { items, title, gameKey } = props
  if (items.length === 0) { return null }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom sx={sidebarSectionSX}>
        {title}
      </Typography>
      { items.map((listItem) => (
        <Link display="block" variant="body1" target="_blank" rel="noreferrer" href={listItem.href} key={`${gameKey}_${listItem.title}`}>
          {listItem.title}
        </Link>
      )) }
    </React.Fragment>
  )
}

SidebarLinkList.propTypes = {
  gameKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}
