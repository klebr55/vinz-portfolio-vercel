import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://klebervinicius.dev'
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          'pt-BR': `${baseUrl}/pt-br`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pt-br`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
