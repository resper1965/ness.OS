-- Políticas para bucket os-assets (crie o bucket no Dashboard: Storage > New bucket)
create policy "os-assets_authenticated_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'os-assets');

create policy "os-assets_authenticated_read"
  on storage.objects for select to authenticated
  using (bucket_id = 'os-assets');

create policy "os-assets_authenticated_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'os-assets');
