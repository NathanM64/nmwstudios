import { Configurateur } from '@/components/config/Configurateur'
import { EnteteConfigurateur } from '@/components/config/EnteteConfigurateur'

export const metadata = {
  title: 'Configurez votre site',
  description: 'Composez votre site et voyez le prix se construire.',
}

export default function Page() {
  return (
    <div className="lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden">
      <EnteteConfigurateur />
      <Configurateur />
    </div>
  )
}
