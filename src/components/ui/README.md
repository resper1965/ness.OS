# Componentes UI (primitivos shadcn-style)

Primitivos alinhados ao [plano Bundui componentes profundos](.context/plans/bundui-componentes-profundos-nessos.md). Design tokens: slate-*, ness (ver `docs/DESIGN-TOKENS.md`).

## Disponíveis

| Componente | Uso |
|------------|-----|
| **Button** | `import { Button, buttonVariants } from "@/components/ui/button"`. Variantes: default, destructive, outline, secondary, ghost, link. Tamanhos: default, sm, lg, icon. |
| **Card** | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"`. Bordas slate-700, fundo slate-800/50. |
| **Input** | `import { Input } from "@/components/ui/input"`. forwardRef, border-slate-600, focus ring ness. |
| **Label** | `import { Label } from "@/components/ui/label"`. Radix Label; text-slate-300; use com Input para a11y. |
| **Sheet** | `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"`. Drawer lateral (Radix Dialog); side top/right/bottom/left. |
| **Dialog** | `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"`. Modal centralizado (Radix Dialog). |
| **Table** | `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"`. Tabela com bordas slate e hover. |
| **Select** | `import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select"`. Dropdown (Radix Select). |
| **DropdownMenu** | `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, ... } from "@/components/ui/dropdown-menu"`. Menu contextual (Radix). |
| **Skeleton** | `import { Skeleton } from "@/components/ui/skeleton"`. Bloco de loading com animate-pulse. |
| **Tooltip** | `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"`. Tooltip (Radix); envolver app com TooltipProvider. |
| **Separator** | `import { Separator } from "@/components/ui/separator"`. Linha vertical/horizontal (Radix). |

## Wrappers existentes

- **PrimaryButton** (`shared/primary-button.tsx`) — mantido para ações principais com loading/href; pode usar `Button` internamente no futuro.
- **PageCard** (`shared/page-card.tsx`) — mantido para listagens; pode usar `Card` internamente no futuro.

## Próximos (Fase 2 do plano)

Todos os primitivos da Fase 2 (DropdownMenu, Skeleton, Tooltip, Separator) estão implementados. Ver inventário em `.context/workflow/artifacts/bundui-ui-primitivos-phase-p-inventario.md`.
