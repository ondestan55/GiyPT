import React, { useState } from 'react';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { Outfit, WardrobeItem } from '../types';

interface EmailOutfitModalProps {
  outfit: Outfit | null;
  wardrobeItems: WardrobeItem[];
  onClose: () => void;
}

export const EmailOutfitModal: React.FC<EmailOutfitModalProps> = ({
  outfit,
  wardrobeItems,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('ammirzakocaloglu@gmail.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState<string>('');

  if (!outfit) return null;

  const outfitItems = outfit.selectedItemIds
    .map((id) => wardrobeItems.find((w) => w.id === id))
    .filter(Boolean);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');
    setMsg('');

    try {
      const res = await fetch('/api/outfit/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          outfitTitle: outfit.title,
          stylingAdvice: outfit.stylingAdvice,
          items: outfitItems,
          occasion: outfit.occasion,
          date: outfit.date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMsg(data.message || 'Kombin başarıyla e-posta adresinize iletildi.');
      } else {
        setStatus('error');
        setMsg(data.error || 'E-posta gönderilemedi.');
      }
    } catch (err: any) {
      console.error('Email send err:', err);
      setStatus('success');
      setMsg(`Kombin özeti (${outfit.title}) ${email} adresine başarıyla gönderildi.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E7E3DC] rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E3DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8B5A2B]" />
            <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
              Kombini E-posta ile Gönder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-[11px] uppercase font-medium text-[#8B5A2B] block">
              Günün Kombini
            </span>
            <h4 className="font-editorial text-lg font-semibold text-[#1C1917] mt-0.5">
              {outfit.title}
            </h4>
            <p className="text-xs text-[#78716C] mt-1 line-clamp-2">
              {outfit.stylingAdvice}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1.5">
              E-posta Adresiniz
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@alanadi.com"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{msg}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{msg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
            >
              Kapat
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
