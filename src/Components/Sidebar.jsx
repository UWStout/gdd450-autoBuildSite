import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography, Grid, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SidebarLinkList from './SidebarLinkList.jsx'

import * as EngineIcons from './EngineIcons.jsx'
import * as PlatformIcons from './PlatformIcons.jsx'
import * as SocialLinksIcons from './SocialLinksIcons.jsx'

const useStyles = makeStyles(theme => ({
  sidebarTitle: {
    marginTop: theme.spacing(1)
  },
  sidebarBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200]
  }
}))

export default function Sidebar (props) {
  const classes = useStyles()

  let engineSec = null
  if (props.engine) {
    let icon = ''
    switch (props.engine.toLowerCase()) {
      case 'unreal': case 'ue4': icon = (<EngineIcons.UE4Icon />); break
      case 'unity': icon = (<EngineIcons.UnityIcon />); break
    }
    engineSec = (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h6">Engine:</Typography>
        </Grid>
        <Grid item xs={2}>{icon}</Grid>
        <Grid item xs={6}>
          <Typography variant="h6" align="right" display="inline" width={1.0}>
            {`v${props.engineVersion}`}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  let platformsSec = null
  if (props.buildPlatforms) {
    const icons = props.buildPlatforms.map((platform) => {
      switch (platform.toLowerCase()) {
        case 'win': case 'win64': case 'windows': case 'ms windows': case 'microsoft windows':
          return (<PlatformIcons.WindowsIcon key={`${props.gameKey}_buildicon_win64`} />)

        case 'mac64': case 'macos': case 'mac os': case 'osx':
          return (<PlatformIcons.MacOSIcon key={`${props.gameKey}_buildicon_macos`} />)

        case 'linux': case 'lnx': case 'unix': case '*nix': case 'nix':
          return (<PlatformIcons.LinuxIcon key={`${props.gameKey}_buildicon_linux`} />)

        case 'android':
          return (<PlatformIcons.AndroidIcon key={`${props.gameKey}_buildicon_android`} />)

        case 'ios': case 'apple ios': case 'ipad os':
          return (<PlatformIcons.IOSIcon key={`${props.gameKey}_buildicon_ios`} />)

        case 'playstation': case 'playstation4': case 'playstation 4': case 'ps4':
          return (<PlatformIcons.PlaystationIcon key={`${props.gameKey}_buildicon_ps4`} />)

        case 'xbox': case 'xbox one': case 'xbox 1': case 'xbone': case 'xb1': case 'xb':
          return (<PlatformIcons.XBoxIcon key={`${props.gameKey}_buildicon_xb1`} />)

        case 'nintendo switch': case 'switch': case 'nintendoswitch': case 'ns': case 'nsw':
          return (<PlatformIcons.NintendoSwitchIcon key={`${props.gameKey}_buildicon_nsw`} />)

        case 'web': case 'html': case 'html5': case 'web browser': case 'webbrowser':
          return (<SocialLinksIcons.WebsiteIcon key={`${props.gameKey}_buildicon_web`} />)

        default:
          return (<div />)
      }
    })

    platformsSec = (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h6">Builds:</Typography>
        </Grid>
        <Grid item xs={8}>
          {icons}
        </Grid>
      </Grid>
    )
  }

  return (
    <Paper className={classes.sidebarBox}>
      {engineSec}
      {platformsSec}
      {(engineSec || platformsSec) &&
        <Divider variant="fullWidth" className={classes.sidebarTitle} />}
      {props.sections.map((collection, i) => (
        <SidebarLinkList title={collection.title} items={collection.items} gameKey={props.gameKey} key={`${props.gameKey}_${collection.title}`} />
      ))}
    </Paper>
  )
}

Sidebar.propTypes = {
  gameKey: PropTypes.string.isRequired,
  engine: PropTypes.string,
  engineVersion: PropTypes.string,
  buildPlatforms: PropTypes.arrayOf(PropTypes.string),
  sections: PropTypes.arrayOf(PropTypes.object)
}
