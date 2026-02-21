import { getServerSupabase } from "@/shared/lib/supabaseServer";
import Link from "next/link";
import { Search, Sparkles, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IngredientsPage() {
    const supabase = await getServerSupabase();

    const { data: ingredients, error } = await supabase
        .from("ingredients")
        .select("id, name, slug, description, safety_level")
        .order("name");

    if (error) {
        console.error("Error fetching ingredients:", error);
    }

    return (
        <main className="min-h-screen bg-white pb-24 font-sans selection:bg-brand-primary/20">
            {/* Editorial Hero Section */}
            <section className="relative overflow-hidden bg-neutral-50/50 pt-20 pb-16 border-b border-neutral-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-primary/10 text-brand-primary mb-6">
                            <BookOpen className="w-4 h-4" />
                            Ensiklopedia Skincare
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 mb-6 tracking-tight leading-tight">
                            Kamus Kandungan
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed">
                            Pelajari sains di balik rutinitas perawatan kulit Anda. Temukan manfaat, fungsi, dan tingkat keamanan dari setiap bahan aktif.
                        </p>

                        <div className="mt-10 w-full max-w-xl relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-neutral-400 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari kandungan (mis. Niacinamide, Salicylic Acid)..."
                                className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-2xl leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:border-brand-primary focus:ring-0 sm:text-lg transition-all shadow-sm group-hover:shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-neutral-900">
                        <Sparkles className="w-6 h-6 text-brand-primary" />
                        Eksplorasi Semua Kandungan
                    </h2>
                    <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                        {ingredients?.length || 0} Entri
                    </span>
                </div>

                {ingredients && ingredients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ingredients.map((ing) => {
                            const safeLevel = ing.safety_level ? String(ing.safety_level).toLowerCase() : "";
                            const isSafe = safeLevel.includes("rendah") || safeLevel.includes("aman") || safeLevel.includes("low");
                            const isDanger = safeLevel.includes("tinggi") || safeLevel.includes("bahaya") || safeLevel.includes("high");

                            return (
                                <Link
                                    key={ing.id}
                                    href={`/ingredients/${ing.slug}`}
                                    className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand-primary/5 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="p-6 md:p-8 flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4 gap-4">
                                            <h3 className="text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight">
                                                {ing.name}
                                            </h3>
                                            {ing.safety_level && (
                                                <span
                                                    className={`shrink-0 inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${isSafe
                                                            ? "bg-green-100 text-green-700"
                                                            : isDanger
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {ing.safety_level}
                                                </span>
                                            )}
                                        </div>

                                        {/* Excerpt */}
                                        <p className="text-neutral-600 leading-relaxed max-w-none text-base line-clamp-3 mb-6 flex-grow">
                                            {ing.description || "Tidak ada gambaran singkat yang tersedia untuk saat ini."}
                                        </p>

                                        {/* Footer / Read More */}
                                        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center text-sm font-bold text-brand-primary">
                                            Baca Selengkapnya
                                            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200/60 shadow-inner">
                        <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-neutral-700">Belum ada data kandungan di dalam kamus ini.</p>
                        <p className="text-sm text-neutral-500 mt-2">Kami sedang memperbarui database editorial kami.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
