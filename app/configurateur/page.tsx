import { Configurateur } from '@/components/config/Configurateur'
import { EnteteConfigurateur } from '@/components/config/EnteteConfigurateur'

export const metadata = {
  title: 'Configurez votre site',
  description: 'Composez votre site et voyez le prix se construire.',
}

export default function Page() {
  return (
    <>
      <EnteteConfigurateur />
      <Configurateur />
    </>
  )
}
