import React from 'react'
import PropTypes from 'prop-types'

import { Box, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import * as PlatformIcons from './PlatformIcons.jsx'

import DevBuildButton from './DevBuildButton.jsx'
import GameInfoExpansionPanel from './GameInfoExpansionPanel.jsx'
import Sidebar from './Sidebar.jsx'
import { Markdown, AsyncMarkdown } from './Markdown.jsx'
import { useMarkdown } from './remoteDataHelpers'

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  },
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0)
  },
  buttonBox: {
    paddingTop: '0px',
    paddingBottom: '20px'
  },
  markdownBox: {
    borderTop: '1px solid rgba(0, 0, 0, .125)'
  }
}))

const sidebarSections = [{
  title: 'Code Repository (private)',
  items: []
}, {
  title: 'Team Social Media (public)',
  items: []
}]

export default function GameDevInfoPaper (props) {
  const classes = useStyles()

  // Setup state for the game deascription markdown
  const gameDescriptionMD = useMarkdown(props.game.descriptionMarkdownURI)

  // Re-build the repo Links
  if (props.game.repo) {
    if (sidebarSections[0].items.length >= 3) {
      sidebarSections[0].items[0].href = props.game.repo.viewURI
      sidebarSections[0].items[1].href = props.game.repo.cloneURI
      sidebarSections[0].items[2].href = `https://vimeo.com/${props.game.repo.evolutionVideo}`
    } else {
      sidebarSections[0].items.push({ title: 'Repo View', href: props.game.repo.viewURI })
      sidebarSections[0].items.push({ title: 'Repo Clone (copy link)', href: props.game.repo.cloneURI })
      sidebarSections[0].items.push({ title: 'Code Evolution', href: `https://vimeo.com/${props.game.repo.evolutionVideo}` })
    }
  }

  // Re-build the social links
  if (props.game.socialLinks) {
    sidebarSections[1].items = []
    props.game.socialLinks.forEach((social) => {
      if (social.href && social.href !== '') {
        sidebarSections[1].items.push(social)
      }
    })
  }

  return (
    <main>
      { props.game && !props.game.loading &&
        <React.Fragment>
          {/* Two-column content */}
          <Grid container spacing={2} className={classes.mainGrid}>
            {/* Column 1 */}
            <Grid item xs={9}>
              {/* Full width game description */}
              {gameDescriptionMD &&
                <Markdown>{gameDescriptionMD}</Markdown>
              }

              {/* Game Download Buttons */}
              <Box className={classes.buttonBox}>
                <Typography gutterBottom variant="h5">Weekly Dev Build</Typography>
                <Typography paragraph>
                  Note: These are automated builds that may be broken. Use with caution!<br />
                  (click the button menu icon to view build logs or download the previous weekly build)
                </Typography>
                <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <DevBuildButton text="Download Windows Build" icon={<PlatformIcons.WindowsIcon />}
                      logOpenCallback={props.logOpenCallback}
                      linkCurrent={props.game?.builds?.win64?.current?.link}
                      linkPrevious={props.game?.builds?.win64?.previous?.link}
                      logCurrent={props.game?.builds?.win64?.current?.log}
                      logPrevious={props.game?.builds?.win64?.previous?.log} />
                  </Grid>
                  <Grid item xs={6}>
                    <DevBuildButton text="Download MacOS Build" icon={<PlatformIcons.MacOSIcon />}
                      logOpenCallback={props.logOpenCallback}
                      linkCurrent={props.game?.builds?.macOS?.current?.link}
                      linkPrevious={props.game?.builds?.macOS?.previous?.link}
                      logCurrent={props.game?.builds?.macOS?.current?.log}
                      logPrevious={props.game?.builds?.macOS?.previous?.log} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Sidebar with links and other information */}
            {/* Column 2 */}
            <Grid item xs={12} md={3}>
              <Box py={1}>
                <Sidebar sections={sidebarSections} gameKey={props.game.key} />
              </Box>
            </Grid>

            {/* End Two-Column Content */}
          </Grid>

          {/* Load and mount any extra page information specified */}
          <Box>
            {props.game.pageExtras && props.game.pageExtras.map((extraInfo) => {
              const myKey = `${props.game.key}-${extraInfo.key}`
              return (
                <GameInfoExpansionPanel key={myKey} panelID={myKey} title={extraInfo.title}>
                  <AsyncMarkdown URI={extraInfo.markdownURI} />
                </GameInfoExpansionPanel>
              )
            })}
          </Box>
        </React.Fragment>
      }
    </main>
  )
}

GameDevInfoPaper.propTypes = {
  game: PropTypes.object.isRequired,
  logOpenCallback: PropTypes.func
}
