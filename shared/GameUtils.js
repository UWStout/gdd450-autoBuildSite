import PropTypes from 'prop-types'

export const RepoTypeEnum = {
  UNKNOWN: 0,
  GIT: 1,
  SVN: 2,
  PERFORCE: 3,
  PLASTIC: 4,
  BAZZAR: 5,
  count: 5,
  props: {
    0: { name: 'unknown', synonyms: [], code: 'n/a' },
    1: { name: 'git', synonyms: ['git', 'github', 'gitlab'], code: 'git' },
    2: { name: 'subversion', synonyms: ['svn', 'subversion'], code: 'svn' },
    3: { name: 'perforce', synonyms: ['p4', 'perforce', 'helix'], code: 'p4' },
    4: { name: 'plasticSCM', synonyms: ['plastic', 'plasticscm'], code: 'plastic' },
    5: { name: 'bazzar', synonyms: ['bazzar'], code: 'bazzar' }
  },
  sanitize: function (val) {
    for (let i = 1; i <= RepoTypeEnum.count; i++) {
      const match = RepoTypeEnum.props[i].synonyms.indexOf(val.toLowerCase())
      if (match > -1) { return i }
    }
    return RepoTypeEnum.UNKNOWN
  },
  shape: function () {
    return PropTypes.oneOf(Object.values(RepoTypeEnum.props).map(v => v.name))
  }
}

export const PlatformEnum = {
  UNKNOWN: 0,
  WINDOWS: 1,
  MAC_OS: 2,
  LINUX: 3,
  ANDROID: 4,
  IOS: 5,
  PS4: 6,
  XBOX_ONE: 7,
  SWITCH: 8,
  WEB_BROWSER: 9,
  count: 9,
  props: {
    0: { name: 'Unknown', synonyms: [], code: 'n/a' },
    1: { name: 'Windows', synonyms: ['win', 'win64', 'windows', 'ms windows', 'microsoft windows'], code: 'win64' },
    2: { name: 'MacOS', synonyms: ['mac64', 'macos', 'mac os', 'osx'], code: 'mac64' },
    3: { name: 'Linux', synonyms: ['linux', 'lnx', 'unix', '*nix', 'nix'], code: 'linux64' },
    4: { name: 'Android', synonyms: ['android'], code: 'android' },
    5: { name: 'iOS', synonyms: ['ios', 'apple ios', 'ipad os'], code: 'ios' },
    6: { name: 'Playstation 4', synonyms: ['playstation', 'playstation4', 'playstation 4', 'ps4'], code: 'ps4' },
    7: { name: 'XBox One', synonyms: ['xbox', 'xbox one', 'xbox 1', 'xbone', 'xb1', 'xb'], code: 'xbone' },
    8: { name: 'Nintendo Switch', synonyms: ['nintendo switch', 'switch', 'nintendoswitch', 'ns', 'nsw'], code: 'ns' },
    9: { name: 'HTML 5 Web Browser', synonyms: ['web', 'html', 'html5', 'web browser', 'webbrowser'], code: 'html5' }
  },
  sanitize: function (val) {
    for (let i = 1; i <= PlatformEnum.count; i++) {
      const match = PlatformEnum.props[i].synonyms.indexOf(val.toLowerCase())
      if (match > -1) { return i }
    }
    return PlatformEnum.UNKNOWN
  },
  shape: function () {
    return PropTypes.oneOf(Object.values(PlatformEnum.props).map(v => v.name))
  }
}

export class SocialLink {
  constructor (type, URI) {
    this.type = type
    this.URI = URI
  }

  static shape () {
    return {
      type: PropTypes.string.isRequired,
      URI: PropTypes.string.isRequired
    }
  }
}

/**
 * Object to hold information about a game repo relevant to a UWStout GDD class game
 */
export class RepoInfo {
  constructor (type, view, clone, evoVid) {
    this.type = type || 'unknown'
    this.view = view || 'none'
    this.clone = clone || 'none'
    this.evolutionVideo = evoVid || '0'
  }

  get type () { return this._type }
  set type (value) {
    if (typeof value !== 'string') return
    switch (value.toLowerCase()) {
      case 'svn': case 'subversion': this._type = 'svn'; break
      case 'git': case 'github': case 'gitlab': this._type = 'git'; break
      case 'perforce': case 'p4': this._type = 'svn'; break
      case 'plastic': case 'plasticscm': this._type = 'plastic'; break
      case 'bazzar': this._type = 'bazzar'; break
      default: this._type = 'unknown'; break
    }
  }

  get view () { return this._viewURI }
  set view (value) { this._viewURI = (typeof value === 'string' ? value : this._viewURI) }

  get clone () { return this._cloneURI }
  set clone (value) { this._cloneURI = (typeof value === 'string' ? value : this._cloneURI) }

  get evolutionVideo () { return this._evolutionVideo }
  set evolutionVideo (value) {
    if (typeof value === 'number') {
      this._evolutionVideo = value.toString()
    } else if (typeof value === 'string' && !isNaN(parseInt(value))) {
      this._evolutionVideo = value
    }
  }

  static shape () {
    return {
      type: RepoTypeEnum.shape(),
      view: PropTypes.string,
      clone: PropTypes.string,
      evolutionVideo: PropTypes.string
    }
  }
}

// Regular expression to separate a string into words based on non-letter chars and capitalization
const WORD_REGEX = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g

// Convert a string to clean camel case
export function toCamelCaseString (input) {
  // Separate into words
  const words = input.match(WORD_REGEX)

  // Rebuild one word at a time
  let cCase = ''
  words.forEach((currentStr, i) => {
    let tempStr = currentStr.toLowerCase()
    if (i !== 0) {
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1)
    }
    cCase += tempStr
  })

  // Return the result
  return cCase
}
