'use client';

import { createService } from '@/app/actions/growth';
import { FormServiceCatalog } from './form-service-catalog';

type Props = { playbooks: { id: string; title: string }[] };

export function ServiceForm({ playbooks }: Props) {
  return <FormServiceCatalog mode="create" action={createService} playbooks={playbooks} />;
}
