-- CreateTable
CREATE TABLE "ConfirmedMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestItem" TEXT NOT NULL,
    "confirmedMatch" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL,
    "total" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
