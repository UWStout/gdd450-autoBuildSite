# GDD 450 Auto Development Build Site
This repository is a React/Material-UI based web site that presents information about in-development games made in the GDD 45X capstone game design sequence at UW Stout.

## Customizable Information
If your game is being featured on this web site then you can customize what information is shown for your game. Look for a folder called `WebsiteData` in the root of your respository. The following files can be edited in that folder:
- **gameInfo.json**: Data about your game (see below for the full schema).
- **description.md**: Markdown file with a short, one paragraph description of your game.
- **instructions.md**: Brief instructions for the user on how to play your game.
- **requirements.md**: A brief list of the hardware requirements for playing your game.

Almost everything displayed can be customized (including the names of the markdown files listed above and where they are located) inside of the gameInfo.json file. The description file is reqiured but all other sections are optional, and you can add more sections if you like by providing a new markdown file and adding it to the list of files in your gameInfo.json.

## Game Info Schema
The `gameInfo.json` file is a standard JSON data file that you can customize to update how your game is presented. Only certain properties and values will be respected and read and other properties will be ignored.  Here are the basic properties your file must include:
* `key`: A string of upper and lower case letters (no spaces or numbers) that is unique to your game. (the title in camel case is recommended)
* `title`: A string that is the desired title of your game (any unicode characters allowed).
* `courseID`: A string describing your course and team name (example: 'Berrier / Rave Yard').  Any unicode characters allowed.

The following properties are optional but highly recommended:
* descriptionMarkdownURI: Path to the description markdown file located in your repository (relative to the root of the repo).
* `engine`: A string that must be either 'Unity' or 'Unreal'. Other strings are acceptable but may not draw correctly.
* `engineVersion`: A string for the version of the engine you are using (any unicode characters allowed).
* `buildPlatfiorms`: An ARRAY of strings that indicate which playforms you build for. Specific string enumerations are expected. Default to [ 'win64', 'macos' ]
* `socialLink`: An ARRAY of objects, each with two properties - _title_ (string that names the social media service), and _href_ (string of the fully valid URI for reaching the social media service). If href is blank it will be skipped.
* `pageExtras`: An ARRAY of extra objects that describe extra parts of the web page (instructions, requirements, etc.).  Each object needs three properties - _key_ (a unique single-word key), _title_ (a string title displayed above the section), and _markdownURI_ (the path to the markdown file with the section content stored in your repo, relative to the root).
* `repo`: A sepcial repository object, described in detail below.

## Repo object
The special repo object can have the following properties:
* `type`: Short key that identifies the repository type (currently 'svn' and 'git' are allowed)
* `viewURI`: A valid external URL that links to a site for VIEWING the repository.
* `cloneURI`: A vlid external URL (with a protocol) that can be used for cloning the repository.
* `evolutionVideo`: The Vimeo ID of the source code evolution video generated from this repository (ask me for this if you don't have it).

## Example gameInfo.json
Here is an example gameInfo.json file for the game Leon Nights:
```js
{
  "key": "leonNights",
  "courseID": "Berrier / Rave Yard",
  "title": "Leon Nights",
  "engine": "Unreal",
  "engineVersion": "4.22.3",
  "buildPlatforms": [
    "win64", "macOS"
  ],
  "descriptionMarkdownURI": "WebsiteData/description.md",
  "pageExtras": [
    { "key": "instructions", "title": "How to Play", "markdownURI": "WebsiteData/instructions.md" },
    { "key": "requirements", "title": "Hardware Requirements", "markdownURI": "WebsiteData/requirements.md" }
  ],
  "socialLinks": [
    { "title": "Web Site", "href": "" },
    { "title": "Facebook", "href": "https://www.facebook.com/raveyardstout/" },
    { "title": "Twitter", "href": "" },
    { "title": "Instagram", "href": "" },
    { "title": "Snapchat", "href": "" }
  ],
  "repo": {
    "type": "svn",
    "viewURI": "http://144.13.22.62/svn/",
    "cloneURI": "svn://144.13.22.62/svn/CodeCalciumCPP/trunk",
    "evolutionVideo": "378716804"
  }
}
```
