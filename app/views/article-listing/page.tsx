import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import Link from "next/link"

type ArticleListingViewProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function ArticleListingView({ searchParams }: ArticleListingViewProps) {
  // Use the searchParams directly instead of spreading to avoid the Next.js warning
  const pageParam = searchParams?.page
  
  const rawPage = Array.isArray(pageParam) ? pageParam[0] : pageParam
  const currentPage = parseInt(rawPage || "1", 10)

  const pageSize = 5
  const offset = (currentPage - 1) * pageSize

  try {
    // Fixed the syntax error in the parameters object
    const view = await drupal.getView("article_listing--block_1", {
      params: {
        "page[limit]": pageSize.toString(),
        "page[offset]": offset.toString()
      }
    })

    if (!view) notFound()

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>

        {view.results.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="space-y-6">
            {view.results.map((item: any) => (
              <li key={item.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

                {item.body?.processed && (
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.body.processed }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between mt-10">
          {currentPage > 1 ? (
            <Link
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : <div />}

          {view.results.length === pageSize && (
            <Link
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </Link>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error fetching articles:", error)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <p>Error loading articles. Please try again later.</p>
      </main>
    )
  }
}