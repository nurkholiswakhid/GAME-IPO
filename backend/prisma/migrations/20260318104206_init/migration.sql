-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "students" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "absen" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "total_poin" INTEGER NOT NULL DEFAULT 0,
    "total_bintang" INTEGER NOT NULL DEFAULT 0,
    "total_waktu" INTEGER,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "level_results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "level_number" INTEGER NOT NULL,
    "poin" INTEGER NOT NULL DEFAULT 0,
    "bintang" INTEGER NOT NULL DEFAULT 0,
    "waktu_detik" INTEGER,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "completed_at" DATETIME,
    CONSTRAINT "level_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "image_url" TEXT,
    "options_json" TEXT NOT NULL,
    "correct_config" TEXT NOT NULL,
    "bloom_level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "explanation" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
