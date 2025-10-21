-- Table pour stocker les messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,

  -- Contraintes
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT message_min_length CHECK (LENGTH(TRIM(message)) >= 10)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- RLS (Row Level Security) - Désactivé pour permettre les insertions publiques
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre les insertions publiques (formulaire de contact)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy pour permettre la lecture uniquement aux utilisateurs authentifiés (admin)
CREATE POLICY "Allow authenticated read" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE contact_messages IS 'Messages de contact envoyés depuis le formulaire du site';
COMMENT ON COLUMN contact_messages.id IS 'Identifiant unique du message';
COMMENT ON COLUMN contact_messages.name IS 'Nom complet du contact';
COMMENT ON COLUMN contact_messages.email IS 'Email du contact';
COMMENT ON COLUMN contact_messages.company IS 'Nom de l''entreprise (optionnel)';
COMMENT ON COLUMN contact_messages.phone IS 'Numéro de téléphone (optionnel)';
COMMENT ON COLUMN contact_messages.project_type IS 'Type de projet (landing, vitrine, dashboard, etc.)';
COMMENT ON COLUMN contact_messages.budget IS 'Budget estimé du projet';
COMMENT ON COLUMN contact_messages.message IS 'Message de contact';
COMMENT ON COLUMN contact_messages.created_at IS 'Date et heure de création du message';
COMMENT ON COLUMN contact_messages.read IS 'Indique si le message a été lu par l''admin';
