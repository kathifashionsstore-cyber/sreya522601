import fs from 'fs'
import path from 'path'

// Load environment variables manually
const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const matches = envContent.matchAll(/^([\w.-]+)\s*=\s*('(?:[^']|\\')*'|"(?:[^"]|\\")*"|[^\r\n]*)/gm)
  for (const match of matches) {
    const key = match[1]
    let value = match[2] || ''
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1)
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    value = value.replace(/\\n/g, '\n')
    process.env[key] = value.trim()
  }
}

const { adminAuth } = await import('../api/lib/firebaseAdmin.js')

const email = process.argv[2] || 'sreya@gmail.com'

async function run() {
  try {
    console.log(`Looking up user by email: ${email}...`)
    const user = await adminAuth.getUserByEmail(email)
    console.log(`Found user: ${user.uid}`)

    console.log('Setting custom user claims: { admin: true }...')
    await adminAuth.setCustomUserClaims(user.uid, { admin: true })
    console.log(`SUCCESS: Custom user claim { admin: true } set successfully for ${email}!`)
    console.log('Please sign out and sign back in on the admin page to apply the changes.')
  } catch (error) {
    console.error('ERROR setting admin custom claim:', error.message || error)
    process.exit(1)
  }
}

run()
