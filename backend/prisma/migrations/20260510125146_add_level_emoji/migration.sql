-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level_number" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CLASSIFICATION',
    "question_text" TEXT NOT NULL,
    "image_url" TEXT,
    "options_json" TEXT NOT NULL,
    "correct_config" TEXT NOT NULL,
    "bloom_level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "explanation" TEXT,
    "failure_message" TEXT,
    "story_json" TEXT,
    "level_emoji" TEXT NOT NULL DEFAULT '📚'
);
INSERT INTO "new_questions" ("bloom_level", "correct_config", "explanation", "id", "image_url", "level_number", "options_json", "question_text", "story_json", "topic", "type") SELECT "bloom_level", "correct_config", "explanation", "id", "image_url", "level_number", "options_json", "question_text", "story_json", "topic", "type" FROM "questions";
DROP TABLE "questions";
ALTER TABLE "new_questions" RENAME TO "questions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
