// Standard path and file utilities
import path from 'path'
import fs from 'fs'

// Utilities for spawning child processes
import ChildProcess from 'child_process'

// Repository helper functions
import { retrieveGithubFile } from './githubHelpers'
import { retrieveSVNFile } from './subversionHelpers'

// List of games and vital data for each
import gameInfo from './gameList.json'

// Customized list of file data that will be written to the public/game_info folder
const gameDataList = [];

// Main function as an IIF so that it supports 'async/await'
(async () => {
  // Make sure the game_info dir exists
  if (!fs.existsSync(path.join('public', 'game_info'))) {
    fs.mkdirSync(path.join('public', 'game_info'), { recursive: true })
  }

  // Loop through and process all games
  for (let game = 0; game < gameInfo.games.length; game++) {
    console.log('Retrieving files for "' + gameInfo.games[game].title + '"')

    // Retrieve game data (and possibly all media)
    const gameData = await downloadAndProcessGameDataFile(gameInfo.games[game])
    const gameDataFilename = path.join('public', 'game_info', `${gameData.key}.json`)

    // Re-write game data file with new links and name
    fs.writeFileSync(gameDataFilename, JSON.stringify(gameData), { encoding: 'UTF8' })
    console.log('\t' + gameDataFilename)

    // Add to list of games
    gameDataList.push({
      key: gameData.key,
      courseID: gameData.courseID,
      title: gameData.title,
      gameDataURI: gameDataFilename.slice(gameDataFilename.indexOf('/') + 1)
    })

    console.log('\n')
  }

  // Write out the game list file
  fs.writeFileSync(
    path.join('public', 'gameList.json'),
    JSON.stringify({
      pageTitle: gameInfo.pageTitle,
      games: gameDataList
    }),
    { encoding: 'UTF8' }
  )
  console.log('Full game data list saved to "public/gameList.json"')
})()

async function downloadAndProcessGameDataFile (curGame) {
  // Defaults (used only if a proper gameData.json cannot be located)
  let gameData = {
    key: curGame.key,
    courseID: curGame.courseID,
    title: curGame.title
  }

  // Retrieve the game JSON data if there is any
  let retrieveRepoFile = null
  if (curGame.jsonPath) {
    // Setup the proper repo file function
    switch (curGame.repo.type) {
      case 'github':
        retrieveRepoFile = retrieveGithubFile
        break

      case 'mscs-svn':
        retrieveRepoFile = retrieveSVNFile
        break

      default:
        console.log('UNSUPPORTED Repo.type: ' + curGame.repo.type)
        return gameData
    }

    // Retrieve from game source code repo
    const newGameData = await retrieveRepoFile(curGame.repo, curGame.jsonPath)

    // Validate the newGameData before accepting it
    if (!newGameData.key || !newGameData.title || !newGameData.courseID) {
      console.error('\tERROR: Game data is missing one or more required fields (key, title, courseID)')
      console.error('\t\tUsing defaults instead.')
      newGameData.key = newGameData.key || gameData.key
      newGameData.title = newGameData.title || gameData.title
      newGameData.courseID = newGameData.courseID || gameData.courseID
    }
    gameData = newGameData

    // TODO: Update build data links to point to local files when available

    // Ensure output directory exists and is empty
    const destDir = path.join('public', 'game_info', gameData.key)
    if (fs.existsSync(destDir)) {
      ChildProcess.execSync('rm -rf ' + destDir)
    }
    fs.mkdirSync(destDir, { recursive: true })

    // Retrieve description markdown file
    if (gameData.descriptionMarkdownURI && gameData.descriptionMarkdownURI !== '') {
      const markdownFile = await retrieveRepoFile(curGame.repo, gameData.descriptionMarkdownURI, destDir)
      if (!markdownFile) {
        console.error('\tFailed to retrieve game description markdown file')
      } else {
        gameData.descriptionMarkdownURI = markdownFile.slice(markdownFile.indexOf('/') + 1)
        console.log('\t' + gameData.descriptionMarkdownURI)
      }
    } else {
      console.error('\tMissing or empty game description markdown file URI')
    }

    // Retrieve extra markdown files
    if (gameData.pageExtras && Array.isArray(gameData.pageExtras)) {
      for (let i = 0; i < gameData.pageExtras.length; i++) {
        const markdownFile = await retrieveRepoFile(curGame.repo, gameData.pageExtras[i].markdownURI, destDir)
        if (!markdownFile) {
          console.error('\tFailed to retrieve extra markdown file: ' + gameData.pageExtras[i].key)
          console.error('\t\tURI -> ' + gameData.pageExtras[i].markdownURI)
        } else {
          gameData.pageExtras[i].markdownURI = markdownFile.slice(markdownFile.indexOf('/') + 1)
          console.log('\t' + gameData.pageExtras[i].markdownURI)
        }
      }
    }
  }

  // Return the final form of the gameData object
  return gameData
}