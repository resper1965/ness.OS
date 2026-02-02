import Link from 'next/link';
import { createPost } from '@/app/actions/growth';
import { PostEditorForm } from '@/components/growth/post-editor-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function NovoPostPage() {
  return (
    <PageContent>
      <AppPageHeader
        title="Novo post"
        actions={
          <Link href="/app/growth/posts" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <PostEditorForm action={createPost} />
    </PageContent>
  );
}
