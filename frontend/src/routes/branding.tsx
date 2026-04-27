import { createFileRoute, notFound } from '@tanstack/react-router'
import { BrandingPage } from '../components/BrandingPage'

export const Route = createFileRoute('/branding')({
  loader: () => {
    if (import.meta.env.PROD) throw notFound()
  },
  component: BrandingPage,
})
