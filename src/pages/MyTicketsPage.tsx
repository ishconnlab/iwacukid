import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ticket as TicketIcon, Calendar, ArrowRight, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';
import { useTicketWallet } from '../context/TicketWalletContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Ticket } from '../types';
import { DigitalTicketCard } from '../components/tickets/DigitalTicketCard';

export function MyTicketsPage() {
  const { savedTickets, saveTickets } = useTicketWallet();
  const { token, user, isCustomer } = useAuth();
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<Ticket[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [myTickets, setMyTickets] = useState<Ticket[] | null>(null);
  const [myTicketsLoading, setMyTicketsLoading] = useState(false);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // Load the logged-in customer's tickets automatically
  useEffect(() => {
    if (token && user) {
      setMyTicketsLoading(true);
      api
        .getMyTickets()
        .then((tickets) => {
          setMyTickets(tickets);
          if (tickets.length > 0) saveTickets(tickets);
        })
        .catch(() => setMyTickets([]))
        .finally(() => setMyTicketsLoading(false));
    } else {
      setMyTickets(null);
    }
  }, [token, user]);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setSearching(true);
    setSearchError('');
    try {
      const tickets = await api.lookupTickets(lookupQuery.trim());
      setLookupResults(tickets);
      if (tickets.length > 0) {
        saveTickets(tickets);
      } else {
        setSearchError('No tickets found for this phone number or email.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lookup failed';
      setSearchError(msg);
    } finally {
      setSearching(false);
    }
  };

  const myTicketsList = myTickets !== null ? myTickets : [];
  const displayedTickets = lookupResults !== null ? lookupResults : myTicketsList.length > 0 ? myTicketsList : savedTickets;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-28">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <TicketIcon className="w-3.5 h-3.5" />
          <span>{isCustomer ? 'My Ticket Wallet' : 'My Digital Ticket Wallet'}</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          {isCustomer ? `Welcome, ${user?.name || user?.fullName}!` : 'Your Passes & Event Access'}
        </h1>
        {isCustomer && (
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
            These are the official tickets linked to your account{' '}
            <span className="font-mono font-bold">{user?.phone}</span>. Present the QR code at the
            gate for fast, touchless check-in and get your sequential registration number.
          </p>
        )}
        {!isCustomer && (
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
            Stored directly on your device. Present the QR code at the Nyakaliro entrance gate for fast, touchless check-in.
          </p>
        )}
      </div>

      {/* Signed-in customer tickets auto-loaded */}
      {myTicketsLoading ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto animate-pulse">
            <TicketIcon className="w-6 h-6" />
          </div>
          <p className="text-xs text-stone-500">Loading your tickets...</p>
        </div>
      ) : (
        myTicketsList.length === 0 &&
        isCustomer &&
        lookupResults === null && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <UserCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <span className="font-black block uppercase text-[10px] tracking-wider text-emerald-700">
                No tickets yet
              </span>
              <span>
                You haven't purchased any tickets on this account yet. Browse events and buy your
                first QR ticket below.
              </span>
            </div>
          </div>
        )
      )}

      {/* Ticket Lookup by Phone or Email */}
      <form
        onSubmit={handleLookup}
        className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Look Up Tickets by Phone Number or Email
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. +250788123456 or parent@gmail.com"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            {searching ? 'Finding...' : 'Find Tickets'}
          </button>
        </div>

        {searchError && (
          <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {searchError}
          </p>
        )}
      </form>

      {/* Display Tickets List */}
      {displayedTickets.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <TicketIcon className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">No Tickets Found</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            You don't have any saved tickets yet. If you recently purchased tickets, look them up above using your phone number.
          </p>
          <Link
            to="/events"
            className="inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Explore Events & Buy Tickets
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900">
              Active Passes ({displayedTickets.length})
            </h2>
            {lookupResults !== null && (
              <button
                type="button"
                onClick={() => setLookupResults(null)}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedTickets.map((t) => (
              <div key={t.id} className="space-y-2">
                <DigitalTicketCard ticket={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
