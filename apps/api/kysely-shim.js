// Compatibility shim — dipakai lewat wrangler [alias] kysely = "./kysely-shim"
//
// Masalah: kysely 0.28+ tidak lagi mengeksport DEFAULT_MIGRATION_TABLE /
// DEFAULT_MIGRATION_LOCK_TABLE dari top-level index, tapi @better-auth/kysely-adapter
// masih mengimportnya dari "kysely".
//
// Solusi: alias "kysely" → shim ini. Shim mengimport dari path langsung
// (bukan specifier "kysely") sehingga tidak circular, dan mengeksport ulang
// dua konstanta yang hilang bersama semua export lainnya.

// Import dari path filesystem langsung (bypass exports map, tidak circular)
export * from "../../node_modules/kysely/dist/index.js";

// Tambah dua konstanta yang hilang dari top-level exports (ada di migrator.js)
export { DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE } from "../../node_modules/kysely/dist/migration/migrator.js";
