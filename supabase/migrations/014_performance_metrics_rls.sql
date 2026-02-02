-- RF.OPS.02: RLS para performance_metrics — apenas admin, ops, superadmin podem inserir/editar

DROP POLICY IF EXISTS "performance_metrics_authenticated" ON public.performance_metrics;

-- SELECT: todos autenticados
CREATE POLICY "performance_metrics_select_authenticated"
  ON public.performance_metrics FOR SELECT
  TO authenticated USING (true);

-- INSERT/UPDATE/DELETE: apenas roles ops, admin, superadmin
CREATE POLICY "performance_metrics_insert_ops_roles"
  ON public.performance_metrics FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'ops', 'superadmin')
    )
  );

CREATE POLICY "performance_metrics_update_ops_roles"
  ON public.performance_metrics FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'ops', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'ops', 'superadmin')
    )
  );

CREATE POLICY "performance_metrics_delete_ops_roles"
  ON public.performance_metrics FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'ops', 'superadmin')
    )
  );
