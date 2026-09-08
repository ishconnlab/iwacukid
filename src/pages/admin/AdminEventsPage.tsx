import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  Sparkles,
  ChevronLeft,
  AlertCircle,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Event, TicketType } from '../../types';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export function AdminEventsPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Capacity increase state
  const [boostEvent, setBoostEvent] = useState<Event | null>(null);
  const [boostAmount, setBoostAmount] = useState(50);
  const [boostSaving, setBoostSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: 'cat-traditional',
    categoryName: 'Traditional Dance',
    description: '',
    shortDescription: '',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-07-15',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    location: 'Nyakaliro, Rwanda',
    venue: 'Nyakaliro Cultural Arena',
    capacity: 250,
    status: 'PUBLISHED' as const,
    featured: false,
    standardPrice: 1000,
    premiumPrice: 2000,
    vipPrice: 3000,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const ticketTypes: TicketType[] = [
        {
          id: `tt-std-${Date.now()}`,
          eventId: '',
          name: 'Standard Child Pass',
          price: Number(formData.standardPrice),
          totalQuantity: Math.round(formData.capacity * 0.6),
          soldQuantity: 0,
          description: 'Full entrance to event grounds and seating area.',
          benefits: ['Event access', 'Standard spectator seating'],
          status: 'ACTIVE',
        },
        {
          id: `tt-prm-${Date.now()}`,
          eventId: '',
          name: 'Premium Family Access',
          price: Number(formData.premiumPrice),
          totalQuantity: Math.round(formData.capacity * 0.3),
          soldQuantity: 0,
          description: 'Front stage viewing zone and participation workshop pass.',
          benefits: ['Priority stage seating', 'Traditional workshop pass', 'Complimentary refreshments'],
          status: 'ACTIVE',
        },
        {
          id: `tt-vip-${Date.now()}`,
          eventId: '',
          name: 'VIP Youth Dignitary',
          price: Number(formData.vipPrice),
          totalQuantity: Math.round(formData.capacity * 0.1),
          soldQuantity: 0,
          description: 'Reserved canopy pavilion with master choreographer photo-op.',
          benefits: ['Reserved VIP lounge', 'Master dancer photo session', 'Commemorative certificate'],
          status: 'ACTIVE',
        },
      ];

      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (editingEvent) {
        await api.updateEvent(editingEvent.id, {
          ...formData,
          slug,
        });
      } else {
        await api.createEvent({
          ...formData,
          slug,
          ticketTypes,
          galleryImages: [formData.coverImage],
          whatsIncluded: ['Full event access', 'Cultural performance program', 'Child safety supervision'],
          ageRange: 'Ages 4-18 & Families',
          faqs: [{ question: 'Are parents allowed to accompany children?', answer: 'Yes, parents and guardians are welcome.' }],
        });
      }

      setShowCreateModal(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.deleteEvent(id);
      await loadEvents();
    } catch (err: unknown) {
      alert('Failed to delete event');
    }
  };

  const handleIncreaseCapacity = async () => {
    if (!boostEvent) return;
    setBoostSaving(true);
    try {
      const res = await api.increaseEventCapacity(boostEvent.id, Number(boostAmount));
      alert(res.message || 'Event participant range increased.');
      setBoostEvent(null);
      await loadEvents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to increase capacity');
    } finally {
      setBoostSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Event Management
            </h1>
            <span className="text-xs text-stone-500">
              Publish events and configure ticket pricing in RWF
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEvent(null);
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-400 uppercase text-[10px] font-black">
                  <th className="p-4">Event</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Pricing (RWF)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-stone-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.coverImage}
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-extrabold text-stone-900 block">{ev.title}</span>
                          <span className="text-[11px] text-stone-400">{ev.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-stone-600">{ev.categoryName}</td>
                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">{ev.eventDate}</span>
                      <span className="text-[11px] text-stone-500">{ev.startTime}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">
                        {ev.ticketTypes.reduce((a, t) => a + (t.soldQuantity || 0), 0)} /{' '}
                        {ev.ticketTypes.reduce((a, t) => a + (t.totalQuantity || 0), 0)} sold
                      </span>
                      <span className="text-[11px] text-stone-400">{ev.capacity} Attendees</span>
                      {ev.status === 'SOLD_OUT' && (
                        <span className="text-[10px] font-black text-red-600 block mt-0.5">
                          Sold out — increase capacity below
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs">
                        {ev.ticketTypes.map((t) => `${t.price}`).join(' / ')} RWF
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          ev.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'SOLD_OUT'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBoostEvent(ev);
                            setBoostAmount(50);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Increase participant range / capacity"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingEvent(ev);
                            setFormData({
                              title: ev.title,
                              slug: ev.slug,
                              categoryId: ev.categoryId,
                              categoryName: ev.categoryName,
                              description: ev.description,
                              shortDescription: ev.shortDescription,
                              coverImage: ev.coverImage,
                              eventDate: ev.eventDate,
                              startTime: ev.startTime,
                              endTime: ev.endTime,
                              location: ev.location,
                              venue: ev.venue,
                              capacity: ev.capacity,
                              status: ev.status as any,
                              featured: ev.featured,
                              standardPrice: ev.ticketTypes[0]?.price || 1000,
                              premiumPrice: ev.ticketTypes[1]?.price || 2000,
                              vipPrice: ev.ticketTypes[2]?.price || 3000,
                            });
                            setShowCreateModal(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-orange-600 hover:bg-stone-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-xl font-black text-stone-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Nyakaliro Traditional Dance Gala"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Category *</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  >
                    <option value="Traditional Dance">Traditional Dance</option>
                    <option value="Modern Dance">Modern Dance</option>
                    <option value="Summer Events">Summer Events</option>
                    <option value="Vacation Programs">Vacation Programs</option>
                    <option value="Special Events">Special Events</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Start Time</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">End Time</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Location & Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nyakaliro, Rwanda"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              {/* TICKET PRICING CONFIGURATION (RWF) */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
                <span className="font-black text-orange-950 block uppercase text-[11px]">
                  Configurable Ticket Pricing (RWF)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block">Standard Pass</label>
                    <input
                      type="number"
                      value={formData.standardPrice}
                      onChange={(e) => setFormData({ ...formData, standardPrice: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block">Premium Pass</label>
                    <input
                      type="number"
                      value={formData.premiumPrice}
                      onChange={(e) => setFormData({ ...formData, premiumPrice: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block">VIP Dignitary</label>
                    <input
                      type="number"
                      value={formData.vipPrice}
                      onChange={(e) => setFormData({ ...formData, vipPrice: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 font-mono font-bold text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INCREASE CAPACITY MODAL */}
      {boostEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-stone-900">Increase Event Capacity</h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                "{boostEvent.title}" has{' '}
                <span className="font-black text-red-600">
                  {boostEvent.status === 'SOLD_OUT' ? 'SOLD OUT' : 'limited space'}.
                </span>{' '}
                Expand the participant range so more families can register. This adds seats to
                every ticket type and re-publishes the event.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Current capacity</span>
                <span className="font-bold">{boostEvent.capacity} attendees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sold so far</span>
                <span className="font-bold">
                  {boostEvent.ticketTypes.reduce((a, t) => a + (t.soldQuantity || 0), 0)} /
                  {boostEvent.ticketTypes.reduce((a, t) => a + (t.totalQuantity || 0), 0)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Additional seats per ticket type *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  value={boostAmount}
                  onChange={(e) => setBoostAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <span className="text-[10px] text-stone-500 block">
                With {boostEvent.ticketTypes.length} ticket tier(s), this will add{' '}
                <span className="font-black">
                  +{boostAmount * boostEvent.ticketTypes.length}
                </span>{' '}
                total seats (new capacity:{' '}
                <span className="font-black">
                  {boostEvent.capacity + boostAmount * boostEvent.ticketTypes.length}
                </span>
                ).
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBoostEvent(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIncreaseCapacity}
                disabled={boostSaving || !boostAmount || boostAmount < 1}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl disabled:opacity-50"
              >
                {boostSaving ? 'Increasing...' : `Increase to ${boostEvent.capacity + boostAmount * boostEvent.ticketTypes.length}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
