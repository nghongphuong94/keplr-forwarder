const refreshInterval = 3000
const parentMessageInterval = 1000
let reloadParentInterval
let parentWindow

const getParentWindow = () => {
  if (window.opener) {
    return window.opener
  } else if (window.parent) {
    return window.parent
  }

  throw new Error('Cannot determine parent window')
}

const receiveParentMessage = (event) => {
  if (event.data.type === 'keplr:registrationCompleted') {
    console.log('Onboarding complete; closing window')
    window.close()
  } else {
    console.debug(`Ignoring unrecognized message from parent`)
  }
}

const receiveMessage = (event) => {
  if (event.source === parentWindow) {
    receiveParentMessage(event)
  } else {
    return console.debug(`Ignoring cross-domain message from '${event.origin}'`)
  }
}

const initialize = () => {
  if (window.keplr === undefined) {
    return setTimeout(() => window.location.reload(), refreshInterval)
  }

  parentWindow = getParentWindow()
  window.addEventListener('message', receiveMessage)
  reloadParentInterval = setInterval(() => {
    console.debug('Sending keplr:reload message')
    parentWindow.postMessage({ type: 'keplr:reload' }, '*')
  }, parentMessageInterval)
}
window.addEventListener('DOMContentLoaded', initialize)
