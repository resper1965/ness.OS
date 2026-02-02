import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updatePost } from '@/app/actions/growth';
import { PostEditorForm } from '@/components/growth/post-editor-form';

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

  const updateAction = (prev: unknown, formData: FormData) => updatePost(id, prev, formData);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {post.title}</h1>
      <PostEditorForm action={updateAction} initialValues={post} />
    </div>
  );
}
