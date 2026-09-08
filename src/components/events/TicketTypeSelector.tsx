import { useState } from 'react';
import { Check, AlertCircle, Plus, Minus, Ticket } from 'lucide-react';
import { TicketType } from '../../types';

interface TicketTypeSelectorProps {
  ticketTypes: TicketType[];
  selectedTicketTypeId: string | null;
  onSelectTicketType: (ticketType: TicketType, quantity: number) => void;
}

export function TicketTypeSelector({
  ticketTypes,
  selectedTicketTypeId,
  onSelectTicketType,
}: TicketTypeSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    ticketTypes.forEach((t) => {
      init[t.id] = 1;
    });
    return init;
  });

  const handleQtyChange = (id: string, delta: number, maxAvailable: number) => {
    const current = quantities[id] || 1;
    const next = Math.max(1, Math.min(maxAvailable, current + delta));
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  return (
    <div className="space-y-4">
      {ticketTypes.map((tt) => {
        const available = Math.max(0, tt.totalQuantity - tt.soldQuantity);
        const isSoldOut = available === 0 || tt.status === 'SOLD_OUT';
        const isSelected = selectedTicketTypeId === tt.id;
        const currentQty = quantities[tt.id] || 1;

        return (
          <div
            key={tt.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isSoldOut
                ? 'bg-stone-50/70 border-stone-200 opacity-60'
                : isSelected
                ? 'bg-orange-50/40 border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-orange-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base sm:text-lg text-stone-900">{tt.name}</h4>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{tt.description}</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-black text-stone-900">
                  {tt.price.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
                </div>
                <div className="text-xs font-semibold">
                  {isSoldOut ? (
                    <span className="text-red-600 font-bold uppercase">SOLD OUT</span>
                  ) : (
                    <span className="text-emerald-700">
                      Available: <strong className="font-bold">{available}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits */}
            {tt.benefits && tt.benefits.length > 0 && (
              <ul className="py-3 space-y-1.5 text-xs text-stone-600">
                {tt.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Actions & Quantity Selector */}
            {!isSoldOut && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(tt.id, -1, available)}
                    disabled={currentQty <= 1}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 disabled:opacity-40 hover:bg-stone-50"
                    aria-label="Decrease ticket quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-stone-900">
                    {currentQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(tt.id, 1, available)}
                    disabled={currentQty >= Math.min(10, available)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 disabled:opacity-40 hover:bg-stone-50"
                    aria-label="Increase ticket quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTicketType(tt, currentQty)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-stone-900 hover:bg-orange-600 text-white'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>
                    {isSelected ? `Selected (${(tt.price * currentQty).toLocaleString()} RWF)` : 'Select Ticket'}
                  </span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
