// Standard path and file utilities
import path from 'path'
import fs from 'fs'

// Utilities for spawning child processes
import ChildProcess from 'child_process'

import dotenv from 'dotenv'

// Read in environment variables
dotenv.config()
const CONFIG = {
  svn: {
    username: process.env.SVN_USERNAME,
    password: process.env.SVN_PASSWORD
  }
}

/**
 * Retrieve the latest version of a file from a subversion repository
 *
 * @param {object} repo Repo information that minimally contains a property 'URI'
 * @param {string} resourcePath Path within the repo to the file
 * @param {string} [destDir] Local destination folder to save the file to (optional)
 * @return {object|string} If destDir is undefined, the file is treated as JSON and parsed and returned.
 *                         Otherwise, a string with the local path to the saved file is returned.
 */
export async function retrieveSVNFile (repo, resourcePath, destDir) {
  // Build the destination filename and command parameters
  const destFile = path.join(destDir || '', path.basename(resourcePath))
  const commandParams = `--username ${CONFIG.svn.username} --password ${CONFIG.svn.password} --non-interactive`

  // Attempt to run 'svn export' to retrieve the file
  try {
    ChildProcess.execSync(`svn export ${commandParams} "${repo.URI}/${resourcePath}" "${destFile}"`)
  } catch (err) {
    console.error('\tFailed to retrieve file')
    return undefined
  }

  // If no destdir was specified, parse as JSON and return
  if (!destDir) {
    // Read then delete file
    const rawdata = fs.readFileSync(destFile)
    fs.unlinkSync(destFile)

    // Decode JSON and return the object
    const myObject = JSON.parse(rawdata)
    return myObject
  }

  // Return the local path to the downloaded file
  return destFile
}
