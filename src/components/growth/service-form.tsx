'use client';

import { createService } from '@/app/actions/growth';
import { FormServiceCatalog } from './form-service-catalog';

type Props = { serviceActions: { id: string; title: string }[] };

export function ServiceForm({ serviceActions }: Props) {
  return <FormServiceCatalog mode="create" action={createService} serviceActions={serviceActions} />;
}
