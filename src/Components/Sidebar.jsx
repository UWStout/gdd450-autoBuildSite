import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography, Grid, Divider } from '@mui/material'

import SidebarLinkList from './SidebarLinkList.jsx'

import * as EngineIcons from './EngineIcons.jsx'
import * as PlatformIcons from './PlatformIcons.jsx'
import * as SocialLinksIcons from './SocialLinksIcons.jsx'

const sidebarTitleSX = {
  marginTop: theme => theme.spacing(1)
}

const sidebarBoxSX = {
  padding: theme => theme.spacing(2),
  backgroundColor: theme => theme.palette.grey[200]
}

export default function Sidebar (props) {
  const { engine, engineVersion, buildPlatforms, gameKey, sections } = props

  let engineSec = null
  if (engine) {
    let icon = ''
    switch (engine.toLowerCase()) {
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
            {`v${engineVersion}`}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  let platformsSec = null
  if (buildPlatforms) {
    const icons = buildPlatforms.map((platform) => {
      switch (platform.toLowerCase()) {
        case 'win': case 'win64': case 'windows': case 'ms windows': case 'microsoft windows':
          return (<PlatformIcons.WindowsIcon key={`${gameKey}_buildicon_win64`} />)

        case 'mac64': case 'macos': case 'mac os': case 'osx':
          return (<PlatformIcons.MacOSIcon key={`${gameKey}_buildicon_macos`} />)

        case 'linux': case 'lnx': case 'unix': case '*nix': case 'nix':
          return (<PlatformIcons.LinuxIcon key={`${gameKey}_buildicon_linux`} />)

        case 'android':
          return (<PlatformIcons.AndroidIcon key={`${gameKey}_buildicon_android`} />)

        case 'ios': case 'apple ios': case 'ipad os':
          return (<PlatformIcons.IOSIcon key={`${gameKey}_buildicon_ios`} />)

        case 'playstation': case 'playstation4': case 'playstation 4': case 'ps4':
          return (<PlatformIcons.PlaystationIcon key={`${gameKey}_buildicon_ps4`} />)

        case 'xbox': case 'xbox one': case 'xbox 1': case 'xbone': case 'xb1': case 'xb':
          return (<PlatformIcons.XBoxIcon key={`${gameKey}_buildicon_xb1`} />)

        case 'nintendo switch': case 'switch': case 'nintendoswitch': case 'ns': case 'nsw':
          return (<PlatformIcons.NintendoSwitchIcon key={`${gameKey}_buildicon_nsw`} />)

        case 'web': case 'html': case 'html5': case 'web browser': case 'webbrowser':
          return (<SocialLinksIcons.WebsiteIcon key={`${gameKey}_buildicon_web`} />)

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
    <Paper sx={sidebarBoxSX}>
      {engineSec}
      {platformsSec}
      {(!!engineSec || !!platformsSec) &&
        <Divider variant="fullWidth" sx={sidebarTitleSX} />}
      {sections.map((collection, i) => (
        <SidebarLinkList title={collection.title} items={collection.items} gameKey={gameKey} key={`${gameKey}_${collection.title}`} />
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

Sidebar.defaultProps = {
  buildPlatforms: null,
  engine: null,
  engineVersion: null,
  sections: []
}
