import { Onglets } from '@/components/Onglets'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Onglets />
    </>
  )
}
