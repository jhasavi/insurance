import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Insurance Carriers
  const carriers = [
    {
      name: 'Progressive',
      slug: 'progressive',
      logo: '/carriers/progressive.png',
      website: 'https://www.progressive.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.2,
      financialStrength: 'A+',
    },
    {
      name: 'Lemonade',
      slug: 'lemonade',
      logo: '/carriers/lemonade.png',
      website: 'https://www.lemonade.com',
      apiEnabled: false,
      linesOfBusiness: ['HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME'],
      rating: 4.5,
      financialStrength: 'A',
    },
    {
      name: 'GEICO',
      slug: 'geico',
      logo: '/carriers/geico.png',
      website: 'https://www.geico.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.3,
      financialStrength: 'A++',
    },
    {
      name: 'State Farm',
      slug: 'state-farm',
      logo: '/carriers/state-farm.png',
      website: 'https://www.statefarm.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.1,
      financialStrength: 'A++',
    },
    {
      name: 'Allstate',
      slug: 'allstate',
      logo: '/carriers/allstate.png',
      website: 'https://www.allstate.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 3.9,
      financialStrength: 'A+',
    },
    {
      name: 'Liberty Mutual',
      slug: 'liberty-mutual',
      logo: '/carriers/liberty-mutual.png',
      website: 'https://www.libertymutual.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.0,
      financialStrength: 'A',
    },
    {
      name: 'Travelers',
      slug: 'travelers',
      logo: '/carriers/travelers.png',
      website: 'https://www.travelers.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.1,
      financialStrength: 'A++',
    },
    {
      name: 'USAA',
      slug: 'usaa',
      logo: '/carriers/usaa.png',
      website: 'https://www.usaa.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.7,
      financialStrength: 'A++',
    },
    {
      name: 'Nationwide',
      slug: 'nationwide',
      logo: '/carriers/nationwide.png',
      website: 'https://www.nationwide.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.0,
      financialStrength: 'A+',
    },
    {
      name: 'Farmers Insurance',
      slug: 'farmers',
      logo: '/carriers/farmers.png',
      website: 'https://www.farmers.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 3.8,
      financialStrength: 'A',
    },
    {
      name: 'Hippo',
      slug: 'hippo',
      logo: '/carriers/hippo.png',
      website: 'https://www.hippo.com',
      apiEnabled: false,
      linesOfBusiness: ['HOME'],
      statesCovered: ['MA', 'NH', 'RI', 'CT'],
      rating: 4.4,
      financialStrength: 'A',
    },
    {
      name: 'Branch Insurance',
      slug: 'branch',
      logo: '/carriers/branch.png',
      website: 'https://www.ourbranch.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME'],
      statesCovered: ['MA'],
      rating: 4.3,
      financialStrength: 'A',
    },
    {
      name: 'Clearcover',
      slug: 'clearcover',
      logo: '/carriers/clearcover.png',
      website: 'https://www.clearcover.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO'],
      statesCovered: ['MA', 'NH', 'RI', 'CT'],
      rating: 4.5,
      financialStrength: 'A',
    },
    {
      name: 'Root Insurance',
      slug: 'root',
      logo: '/carriers/root.png',
      website: 'https://www.joinroot.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO'],
      statesCovered: ['MA', 'NH', 'RI', 'CT'],
      rating: 4.2,
      financialStrength: 'A',
    },
    {
      name: 'Amica Mutual',
      slug: 'amica',
      logo: '/carriers/amica.png',
      website: 'https://www.amica.com',
      apiEnabled: false,
      linesOfBusiness: ['AUTO', 'HOME', 'RENTERS'],
      statesCovered: ['MA', 'NH', 'RI', 'CT', 'ME', 'VT'],
      rating: 4.6,
      financialStrength: 'A++',
    },
  ]

  for (const carrier of carriers) {
    await prisma.insuranceCarrier.upsert({
      where: { slug: carrier.slug },
      update: carrier,
      create: carrier,
    })
    console.log(`✅ Carrier: ${carrier.name}`)
  }

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
