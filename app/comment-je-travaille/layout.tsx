import { Onglets } from './Onglets'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Onglets />
    </>
  )
}
