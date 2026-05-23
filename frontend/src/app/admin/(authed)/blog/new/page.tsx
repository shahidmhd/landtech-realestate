'use client';

import PageHeader from '@/components/admin/PageHeader';
import BlogForm, { emptyBlog } from '@/components/admin/BlogForm';

export default function NewBlogPage() {
  return (
    <>
      <PageHeader
        title="New article"
        description="Write an insight. Save as draft to come back to it later."
      />
      <BlogForm initial={emptyBlog} mode="create" />
    </>
  );
}
