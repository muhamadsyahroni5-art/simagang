import React, { useState } from 'react';
import JSZip from 'jszip';
import { PHP_SOURCE_FILES, PhpSourceFile } from '../data/phpCodeTemplates';
import { Database, FileCode, Copy, Check, Download, X, Server, FolderCheck, Archive } from 'lucide-react';

interface PhpMySqlPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpMySqlPackageModal: React.FC<PhpMySqlPackageModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<PhpSourceFile>(PHP_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = (file: PhpSourceFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Folder proyek sitamu
      const rootFolder = zip.folder('sitamu') || zip;

      // Add each PHP and SQL file
      PHP_SOURCE_FILES.forEach(f => {
        rootFolder.file(f.name, f.code);
      });

      // Add installation instructions
      const petunjuk = `===================================================================================
PETUNJUK CEPAT MENJALANKAN SI-TAMU KEMENAG LEBAK DI LARAGON / XAMPP
===================================================================================

1. EKSTRAK FOLDER:
   Ekstrak seluruh folder 'sitamu' ini ke dalam:
   • Laragon : C:\\laragon\\www\\sitamu
   • XAMPP   : C:\\xampp\\htdocs\\sitamu

2. DATABASE MYSQL:
   • Nyalakan Apache & MySQL di Laragon / XAMPP
   • Buka phpMyAdmin (http://localhost/phpmyadmin)
   • Buat database baru bernama: db_sitamu_lebak
   • Import file 'database_sitamu.sql'

3. JALANKAN DI BROWSER:
   • Halaman Kiosk Tamu : http://localhost/sitamu/
   • Login Petugas      : http://localhost/sitamu/login.php

AKUN LOGIN BAWAAN:
• Admin    : admin / admin123 (Wewenang Penuh)
• Operator : operator / operator123 (Wewenang Terbatas)
===================================================================================`;
      rootFolder.file('PETUNJUK_INSTALASI.txt', petunjuk);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SI_TAMU_Kemenag_Lebak_PHP_MySQL.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed generating zip', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 md:p-6">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col my-auto border border-slate-200 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900 border border-emerald-700">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Source Code PHP Murni + Database MySQL
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-100">
                  Laragon & XAMPP Ready
                </span>
              </h2>
              <p className="text-xs text-emerald-200">
                Paket skrip lengkap SI-TAMU Kemenag Lebak siap pakai untuk localhost server kantor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-md transition cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              {isZipping ? 'Menyiapkan ZIP...' : 'Unduh Proyek (.ZIP)'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="bg-emerald-50/70 border-b border-emerald-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-emerald-900 gap-2">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Lokasi Folder:</strong> Laragon <code className="bg-emerald-100 px-1 py-0.5 rounded">C:/laragon/www/sitamu</code> atau XAMPP <code className="bg-emerald-100 px-1 py-0.5 rounded">C:/xampp/htdocs/sitamu</code>
            </span>
          </div>
          <div className="text-slate-600">
            Login Bawaan: <strong>admin</strong> / <strong>admin123</strong> atau <strong>operator</strong> / <strong>operator123</strong>
          </div>
        </div>

        {/* Main Workspace (Sidebar + Code View) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
          
          {/* File List Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto space-y-1 shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Daftar File Project
            </div>
            {PHP_SOURCE_FILES.map(file => {
              const isSelected = selectedFile.name === file.name;
              const isSql = file.name.endsWith('.sql');
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-emerald-800 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSql ? (
                      <Database className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-amber-600'}`} />
                    ) : (
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`} />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  {isSelected && <span className="text-[10px] opacity-75">Dipilih</span>}
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 text-slate-200 overflow-hidden">
            
            {/* Viewer Top Action */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-bold text-emerald-400">{selectedFile.name}</span>
                <span className="text-slate-400 ml-3 text-[11px]">{selectedFile.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin!' : 'Salin Kode'}
                </button>
                <button
                  onClick={() => handleDownloadSingle(selectedFile)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh File
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-emerald-200/90 leading-relaxed bg-slate-950/70 select-text">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <p className="text-slate-500">
            Aplikasi web ini juga dapat digunakan secara langsung di browser tanpa instalasi tambahan.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
