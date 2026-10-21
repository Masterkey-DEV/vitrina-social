-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'custom',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "department" TEXT,
    "bio" TEXT,
    "receiveNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "receiveUpdates" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foundation" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siglas" TEXT NOT NULL,
    "objective" TEXT,
    "description" TEXT,
    "whatsapp" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "department" TEXT,
    "city" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "imageId" INTEGER,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Foundation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Initiative" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "description" TEXT,
    "foundationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Initiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "stock" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitiativeCategory" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "InitiativeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alternativeText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mime" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'cloudinary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InitiativeImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_InitiativeCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_InitiativeMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_documentId_key" ON "User"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsapp_key" ON "User"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Foundation_documentId_key" ON "Foundation"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Foundation_name_key" ON "Foundation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Foundation_siglas_key" ON "Foundation"("siglas");

-- CreateIndex
CREATE UNIQUE INDEX "Foundation_imageId_key" ON "Foundation"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Foundation_usuarioId_key" ON "Foundation"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Initiative_documentId_key" ON "Initiative"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_documentId_key" ON "Product"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_documentId_key" ON "ProductCategory"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InitiativeCategory_documentId_key" ON "InitiativeCategory"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "InitiativeCategory_name_key" ON "InitiativeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Media_documentId_key" ON "Media"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "_InitiativeImages_AB_unique" ON "_InitiativeImages"("A", "B");

-- CreateIndex
CREATE INDEX "_InitiativeImages_B_index" ON "_InitiativeImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InitiativeCategories_AB_unique" ON "_InitiativeCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_InitiativeCategories_B_index" ON "_InitiativeCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InitiativeMembers_AB_unique" ON "_InitiativeMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_InitiativeMembers_B_index" ON "_InitiativeMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCategories_AB_unique" ON "_ProductCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductImages_AB_unique" ON "_ProductImages"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductImages_B_index" ON "_ProductImages"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foundation" ADD CONSTRAINT "Foundation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foundation" ADD CONSTRAINT "Foundation_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Initiative" ADD CONSTRAINT "Initiative_foundationId_fkey" FOREIGN KEY ("foundationId") REFERENCES "Foundation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeImages" ADD CONSTRAINT "_InitiativeImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeImages" ADD CONSTRAINT "_InitiativeImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeCategories" ADD CONSTRAINT "_InitiativeCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeCategories" ADD CONSTRAINT "_InitiativeCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "InitiativeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeMembers" ADD CONSTRAINT "_InitiativeMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InitiativeMembers" ADD CONSTRAINT "_InitiativeMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImages" ADD CONSTRAINT "_ProductImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImages" ADD CONSTRAINT "_ProductImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
