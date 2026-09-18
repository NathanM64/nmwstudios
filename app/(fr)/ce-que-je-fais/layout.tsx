import { Offres } from '@/components/ecrans/Offres'
import { FR } from '@/content/fr'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Offres t={FR}>{children}</Offres>
}
