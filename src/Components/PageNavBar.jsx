import React from 'react'
import PropTypes from 'prop-types'

import { Toolbar, Link } from '@mui/material'

const toolbarSecondarySX = {
  justifyContent: 'space-between',
  overflowX: 'auto'
}

const toolbarLinkSX = {
  padding: theme => theme.spacing(1),
  flexShrink: 0
}

export default function PageNavBar (props) {
  const { sections } = props
  return (
    <Toolbar component="nav" variant="dense" sx={toolbarSecondarySX}>
      {sections.map((section, i) => (
        <Link
          color="inherit"
          noWrap
          key={i}
          variant="body2"
          href={`#${section.replace(/[\W]/g, '')}Anchor`}
          sx={toolbarLinkSX}
        >
          {section}
        </Link>
      ))}
    </Toolbar>
  )
}

PageNavBar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired
}
