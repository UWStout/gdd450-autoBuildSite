// Standard path and file utilities
import path from 'path'
import fs from 'fs'
import https from 'https'

// Access private config data
import dotenv from 'dotenv'

// Official GitHub rest api
import { Octokit } from '@octokit/rest'

// Script for decoding base64 data
import atob from 'atob'

// Read in environment variables
dotenv.config()
const CONFIG = {
  github: process.env.GITHUB_TOKEN
}

// Instantiate and configure our Octokit REST instance
const octokit = new Octokit({ auth: CONFIG.github })

/**
 * Retrieve a file from a github repo using a private access key. The file contents
 * are decoded and written to the local folder 'destDir' if one is provided. If no
 * 'destDir' is provided, it is treated like JSON and parsed. A path to the file
 * is returned OR the JSON object if it was parsed.
 *
 * @param {Object} repo Repo information that minimally contains properties 'owner' and 'name'
 * @param {string} resourcePath Path within the repo to the file
 * @param {string} [destDir] Local destination folder to save the file to (optional)
 * @return {object|string} If destDir is undefined, the file is treated as JSON and parsed and returned.
 *                         Otherwise, a string with the local path to the saved file is returned.
 */
export async function retrieveGithubFile (repo, resourcePath, destDir) {
  let results = null
  try {
    // Trim off leading slashes
    while (resourcePath.startsWith('/') || resourcePath.startsWith('\\')) {
      resourcePath = resourcePath.slice(1)
    }

    // List files in that repo directory
    const pathOnly = path.dirname(resourcePath)
    const fileList = await octokit.rest.repos.getContent({ owner: repo.owner, repo: repo.name, path: pathOnly || '' })

    // Locate the one needed
    const whichFile = fileList.data.find((file) => {
      return (file.path === resourcePath)
    })

    // If found, retrieve that one file
    if (whichFile) {
      results = await octokit.rest.git.getBlob({ owner: repo.owner, repo: repo.name, file_sha: whichFile.sha })
    } else {
      throw new Error('File not found in directory list')
    }
  } catch (err) {
    console.error('\tGithub API error: ' + err)
    return undefined
  }

  // Output the results
  if (!results || results.status !== 200) {
    console.error('\tGithub request error: ' + JSON.stringify(results, null, 2))
    return undefined
  } else {
    const decodedData = atob(results.data.content)
    // Return either file or JSON decoded object
    if (destDir) {
      // Write file to local directory
      const filename = resourcePath.replace(/\//g, '_')
      fs.writeFileSync(path.join(destDir, filename), decodedData, 'binary')
      return path.join(destDir, filename)
    } else {
      const myObject = JSON.parse(decodedData)
      return myObject
    }
  }
}

/**
 * Retrieve the latest revision of an entire github repo as a tarbal using a private
 * access key. The file contents are decoded and written to the 'public/game_media'
 * folder. A path to the file (relative to the 'public' folder) is returned.
 *
 * @param {string} owner Name of the github user or org that owns the repo
 * @param {string} repo Name of the gihub repo
 * @param {string} destFolder Destination folder for the archive tarbal
 * @return {Promise} A promise that resolves to the name of the locally written file.
 */
export function retrieveGithubArchive (owner, repo, destFolder) {
  return new Promise((resolve, reject) => {
    octokit.rest.repos.getArchiveLink({ owner, repo, archive_format: 'tarball', ref: 'master' })
      .then((response) => {
        if (response.status !== 200) {
          reject(new Error('Bad status code for archive retrieval (' + response.status + ')'))
        }

        let filename = response.headers['content-disposition']
        filename = filename.slice(filename.indexOf('filename=') + 9)

        downloadWebFile(response.url, path.join(destFolder, filename))
          .then((localFile) => { resolve(localFile) })
          .catch((error) => {
            reject(new Error('Archive retrieval error - ' + error.message))
          })
      })
      .catch((error) => {
        reject(new Error('Archive retrieval error - ' + error.message))
      })
  })
}

/**
 * Download and save a file from the web (async).
 * @param {string} URI The link to the file to download.
 * @param {string} dest The local filename to write to.
 * @return {Promise} A promise the resolves to the name of the locally written file.
 */
export function downloadWebFile (URI, dest) {
  return new Promise((resolve, reject) => {
    // Open destination file for writing
    const file = fs.createWriteStream(dest)

    // Retrieve file contents
    https.get(URI, (response) => {
      // Pipe everything to the file
      response.pipe(file)

      // Close file and resolve when finished
      file.on('finish', () => {
        file.close()
        resolve(dest)
      })
    }).on('error', (err) => {
      // Delete file and reject the promise
      fs.unlink(dest)
      reject(err)
    })
  })
}
