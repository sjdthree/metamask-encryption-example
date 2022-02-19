const Buffer = require('buffer/').Buffer
const sigUtil = require('eth-sig-util')

if (!window.ethereum) {
  alert('web3 is required')
}

const provider = window.ethereum

const encryptInput = document.getElementById('encryptInput')
const encryptButton = document.getElementById('encryptButton')
const encryptedMessage = document.getElementById('encryptedMessage')

const decryptInput = document.getElementById('decryptInput')
const decryptButton = document.getElementById('decryptButton')
const decryptedMessage = document.getElementById('decryptedMessage')

const publicKeyInput = document.getElementById('publickey')
const publicKeyButton = document.getElementById('setPublicKey')

const encryptInput2 = document.getElementById('encryptInput2')
const encryptButton2 = document.getElementById('encryptButton2')
const encryptedMessage2 = document.getElementById('encryptedMessage2')

const decryptInput2 = document.getElementById('decryptInput2')
const decryptButton2 = document.getElementById('decryptButton2')
const decryptedMessage2 = document.getElementById('decryptedMessage2')


async function getPublicKey () {
  const accounts = await provider.enable()
  const encryptionPublicKey = await provider.request({
    method: 'eth_getEncryptionPublicKey',
    params: [accounts[0]]
  })

  return encryptionPublicKey
}

async function setPublicKey() {
  const encryptionPublicKey = publicKeyInput.value
  alert("set public key: ", encryptionPublicKey)
  return encryptionPublicKey

}

async function encrypt (msg) {
  const encryptionPublicKey = await getPublicKey()
  const buf = Buffer.from(
    JSON.stringify(
      sigUtil.encrypt(
        encryptionPublicKey,
        { data: msg },
        'x25519-xsalsa20-poly1305'
      )
    ),
    'utf8'
  )

  return '0x' + buf.toString('hex')
}

async function encryptHandler () {
  try {
    encryptedMessage.innerText = ''
    const msg = encryptInput.value
    const encMsg = await encrypt(msg)
    encryptedMessage.innerText = encMsg
  } catch (err) {
    alert(err.message)
    console.error(err)
  }
}

async function decrypt (encMsg) {
  const accounts = await provider.enable()
  const decMsg = await provider.request({
    method: 'eth_decrypt',
    params: [encMsg, accounts[0]]
  })

  return decMsg
}

async function decryptHandler () {
  try {
    decryptedMessage.innerText = ''
    const msg = decryptInput.value
    const decMsg = await decrypt(msg)
    decryptedMessage.innerText = decMsg
  } catch (err) {
    alert(err.message)
    console.error(err)
  }
}

async function decryptHandler2 () {
  try {
    decryptedMessage2.innerText = ''
    const msg = decryptInput2.value
    const decMsg2 = await decrypt(msg)
    decryptedMessage2.innerText = decMsg2
  } catch (err) {
    alert(err.message)
    console.error(err)
  }
}

async function encrypt2 (msg) {
  const encryptionPublicKey = await setPublicKey()
  console.log("encryptionPublicKey")
  console.log(encryptionPublicKey)
  const buf = Buffer.from(
    JSON.stringify(
      sigUtil.encrypt(
        encryptionPublicKey,
        { data: msg },
        'x25519-xsalsa20-poly1305'
      )
    ),
    'utf8'
  )

  return '0x' + buf.toString('hex')
}

async function encryptHandler2 () {
  try {
    encryptedMessage2.innerText = ''
    const msg = encryptInput2.value
    console.log(msg)
    const encMsg = await encrypt2(msg)
    encryptedMessage2.innerText = encMsg
  } catch (err) {
    alert(err.message)
    console.err(encryptionPublicKey)
    console.error(err)
  }
}


encryptButton.addEventListener('click', encryptHandler)
decryptButton.addEventListener('click', decryptHandler)

encryptButton2.addEventListener('click', encryptHandler2)
decryptButton2.addEventListener('click', decryptHandler2)

publicKeyButton.addEventListener('click', setPublicKey)
