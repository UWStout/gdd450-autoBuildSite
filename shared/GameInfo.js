import PropTypes from 'prop-types'

import { RepoInfo, SocialLink, toCamelCaseString, PlatformEnum } from './GameUtils.js'

export default class GameInfo {
  constructor (title, courseID, platforms, descMD, requireMD, instructMD, social, repo) {
    // Required Info
    this.key = toCamelCaseString(`${title} ${courseID}`)
    this.courseID = courseID
    this.title = title

    // Markdown documents with defaults
    this.descriptionMDURI = descMD || ''
    this.requirementsMDURI = requireMD || ''
    this.instructionsMDURI = instructMD || ''

    // Possibly null or default info
    this.buildPlatforms = platforms || GameInfo.DEFAULT_PLATFORMS
    this.socialLinks = social || GameInfo.DEFAULT_SOCIAL_LINKS
    this.repo = repo || GameInfo.DEFAULT_REPO_INFO
  }

  static shape () {
    return {
      key: PropTypes.string.isRequired,
      courseID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      descriptionMDURI: PropTypes.string,
      requirementsMDURI: PropTypes.string,
      instructionsMDURI: PropTypes.string,
      buildPlatforms: PlatformEnum.shape(),
      socialLinks: SocialLink.shape(),
      repo: RepoInfo.shape()
    }
  }
}

// Static default values
GameInfo.DEFAULT_DESCRIPTION_MD = 'DefaultDescription.md'
GameInfo.DEFAULT_REQUIREMENTS_MD = 'DefaultRequirements.md'
GameInfo.DEFAULT_INSTRUCTIONS_MD = 'DefaultInstructions.md'

GameInfo.DEFAULT_REPO_INFO = new RepoInfo()

GameInfo.DEFAULT_SOCIAL_LINKS = [
  new SocialLink('Web Page'),
  new SocialLink('Facebook'),
  new SocialLink('Twitter'),
  new SocialLink('Instagram'),
  new SocialLink('Snapchat')
]

GameInfo.DEFAULT_PLATFORMS = [
  PlatformEnum.WINDOWS,
  PlatformEnum.MAC_OS
]
