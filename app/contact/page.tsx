'use client'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useState } from 'react'

const contactInfo = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'contact@nmwstudios.com',
    href: 'mailto:contact@nmwstudios.com',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Localisation',
    value: 'Bordeaux, France',
    href: null,
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Disponibilité',
    value: 'Réponse sous 24h',
    href: null,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nom requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message requis'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Minimum 10 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi')
      }

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        budget: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({
        submit: error instanceof Error
          ? error.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Discutons de{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                votre projet web
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Vous avez une idée ou un projet digital ? Décrivez vos besoins, et
              nous vous répondrons sous 24h avec un devis gratuit et sans
              engagement.
            </p>
          </ScrollReveal>

          {/* Contact Info Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {contactInfo.map((info, i) => (
              <ScrollReveal key={info.label} delay={i * 0.1}>
                {info.href ? (
                  <a
                    href={info.href}
                    className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-accent-blue/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                      {info.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {info.label}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {info.value}
                    </p>
                  </a>
                ) : (
                  <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                      {info.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {info.label}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {info.value}
                    </p>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  Envoyez-nous un message
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Remplissez le formulaire ci-dessous et nous reviendrons vers vous
                  rapidement pour discuter de votre projet et de vos objectifs.
                </p>

                {submitSuccess && (
                  <div className="mt-6 rounded-lg bg-green-500/10 p-4 text-green-600 dark:text-green-400">
                    ✓ Votre message a été envoyé avec succès ! Nous reviendrons vers vous très bientôt.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {/* Name & Email */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-2 block w-full rounded-lg border ${
                          errors.name
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400`}
                        placeholder="Votre nom"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-2 block w-full rounded-lg border ${
                          errors.email
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Company & Phone */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Entreprise (optionnel)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>

                  {/* Project Type & Budget */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="projectType"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Type de projet
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="landing">Landing page / MVP</option>
                        <option value="vitrine">Site vitrine</option>
                        <option value="dashboard">Dashboard / Application</option>
                        <option value="refonte">Refonte de site existant</option>
                        <option value="maintenance">Maintenance / Hébergement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Budget estimé
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Sélectionnez un budget</option>
                        <option value="500-1000">500 € - 1 000 €</option>
                        <option value="1000-2500">1 000 € - 2 500 €</option>
                        <option value="2500-5000">2 500 € - 5 000 €</option>
                        <option value="5000+">5 000 € et plus</option>
                        <option value="discuter">À discuter</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`mt-2 block w-full rounded-lg border ${
                        errors.message
                          ? 'border-red-500'
                          : 'border-gray-200 dark:border-gray-700'
                      } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400`}
                      placeholder="Décrivez votre projet, vos besoins, vos contraintes de timing..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="rounded-lg bg-red-500/10 p-4 text-red-600 dark:text-red-400">
                      {errors.submit}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">*</span> Champs obligatoires
                    </p>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      bounce
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </div>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* CTA Alternative */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Vous préférez un contact direct ?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Vous pouvez nous écrire directement par email pour échanger sur
              votre projet.
            </p>
            <div className="mt-8">
              <Button
                href="mailto:contact@nmwstudios.com"
                variant="outline"
                bounce
              >
                contact@nmwstudios.com
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
