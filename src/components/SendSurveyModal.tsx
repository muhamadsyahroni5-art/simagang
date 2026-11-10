import React, { useState } from 'react';
import { Guest, WhatsAppSurveyConfig } from '../types';
import { buildWhatsAppSurveyUrl } from '../data/constants';
import {
  MessageSquareShare,
  Send,
  Copy,
  Check,
  ExternalLink,
  X,
  Phone,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface SendSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  surveyConfig: WhatsAppSurveyConfig;
  onSurveySent: (guestId: string) => void;
}

export const SendSurveyModal: React.FC<SendSurveyModalProps> = ({
  isOpen,
  onClose,
  guest,
  surveyConfig,
  onSurveySent,
}) => {
  if (!isOpen || !guest) return null;

  const [customPhone, setCustomPhone] = useState(guest.no_hp);
  const [copied, setCopied] = useState(false);

  const { url, text, cleanPhone } = buildWhatsAppSurveyUrl(
    customPhone || guest.no_hp,
    guest,
    surveyConfig
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onSurveySent(guest.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col border border-emerald-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-300">
              <MessageSquareShare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-1.5">
                Kirim Survei Kepuasan (IKM) via WhatsApp
              </h3>
              <p className="text-[11px] text-emerald-200">
                Pesan resmi PTSP Kemenag Kab. Lebak ke nomor tamu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Summary Info */}
        <div className="p-5 space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Tamu / Pengunjung:</span>
              <span className="font-bold text-slate-900">{guest.nama}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">No. Registrasi:</span>
              <span className="font-mono font-bold text-emerald-800">{guest.no_antrean}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Unit Tujuan:</span>
              <span className="font-semibold text-emerald-950">{guest.unit_tujuan}</span>
            </div>
          </div>

          {/* Destination Phone Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              Nomor WhatsApp Tujuan:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPhone}
                onChange={e => setCustomPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
              <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200">
                +{cleanPhone}
              </span>
            </div>
          </div>

          {/* WhatsApp Message Bubble Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Pratinjau Pesan yang Dikirim:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin!' : 'Salin Teks'}
              </button>
            </div>

            {/* Simulated WhatsApp Green Chat Bubble */}
            <div className="bg-[#e5ddd5] p-3 rounded-2xl border border-slate-300 max-h-56 overflow-y-auto">
              <div className="bg-white rounded-xl rounded-tr-none p-3 shadow-sm text-[11px] text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text border border-emerald-100">
                {text}
                <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Direct Link Survey Check */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-600 truncate max-w-xs">
              Link Survei: <strong>{surveyConfig.survey_url}</strong>
            </span>
            <a
              href={surveyConfig.survey_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-bold shrink-0 flex items-center gap-1"
            >
              Uji Link
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSendWA}
            className="flex-1 px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Buka WhatsApp & Kirim Survei
          </button>
        </div>

      </div>
    </div>
  );
};
