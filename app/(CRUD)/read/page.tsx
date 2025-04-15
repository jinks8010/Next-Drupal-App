'use client'

import { DrupalNode } from "next-drupal"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ArticlePage() {
  const [articles, setArticles] = useState<DrupalNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/read")
        const data = await res.json()

        setArticles(data)
      } catch (err) {
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Articles</h1>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="border p-4 rounded shadow">
              <Link href={article.path.alias || `/read/${article.id}`}>
                <h2 className="text-xl font-semibold hover:underline">{article.title}</h2>
              </Link>
              <p className="text-sm text-gray-500">
                Created on: {new Date(article.created).toLocaleDateString()}
              </p>
              <Link href={article.path.alias || `/update/${article.id}`}>
                <button className="mt-2 px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Update
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
