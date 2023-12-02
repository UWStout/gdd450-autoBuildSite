/* eslint-disable react/hook-use-state */
import { useState, useEffect } from 'react'
import Axios from 'axios'

export function useJSON (JSONDataURL, defaultObject) {
  // Default to empty object
  defaultObject = defaultObject || {}

  // The JSON object (part of the current component's state)
  const [JSONObject, setJSONObject] = useState('*')

  // Side effect to make the ajax call to retrieve the JSON object when the current component is mounted
  useEffect(() => {
    // An empty URI will simply return an empty object
    if (JSONDataURL === '') {
      setJSONObject(defaultObject)
    } else {
      // Attempt an ajax call to load the JSON file
      if (JSONObject === '*') {
        try {
          Axios.get(JSONDataURL, { responseType: 'json' }).then((result) => {
            setJSONObject(result.data)
          }).catch((error) => {
            // Something went wrong with the AJAX call so log it and return an empty object
            console.error(`AJAX request failed - ${error}`)
            setJSONObject(defaultObject)
          })
        } catch (error) {
          // Something non-ajax related went wrong so log it and return an empty object
          console.error(`Failed to retrieve json data - ${error}`)
          setJSONObject(defaultObject)
        }

        setJSONObject('wait')
      }
    }
  }, [JSONObject, defaultObject, JSONDataURL, setJSONObject])

  // Return the current state of the JSON object
  if (JSONObject === '*') { return 'wait' }
  return JSONObject
}

/**
 * Custom React Hook to asynchronously retrieve a markdown file's content as a string. The markdown content will be
 * part of the component's state due to being loaded asynchronously.
 *
 * @param {string} markdownDataURL Valid URL or empty string pointing to the markdown file to retrieve.
 * @return {string} The markdown file OR and error message in markdown format OR an empty string if the URI is empty.
 */
export function useMarkdown (markdownDataURL) {
  // The markdown file content as a string (part of the current component's state)
  const [MDString, setMDString] = useState('')

  // Side effect to make the ajax call to retrieve the markdown when the current component is mounted
  // Note: Should only be called when markdownDataURL or setMDString change (which should never happen)
  useEffect(() => {
    // An empty Markdown URI will simply return an empty string
    if (markdownDataURL === '') {
      setMDString('')
    } else {
      // Attempt an ajax call to load the markdown file
      try {
        Axios.get(markdownDataURL, { responseType: 'text' }).then((result) => {
          // Check that the returned content is actually markdown
          // ERROR: esbuild dev server does not set the content-type correctly
          // Note: the server must set the content-type properly for this to work!
          // if (result.headers['content-type'].search(/text\/markdown/) === -1) {
          //   setMDString('## _ERROR:_ Retrieved data is not markdown\n' +
          //             '```js\n' +
          //             'markdownDataURL = "' + markdownDataURL + '"\n' +
          //             'result.headers[\'content-type\'] = "' + result.headers['content-type'] + '"\n' +
          //             '```')
          // } else {
          setMDString(result.data)
          // }
        }).catch((error) => {
          // Something went wrong with the AJAX call so log it and return an error message
          console.error(`AJAX request failed - ${error}`)
          setMDString('## _ERROR:_ Markdown Data Not Found')
        })
      } catch (error) {
        // Something non-ajax related went wrong so log it and return an error message
        console.error(`Failed to retrieve markdown data - ${error}`)
        setMDString('## _ERROR:_ Markdown Data Not Found')
      }
    }
  }, [markdownDataURL, setMDString]) // <-- Note the dependencies here that control when the side effect is called

  // Return the current state of the markdown string
  return MDString
}

export function downloadFile (href) {
  const a = document.createElement('a')
  a.href = href
  a.download = href.substr(href.lastIndexOf('/') + 1)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
