import { NextDrupal } from "next-drupal"

// Client for the browser (public routes)
export const drupal = new NextDrupal(process.env.NEXT_PUBLIC_API_URL)


