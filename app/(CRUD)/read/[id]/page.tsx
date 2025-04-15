'use client'

import { drupal } from "@/lib/drupal"
import { useRouter, usePathname } from "next/navigation"
import { DrupalNode } from "next-drupal"
import { useTransition, useEffect, useState } from "react"

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<DrupalNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const pathname = usePathname()
  const id = pathname.split("/").pop()

  const fetchArticle = async () => {
    if (!id) return
    try {
      const data = await drupal.getResource<DrupalNode>("node--article", id, {
        params: {
          "fields[node--article]": "title,body,created",
        },
      })
      setArticle(data)
    } catch (err) {
      console.error("Error fetching article:", err)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        throw new Error("Failed to delete article")
      }

      router.push("/read")
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete the article.")
    }
  }

  if (loading) {
    return <p className="p-6">Loading article...</p>
  }

  if (!article) {
    return <p className="p-6 text-red-600">Article not found or an error occurred.</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Published on: {new Date(article.created).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none prose-lg text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: article.body?.processed || "" }}
      />

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete Article"}
      </button>
    </main>
  )
}
