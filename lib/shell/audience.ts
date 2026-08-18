export const AUDIENCE_COOKIE = 'nmw-audience'
export const AUDIENCE_MAX_AGE = 60 * 60 * 24 * 90

export type Audience = 'entreprise' | 'agence'

export const AUDIENCES = [
  { id: 'entreprise', label: 'Entreprise', href: '/' },
  { id: 'agence', label: 'Agence', href: '/agences' },
] as const satisfies readonly { id: Audience; label: string; href: string }[]

/** Révèle le rappel avant le premier rendu. Lire le cookie côté serveur rendrait
 *  `/` dynamique, et Next n'y émet plus les préchargements de police dans le `<head>`. */
export function rappelAudienceScript(elementId: string): string {
  return `(function(){try{if(/(?:^|;\\s*)${AUDIENCE_COOKIE}=agence(?:;|$)/.test(document.cookie)){var e=document.getElementById('${elementId}');if(e)e.hidden=false}}catch(e){}})()`
}
