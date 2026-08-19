import { Configurateur } from '@/components/config/Configurateur'
import { EnteteConfigurateur } from '@/components/config/EnteteConfigurateur'

export const metadata = {
  title: 'Configurez votre site',
  description: 'Composez votre site et voyez le prix se construire.',
}

export default function Page() {
  return (
    <div className="xl:flex xl:h-dvh xl:flex-col xl:overflow-hidden">
      <EnteteConfigurateur />
      <Configurateur />
    </div>
  )
}
