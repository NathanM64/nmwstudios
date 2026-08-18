import { Configurateur } from '@/components/config/Configurateur'
import { Dock } from '@/components/shell/Dock'
import { Footer } from '@/components/shell/Footer'

export const metadata = {
  title: 'Configurez votre site',
  description: 'Composez votre site et voyez le prix se construire.',
}

export default function Page() {
  return (
    <>
      <Dock />
      <Configurateur />
      <Footer />
    </>
  )
}
