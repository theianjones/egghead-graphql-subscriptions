import OneGraphAuth from 'onegraph-auth'
export const APP_ID = `9068d449-be97-4449-a4f0-d5c663a3e7dc`
export const CLIENT_URL = `https://serve.onegraph.com/graphql?app_id=${APP_ID}`
export const auth = new OneGraphAuth({
  appId: APP_ID,
})
