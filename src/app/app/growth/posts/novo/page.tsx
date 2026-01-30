import { createPost } from '@/app/actions/admin-posts';
import { PostEditorForm } from '@/components/growth/post-editor-form';

export default function NovoPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Novo post</h1>
      <PostEditorForm action={createPost} />
    </div>
  );
}
