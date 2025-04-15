import { drupal } from "@/lib/drupal"
import { NextResponse } from "next/server"
import { DrupalNode } from "next-drupal"

export async function GET() {
  try {
    const articles = await drupal.getResourceCollection<DrupalNode[]>("node--article", {
      params: {
        "fields[node--article]": "title,path,created",
        sort: "-created",
      },
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
