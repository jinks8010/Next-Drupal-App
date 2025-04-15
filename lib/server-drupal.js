import { NextDrupal } from "next-drupal"

export const serverDrupal = new NextDrupal(process.env.NEXT_PUBLIC_API_URL, {
  auth: {
    clientId: process.env.DRUPAL_OAUTH_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
})
