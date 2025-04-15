import { serverDrupal } from "@/lib/server-drupal"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    await serverDrupal.deleteResource("node--article", id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
