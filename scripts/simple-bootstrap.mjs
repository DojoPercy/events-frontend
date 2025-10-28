import { randomBytes } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { $ } from "execa"
import ora from "ora"

const APP_BASE_URL = "http://localhost:3000"
const MANAGEMENT_CLIENT_NAME = "EventApp Management"
const DASHBOARD_CLIENT_NAME = "EventApp Dashboard"
const DEFAULT_CONNECTION_NAME = "EventApp-Shared-Database"
const CUSTOM_CLAIMS_NAMESPACE = "https://eventapp.com"

// Use the tenant domain from your login session
const AUTH0_DOMAIN = "dev-tn7j1rw07ukhxebt.us.auth0.com"

console.log("🚀 Starting EventApp Auth0 Bootstrap...")
console.log(`📋 Using tenant: ${AUTH0_DOMAIN}`)

// tenant settings
const tenantSettings = ora({
  text: `Initialize tenant settings`,
}).start()
try {
  await $`auth0 api patch tenants/settings --data "{\"customize_mfa_in_postlogin_action\":true,\"flags\":{\"enable_client_connections\":false},\"friendly_name\":\"EventApp\",\"picture_url\":\"https://cdn.auth0.com/blog/auth0_by_okta_logo_black.png\"}"`
  tenantSettings.succeed()
} catch (e) {
  tenantSettings.fail(`Failed to initialize tenant settings: ${e.message}`)
  process.exit(1)
}

// prompt settings
const promptSettings = ora({
  text: `Configuring prompt settings`,
}).start()
try {
  await $`auth0 api patch prompts --data "{\"identifier_first\":true}"`
  promptSettings.succeed()
} catch (e) {
  promptSettings.fail(`Failed to configure prompt settings: ${e.message}`)
  process.exit(1)
}

// Create Management Client
const createManagementClient = ora({
  text: `Creating ${MANAGEMENT_CLIENT_NAME} client`,
}).start()
let managementClient
try {
  const { stdout } = await $`auth0 apps create --name "${MANAGEMENT_CLIENT_NAME}" --description "The EventApp client to manage tenant resources and facilitate account creation." --callbacks "${APP_BASE_URL}/onboarding/callback" --logout-urls "${APP_BASE_URL}" --type regular --reveal-secrets --json --no-input`
  managementClient = JSON.parse(stdout)
  createManagementClient.succeed()
} catch (e) {
  createManagementClient.fail(`Failed to create Management client: ${e.message}`)
  process.exit(1)
}

// Create Dashboard Client
const createDashboardClient = ora({
  text: `Creating ${DASHBOARD_CLIENT_NAME} client`,
}).start()
let dashboardClient
try {
  const { stdout } = await $`auth0 api post clients --data "{\"name\":\"${DASHBOARD_CLIENT_NAME}\",\"description\":\"The client to facilitate login to the dashboard in the context of an organization.\",\"callbacks\":[\"${APP_BASE_URL}/auth/callback\"],\"allowed_logout_urls\":[\"${APP_BASE_URL}\"],\"initiate_login_uri\":\"https://example.com/auth/login\",\"app_type\":\"regular_web\",\"oidc_conformant\":true,\"grant_types\":[\"authorization_code\",\"refresh_token\"],\"organization_require_behavior\":\"post_login_prompt\",\"organization_usage\":\"require\",\"jwt_configuration\":{\"alg\":\"RS256\",\"lifetime_in_seconds\":36000,\"secret_encoded\":false}}"`
  dashboardClient = JSON.parse(stdout)
  createDashboardClient.succeed()
} catch (e) {
  createDashboardClient.fail(`Failed to create Dashboard client: ${e.message}`)
  process.exit(1)
}

// Create Database Connection
const createDatabaseConnection = ora({
  text: `Creating ${DEFAULT_CONNECTION_NAME} connection`,
}).start()
let defaultConnection
try {
  const { stdout } = await $`auth0 api post connections --data "{\"strategy\":\"auth0\",\"name\":\"${DEFAULT_CONNECTION_NAME}\",\"display_name\":\"EventApp\",\"enabled_clients\":[\"${dashboardClient.client_id}\",\"${managementClient.client_id}\"]}"`
  defaultConnection = JSON.parse(stdout)
  createDatabaseConnection.succeed()
} catch (e) {
  createDatabaseConnection.fail(`Failed to create database connection: ${e.message}`)
  process.exit(1)
}

// Create Roles
const createAdminRole = ora({
  text: `Creating admin role`,
}).start()
let adminRole
try {
  const { stdout } = await $`auth0 roles create --name "admin" --description "Manage the organization's events and ticket purchases." --json --no-input`
  adminRole = JSON.parse(stdout)
  createAdminRole.succeed()
} catch (e) {
  createAdminRole.fail(`Failed to create admin role: ${e.message}`)
  process.exit(1)
}

const createMemberRole = ora({
  text: `Creating member role`,
}).start()
let memberRole
try {
  const { stdout } = await $`auth0 roles create --name "member" --description "Member of an organization." --json --no-input`
  memberRole = JSON.parse(stdout)
  createMemberRole.succeed()
} catch (e) {
  createMemberRole.fail(`Failed to create member role: ${e.message}`)
  process.exit(1)
}

// Write environment variables
const writeEnvVars = ora({
  text: `Saving environment variables to .env.local`,
}).start()
try {
  await writeFile(
    ".env.local",
    `
APP_BASE_URL=${APP_BASE_URL}

# Global Auth0 SDK configuration
NEXT_PUBLIC_AUTH0_DOMAIN=${AUTH0_DOMAIN}
AUTH0_MANAGEMENT_API_DOMAIN=${AUTH0_DOMAIN}
SESSION_ENCRYPTION_SECRET=${randomBytes(32).toString("hex")}

# Client ID and secret for the application within the context of an organization
AUTH0_CLIENT_ID=${dashboardClient.client_id}
AUTH0_CLIENT_SECRET=${dashboardClient.client_secret}

# Client ID and secret for the application used to allow a user to manage organizations
AUTH0_MANAGEMENT_CLIENT_ID=${managementClient.client_id}
AUTH0_MANAGEMENT_CLIENT_SECRET=${managementClient.client_secret}

# Roles assigned to the members of an organization
AUTH0_ADMIN_ROLE_ID=${adminRole.id}
AUTH0_MEMBER_ROLE_ID=${memberRole.id}

# The default connection ID users will use to create an account with during onboarding
DEFAULT_CONNECTION_ID=${defaultConnection.id}

# The namespace used to prefix custom claims
CUSTOM_CLAIMS_NAMESPACE=${CUSTOM_CLAIMS_NAMESPACE}

# Database (you'll need to set this up separately)
DATABASE_URL="postgresql://username:password@localhost:5432/eventapp"

# Apps Script Email Integration (you'll need to set this up separately)
APPS_SCRIPT_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
  `.trim()
  )

  writeEnvVars.succeed()
} catch (e) {
  writeEnvVars.fail(`Failed to save environment variables: ${e.message}`)
  process.exit(1)
}

console.log("\n🎉 EventApp Auth0 Bootstrap Complete!")
console.log("\n📋 Next Steps:")
console.log("1. Set up your PostgreSQL database")
console.log("2. Update DATABASE_URL in .env.local")
console.log("3. Run: npm run db:migrate")
console.log("4. Set up Google Apps Script for email notifications")
console.log("5. Run: npm run dev")

