import { Offres } from '@/components/ecrans/Offres'
import { EN } from '@/content/en'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Offres t={EN}>{children}</Offres>
}
