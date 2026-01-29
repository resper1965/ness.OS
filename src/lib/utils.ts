import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function daysUntil(date: string | Date): number {
  const target = new Date(date)
  const today = new Date()
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'ATIVO': 'bg-green-100 text-green-800',
    'RECEBIDO': 'bg-green-100 text-green-800',
    'PAGO': 'bg-green-100 text-green-800',
    'ABERTO': 'bg-yellow-100 text-yellow-800',
    'ATRASADO': 'bg-red-100 text-red-800',
    'SUSPENSO': 'bg-orange-100 text-orange-800',
    'ENCERRADO': 'bg-gray-100 text-gray-800',
    'CANCELADO': 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    'CRITICO': 'bg-red-500 text-white',
    'URGENTE': 'bg-orange-500 text-white',
    'ATENCAO': 'bg-yellow-500 text-black',
    'OK': 'bg-green-500 text-white',
  }
  return colors[severity] || 'bg-gray-500 text-white'
}
