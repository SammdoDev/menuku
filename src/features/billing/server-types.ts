import "server-only";

import type { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type BillingAdminClient = ReturnType<typeof createSupabaseAdminClient>;
