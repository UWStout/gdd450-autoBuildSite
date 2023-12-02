import React from 'react'
import PropTypes from 'prop-types'

import { Box, Grid, Typography } from '@mui/material'

import * as PlatformIcons from './PlatformIcons.jsx'

import DevBuildButton from './DevBuildButton.jsx'
import GameInfoExpansionPanel from './GameInfoExpansionPanel.jsx'
import Sidebar from './Sidebar.jsx'

import { Markdown, AsyncMarkdown } from './Markdown.jsx'
import { useMarkdown } from './remoteDataHelpers'

import GameInfo from '../../shared/GameInfo.js'

const mainGridSX = {
  marginTop: theme => theme.spacing(0.5),
  marginBottom: theme => theme.spacing(0.5)
}

// const markdownSX = {
// //  ...theme.typography.body2,
//   padding: theme => theme.spacing(3, 0)
// }

const buttonBoxSX = {
  paddingTop: '0px',
  paddingBottom: '20px'
}

// const markdownBoxSX = {
//   borderTop: '1px solid rgba(0, 0, 0, .125)'
// }

const sidebarSections = [{
  title: 'Code Repository (private)',
  items: []
}, {
  title: 'Team Social Media (public)',
  items: []
}]

export default function GameDevInfoPaper (props) {
  const { game, logOpenCallback } = props

  // Setup state for the game description markdown
  const gameDescriptionMD = useMarkdown(game.descriptionMarkdownURI)

  // Re-build the repo Links
  if (game.repo) {
    if (sidebarSections[0].items.length >= 3) {
      sidebarSections[0].items[0].href = game.repo.viewURI
      sidebarSections[0].items[1].href = game.repo.cloneURI
      sidebarSections[0].items[2].href = `https://vimeo.com/${game.repo.evolutionVideo}`
    } else {
      sidebarSections[0].items.push({ title: 'Repo View', href: game.repo.viewURI })
      sidebarSections[0].items.push({ title: 'Repo Clone (copy link)', href: game.repo.cloneURI })
      sidebarSections[0].items.push({ title: 'Code Evolution', href: `https://vimeo.com/${game.repo.evolutionVideo}` })
    }
  }

  // Re-build the social links
  if (game.socialLinks) {
    sidebarSections[1].items = []
    game.socialLinks.forEach((social) => {
      if (social.href && social.href !== '') {
        sidebarSections[1].items.push(social)
      }
    })
  }

  return (
    <main>
      { !!game && !game.loading &&
        <React.Fragment>
          {/* Two-column content */}
          <Grid container spacing={2} sx={mainGridSX}>
            {/* Column 1 */}
            <Grid item xs={9}>
              {/* Full width game description */}
              {!!gameDescriptionMD &&
                <Markdown>{gameDescriptionMD}</Markdown>}

              {/* Game Download Buttons */}
              <Box sx={buttonBoxSX}>
                <Typography gutterBottom variant="h5">Weekly Dev Build</Typography>
                <Typography paragraph>
                  Note: These are automated builds that may be broken. Use with caution!
                  <br />
                  (click the button menu icon to view build logs or download the previous weekly build)
                </Typography>
                <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <DevBuildButton
                      text="Download Windows Build"
                      icon={<PlatformIcons.WindowsIcon />}
                      buildTitle={`${game.title} Win64 Build`}
                      logOpenCallback={logOpenCallback}
                      linkCurrent={game?.builds?.win64?.current?.link}
                      linkPrevious={game?.builds?.win64?.previous?.link}
                      logsCurrent={game?.builds?.win64?.current?.log}
                      logsPrevious={game?.builds?.win64?.previous?.log}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DevBuildButton
                      text="Download MacOS Build"
                      icon={<PlatformIcons.MacOSIcon />}
                      buildTitle={`${game.title} MacOS Build`}
                      logOpenCallback={logOpenCallback}
                      linkCurrent={game?.builds?.macos?.current?.link}
                      linkPrevious={game?.builds?.macos?.previous?.link}
                      logsCurrent={game?.builds?.macos?.current?.log}
                      logsPrevious={game?.builds?.macos?.previous?.log}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Sidebar with links and other information */}
            {/* Column 2 */}
            <Grid item xs={12} md={3}>
              <Box py={1}>
                <Sidebar
                  sections={sidebarSections}
                  gameKey={game.key}
                  engine={game.engine} engineVersion={game.engineVersion}
                  buildPlatforms={game.buildPlatforms}
                />
              </Box>
            </Grid>

            {/* End Two-Column Content */}
          </Grid>

          {/* Load and mount any extra page information specified */}
          <Box>
            {!!game.pageExtras && game.pageExtras.map((extraInfo) => {
              const myKey = `${game.key}-${extraInfo.key}`
              return (
                <GameInfoExpansionPanel key={myKey} panelID={myKey} title={extraInfo.title}>
                  <AsyncMarkdown URI={extraInfo.markdownURI} />
                </GameInfoExpansionPanel>
              )
            })}
          </Box>
        </React.Fragment>}
    </main>
  )
}

GameDevInfoPaper.propTypes = {
  game: PropTypes.shape(GameInfo.shape()).isRequired,
  logOpenCallback: PropTypes.func
}

GameDevInfoPaper.defaultProps = {
  logOpenCallback: undefined
}
