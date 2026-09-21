# Local organization invite integration tests

`organization-invite.local.spec.ts` exercises the real browser, GraphQL server,
cookies, and Postgres. It is skipped unless its local environment variables are
set. All test fixtures use disposable `example.test` accounts.

External boundaries are replaced by `local-invite-services.mjs`: it captures
SendGrid payloads (including the actual invite and confirmation URLs), supplies
a deterministic geocoding response, and returns HTTP 503 for welcome emails
addressed to `mailfailure+...`. No real emails are delivered. This does not test
SendGrid's hosted template rendering, tracking redirects, or inbox delivery.

Use an isolated Postgres instance with PostGIS, platform migrations, and local
GIS bootstrap tables. The Texas GIS tables must exist before migrations that
add indexes to them; provision them in the instance's `template1` as well if
running the backend tests, which create their own databases.

From `web`, with `DATABASE_URL` pointing to that local database:

```sh
python3 tests/support/build-local-invite-platform.py ../platform /tmp/populist-invite-services
node tests/support/local-invite-services.mjs
```

The build helper copies the SDKs outside the repositories and substitutes only
their service URLs, using temporary Cargo dependency overrides. It restores
`Cargo.lock`. The resulting `platform/target/debug/server` is for local tests
only; rebuild normally before deploying.

Run the API from `platform` in another terminal, keeping `DATABASE_URL` set:

```sh
JWT_SECRET=local-invite-regression-tests \
SENDGRID_API_KEY=local-mail-capture-only GEOCODIO_API_KEY=local-tests-only \
ENVIRONMENT=local PORT=1234 ./target/debug/server
```

Start the frontend from `web`:

```sh
GRAPHQL_SCHEMA_PATH=http://localhost:1234/ ./node_modules/.bin/next dev -p 3030
```

Then run the integration suite from `web`:

```sh
LOCAL_INVITE_DATABASE_URL="$DATABASE_URL" \
LOCAL_INVITE_INBOX_URL=http://127.0.0.1:55440/messages \
./node_modules/.bin/playwright test tests/organization-invite.local.spec.ts \
  --project=chromium --workers=1 --reporter=line
```

The suite creates unique test organizations and accounts. Dispose of the test
database afterward. The mocked browser regressions remain independently runnable
with `playwright test tests/organization-invite.spec.ts`.
