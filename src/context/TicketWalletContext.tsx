import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket } from '../types';

interface TicketWalletContextType {
  savedTickets: Ticket[];
  saveTicket: (ticket: Ticket) => void;
  saveTickets: (tickets: Ticket[]) => void;
  removeTicket: (ticketId: string) => void;
  getTicket: (ticketId: string) => Ticket | undefined;
}

const TicketWalletContext = createContext<TicketWalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = 'iwacu_kids_ticket_wallet_v1';

export function TicketWalletProvider({ children }: { children: ReactNode }) {
  const [savedTickets, setSavedTickets] = useState<Ticket[]>(() => {
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(savedTickets));
    } catch (err) {
      console.warn('Could not save tickets to local storage:', err);
    }
  }, [savedTickets]);

  const saveTicket = (ticket: Ticket) => {
    setSavedTickets((prev) => {
      const exists = prev.some((t) => t.id === ticket.id || t.ticketCode === ticket.ticketCode);
      if (exists) {
        return prev.map((t) => (t.id === ticket.id ? ticket : t));
      }
      return [ticket, ...prev];
    });
  };

  const saveTickets = (tickets: Ticket[]) => {
    setSavedTickets((prev) => {
      const map = new Map<string, Ticket>();
      prev.forEach((t) => map.set(t.id, t));
      tickets.forEach((t) => map.set(t.id, t));
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  };

  const removeTicket = (ticketId: string) => {
    setSavedTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const getTicket = (ticketId: string) => {
    return savedTickets.find((t) => t.id === ticketId || t.ticketCode === ticketId);
  };

  return (
    <TicketWalletContext.Provider
      value={{
        savedTickets,
        saveTicket,
        saveTickets,
        removeTicket,
        getTicket,
      }}
    >
      {children}
    </TicketWalletContext.Provider>
  );
}

export function useTicketWallet() {
  const context = useContext(TicketWalletContext);
  if (!context) {
    throw new Error('useTicketWallet must be used within a TicketWalletProvider');
  }
  return context;
}
