'use client';

import { FormServiceCatalog } from './form-service-catalog';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  service: { id?: string; name: string; slug: string; playbook_ids?: string[]; delivery_type?: string | null; marketing_pitch: string | null; marketing_title?: string | null; marketing_body?: string | null; is_active: boolean };
  playbooks: { id: string; title: string }[];
};

export function ServiceEditForm({ action, service, playbooks }: Props) {
  return <FormServiceCatalog mode="edit" action={action} service={service} playbooks={playbooks} />;
}
