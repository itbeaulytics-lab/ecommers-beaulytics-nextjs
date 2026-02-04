import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import type { Review } from "@/types/product";

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => {
        const active = s <= value;
        return (
          <svg
            key={s}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill={active ? "#fbbf24" : "none"}
            stroke={active ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.25 6.518 20l1.05-6.126L3 9.25l6.259-.909L12 3l2.741 5.341L21 9.25l-4.568 4.624L17.482 20z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function maskName(email?: string | null) {
  if (!email) return "User";
  const [name] = email.split("@");
  if (!name) return "User";
  if (name.length <= 2) return `${name}***`;
  return `${name.slice(0, 2)}***`;
}

export default async function ReviewList({ productId }: { productId: string }) {
  const supabase = await getServerSupabaseRSC();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, user:user_id(full_name,email)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-sm text-red-600">Failed to load reviews.</div>;
  }

  const reviews = (data || []) as Review[];
  if (reviews.length === 0) {
    return <div className="text-sm text-brand-light">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => {
        const name = r.user?.full_name || maskName(r.user?.email) || "User";
        const ratingVal = Number(r.rating || 0);
        const date = new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
        return (
          <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-brand-dark">{name}</div>
                <div className="text-xs text-brand-light">{date}</div>
              </div>
              <StarRow value={ratingVal} />
            </div>
            {r.comment ? <div className="mt-3 text-sm text-brand-dark">{r.comment}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
