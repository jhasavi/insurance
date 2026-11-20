// Loads the research/knowledge-base content from src/lib/knowledge-base.ts
// into the Supabase Postgres database via the DataSource / MarketDataPoint /
// KnowledgeTopic / KnowledgeTopicSource models.
//
// The /research page reads straight from src/lib/knowledge-base.ts today, so
// the site works whether or not this has been run. Run this once the DB is
// reachable to also have the same content queryable from Supabase (e.g. for
// an admin UI, or to let content be edited without a code deploy):
//
//   pnpm run seed:knowledge

import { PrismaClient } from "@prisma/client"
import {
  dataSources,
  marketDataPoints,
  knowledgeTopics,
} from "../src/lib/knowledge-base"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding research/knowledge-base content...")

  for (const s of dataSources) {
    await prisma.dataSource.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        publisher: s.publisher,
        url: s.url,
        retrievedAt: new Date(s.retrievedAt),
      },
      update: {
        name: s.name,
        publisher: s.publisher,
        url: s.url,
        retrievedAt: new Date(s.retrievedAt),
      },
    })
  }
  console.log(`  ${dataSources.length} sources`)

  for (const d of marketDataPoints) {
    await prisma.marketDataPoint.upsert({
      where: { id: d.id },
      create: {
        id: d.id,
        assetClass: d.assetClass,
        label: d.label,
        carrier: d.carrier,
        periodYears: d.periodYears,
        startYear: d.startYear,
        endYear: d.endYear,
        value: d.value,
        unit: d.unit,
        asOfDate: new Date(d.asOfDate),
        sourceId: d.sourceId,
        notes: d.notes,
      },
      update: {
        assetClass: d.assetClass,
        label: d.label,
        carrier: d.carrier,
        periodYears: d.periodYears,
        startYear: d.startYear,
        endYear: d.endYear,
        value: d.value,
        unit: d.unit,
        asOfDate: new Date(d.asOfDate),
        sourceId: d.sourceId,
        notes: d.notes,
      },
    })
  }
  console.log(`  ${marketDataPoints.length} data points`)

  for (const t of knowledgeTopics) {
    await prisma.knowledgeTopic.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        slug: t.slug,
        category: t.category,
        title: t.title,
        summary: t.summary,
        body: t.body.join("\n\n"),
      },
      update: {
        slug: t.slug,
        category: t.category,
        title: t.title,
        summary: t.summary,
        body: t.body.join("\n\n"),
      },
    })

    for (const sourceId of t.sourceIds) {
      await prisma.knowledgeTopicSource.upsert({
        where: { topicId_sourceId: { topicId: t.id, sourceId } },
        create: { topicId: t.id, sourceId },
        update: {},
      })
    }
  }
  console.log(`  ${knowledgeTopics.length} topics`)

  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
