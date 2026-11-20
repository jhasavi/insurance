-- CreateEnum
CREATE TYPE "public"."KnowledgeCategory" AS ENUM ('ROTH_VS_PERM', 'TERM_PLUS_INVEST_VS_PERM', 'ANNUITY_TRENDS', 'TAX_SAVINGS', 'COLLEGE_PLANNING');

-- CreateTable
CREATE TABLE "public"."data_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."market_data_points" (
    "id" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "carrier" TEXT,
    "periodYears" INTEGER,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "asOfDate" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_data_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge_topics" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "public"."KnowledgeCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge_topic_sources" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "knowledge_topic_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "market_data_points_assetClass_idx" ON "public"."market_data_points"("assetClass");

-- CreateIndex
CREATE INDEX "market_data_points_periodYears_idx" ON "public"."market_data_points"("periodYears");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_topics_slug_key" ON "public"."knowledge_topics"("slug");

-- CreateIndex
CREATE INDEX "knowledge_topics_category_idx" ON "public"."knowledge_topics"("category");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_topic_sources_topicId_sourceId_key" ON "public"."knowledge_topic_sources"("topicId", "sourceId");

-- CreateIndex
CREATE INDEX "properties_userId_idx" ON "public"."properties"("userId");

-- CreateIndex
CREATE INDEX "properties_city_state_idx" ON "public"."properties"("city", "state");

-- CreateIndex
CREATE INDEX "properties_zipCode_idx" ON "public"."properties"("zipCode");

-- CreateIndex
CREATE INDEX "properties_createdAt_idx" ON "public"."properties"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "vehicles_userId_idx" ON "public"."vehicles"("userId");

-- CreateIndex
CREATE INDEX "vehicles_make_model_year_idx" ON "public"."vehicles"("make", "model", "year");

-- CreateIndex
CREATE INDEX "vehicles_createdAt_idx" ON "public"."vehicles"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."market_data_points" ADD CONSTRAINT "market_data_points_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "public"."data_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."knowledge_topic_sources" ADD CONSTRAINT "knowledge_topic_sources_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."knowledge_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."knowledge_topic_sources" ADD CONSTRAINT "knowledge_topic_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "public"."data_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
