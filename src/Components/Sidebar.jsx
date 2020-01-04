import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SidebarLinkList from './SidebarLinkList.jsx'

const useStyles = makeStyles(theme => ({
  sidebarTitle: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
  },
  sidebarBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200]
  }
}))

export default function Sidebar (props) {
  const classes = useStyles()

  return (
    <Paper className={classes.sidebarBox}>
      <Typography variant="h6" gutterBottom className={classes.sidebarTitle}>External Links</Typography>
      {props.sections.map((collection, i) => (
        <SidebarLinkList title={collection.title} items={collection.items} gameKey={props.gameKey} key={`${props.gameKey}_${collection.title}`} />
      ))}
    </Paper>
  )
}

Sidebar.propTypes = {
  gameKey: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object)
}
