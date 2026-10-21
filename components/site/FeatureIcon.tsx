import {
  BookOpen,
  CalendarDays,
  FolderLock,
  Handshake,
  MessagesSquare,
  Wallet,
} from 'lucide-react'
import type { Feature } from '@/lib/content'

const icons = {
  calendar: CalendarDays,
  wallet: Wallet,
  handshake: Handshake,
  messages: MessagesSquare,
  vault: FolderLock,
  journal: BookOpen,
}

export default function FeatureIcon({
  name,
  className = 'h-5 w-5',
}: {
  name: Feature['icon']
  className?: string
}) {
  const Icon = icons[name]
  return <Icon className={className} aria-hidden="true" />
}
