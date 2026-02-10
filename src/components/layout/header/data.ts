/**
 * Dados do header — notificações.
 * Adaptado ao ness.OS: lista vazia ou futura integração com eventos/alertas.
 */

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  read?: boolean;
  createdAt?: string;
};

export const notifications: NotificationItem[] = [];
