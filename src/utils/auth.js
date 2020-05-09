import OneGraphAuth from 'onegraph-auth'
export const APP_ID = `1b5bf19c-77d3-4fae-bd70-752caa59f44b`
export const CLIENT_URL = `https://serve.onegraph.com/graphql?app_id=${APP_ID}`
export const auth = new OneGraphAuth({
  appId: APP_ID,
})
