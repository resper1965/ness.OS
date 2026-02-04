import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updatePostFromForm } from '@/app/actions/growth';
import { PostEditorForm } from '@/components/growth/post-editor-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

type Props = { params: Promise<{ id: string }> };

export default async function EditarPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from('public_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {post.title}</h1>
      <PostEditorForm action={updatePostFromForm} initialValues={{ ...post, id: post.id }} />
    </div>
  );
}
