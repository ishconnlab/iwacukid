import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Check, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Program } from '../types';
import { api } from '../api/client';

export function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getPrograms();
        setPrograms(data);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <Compass className="w-3.5 h-3.5" />
          <span>Youth Development & Culture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Cultural Programs & Training
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          Structured cultural arts training, vacation camps, and dance academies led by master instructors in Nyakaliro, Rwanda.
        </p>
      </div>

      {/* Programs List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <article
              key={program.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-orange-400 border border-stone-700">
                    {program.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900">{program.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-orange-600" />
                      {program.ageRange}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      {program.schedule}
                    </span>
                  </div>

                  {program.highlights && program.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-extrabold uppercase text-stone-400 block">
                        Program Highlights
                      </span>
                      {program.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/events"
                  className="w-full py-3 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Program Events & Recitals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
