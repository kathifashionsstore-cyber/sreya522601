import { AdminCollectionEditor } from './AdminCollectionEditor'
import { blogPosts } from '../data/seed'
import { blogSchema } from './formSchemas'

export default function AdminBlog() {
  return <AdminCollectionEditor title="Blog" path="blogPosts" fallback={blogPosts} schema={blogSchema} orderField="date" description="Blog content is stored as safe paragraph arrays, not raw HTML." />
}
