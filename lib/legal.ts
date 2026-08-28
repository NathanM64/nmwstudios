export const LEGAL = {
  legalName: 'Marimbordes Nathan Julien',
  legalForm: 'Entrepreneur individuel',
  siret: '99316693300016',
  address: '7 rue Jane Goodall, 33130 Bègles, France',
  publisher: 'Nathan Marimbordes',
  vatNotice: 'TVA non applicable, article 293 B du CGI',
  email: 'contact@nmwstudios.com',
  phone: '+33 6 89 80 15 89',
  phoneHref: '+33689801589',
  // Checked against the infra repo: hcloud_server on cx23, nbg1 datacenter in Nuremberg.
  // The entity operating Hetzner Cloud is Hetzner Online GmbH.
  host: {
    name: 'Hetzner Online GmbH',
    address: 'Industriestr. 25, 91710 Gunzenhausen, Allemagne',
    phone: '+49 9831 505-0',
  },
} as const

export const DAY_RATE = 500
