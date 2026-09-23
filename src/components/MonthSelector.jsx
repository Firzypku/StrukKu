import React, { useState, useEffect, useRef } from 'react';
import { formatRupiah } from '../utils/prediction';
import { useToast } from '../context/ToastContext';

/**
 * MonthSelector.jsx — Komponen pemilih bulan, navigasi riwayat bulan lampau,
 * dan fitur reset bulan aman dengan konfirmasi ketik nama bulan di bottom sheet & Urungkan 10 detik.
 */
export default function MonthSelector({
  selectedYear,
  selectedMonth,
  selectedMonthName,
  isCurrentMonth,
  prevMonth,
  nextMonth,
  setMonthYear,
  goToCurrentMonth,
  availableMonths = [],
  onResetMonth,
  onUndoResetMonth,
  totalExpense = 0,
  transactionCount = 0,
  showResetButton = true,
}) {
  const toast = useToast();
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [typedMonth, setTypedMonth] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Undo (Urungkan) State — 10 detik countdown
  const [undoState, setUndoState] = useState(null); // { backup: [...], monthName: string, secondsLeft: number }
  const timerRef = useRef(null);

  useEffect(() => {
    if (undoState && undoState.secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setUndoState((prev) => {
          if (!prev || prev.secondsLeft <= 1) return null;
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [undoState]);

  const isConfirmationMatched = typedMonth.trim().toLowerCase() === selectedMonthName.toLowerCase();

  const handleOpenResetModal = () => {
    setTypedMonth('');
    setShowResetModal(true);
  };

  const handleConfirmReset = async () => {
    if (!onResetMonth || !isConfirmationMatched) return;
    setIsResetting(true);
    try {
      const backup = await onResetMonth();
      setShowResetModal(false);
      setTypedMonth('');

      if (backup && backup.length > 0) {
        setUndoState({
          backup,
          monthName: `${selectedMonthName} ${selectedYear}`,
          secondsLeft: 10,
        });
      }
      toast.success(`Data bulan ${selectedMonthName} berhasil direset.`);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mereset bulan: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsResetting(false);
    }
  };

  const handleUndoReset = async () => {
    if (!undoState || !onUndoResetMonth) return;
    try {
      await onUndoResetMonth(undoState.backup);
      setUndoState(null);
      toast.success('Reset berhasil diurungkan! Data transaksi telah kembali.');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengurungkan reset.');
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-card border border-white/60">
        <div className="flex items-center justify-between gap-2">
          {/* Tombol Geser Bulan Sebelumnya */}
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 flex items-center justify-center text-gray-700 font-bold transition-all border border-gray-100"
            title="Bulan sebelumnya"
          >
            ←
          </button>

          {/* Tombol Pilih Bulan & Tahun */}
          <div className="flex-1 text-center">
            <button
              onClick={() => setShowPickerModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-primary/5 active:scale-95 transition-all text-gray-800 font-extrabold text-sm sm:text-base group"
            >
              <span>📅 {selectedMonthName} {selectedYear}</span>
              <span className="text-xs text-primary group-hover:translate-y-0.5 transition-transform">▼</span>
            </button>
            <div className="text-[11px] text-gray-500 font-medium">
              {transactionCount > 0 ? (
                <span>{transactionCount} transaksi · <strong className="text-primary">{formatRupiah(totalExpense)}</strong></span>
              ) : (
                <span className="text-gray-400">Belum ada transaksi</span>
              )}
            </div>
          </div>

          {/* Tombol Geser Bulan Berikutnya */}
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 flex items-center justify-center text-gray-700 font-bold transition-all border border-gray-100"
            title="Bulan berikutnya"
          >
            →
          </button>
        </div>

        {/* Sub-bar Aksi Cepat (Bulan Ini & Reset) */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100 text-xs">
          <div>
            {!isCurrentMonth ? (
              <button
                onClick={goToCurrentMonth}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-bold transition-colors active:scale-95"
              >
                <span>⚡ Kembali ke Bulan Ini</span>
              </button>
            ) : (
              <span className="text-green-600 font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Bulan Sekarang
              </span>
            )}
          </div>

          {showResetButton && (
            <button
              onClick={handleOpenResetModal}
              disabled={transactionCount === 0}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all active:scale-95 ${
                transactionCount > 0
                  ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Reset pengeluaran bulan ini"
            >
              <span>🗑️ Reset Bulan</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL PEMILIH BULAN LAMPAU & TAHUN */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-gray-800 text-base">Pilih Riwayat Bulan</h3>
                <p className="text-xs text-gray-400 mt-0.5">Jelajahi pengeluaran bulan kebelakang</p>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* List Riwayat Bulan yang ada datanya */}
            <div className="overflow-y-auto flex-1 my-3 space-y-2 pr-1 no-scrollbar">
              {availableMonths.map((item) => {
                const isSelected = item.year === selectedYear && item.month === selectedMonth;
                return (
                  <button
                    key={`${item.year}-${item.month}`}
                    onClick={() => {
                      setMonthYear(item.year, item.month);
                      setShowPickerModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                        : 'bg-gray-50/70 border-gray-100 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.label}</span>
                        {item.isCurrent && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            Bulan Ini
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 font-normal">
                        {item.count} Transaksi
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-gray-900 block">
                        {formatRupiah(item.total)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  goToCurrentMonth();
                  setShowPickerModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setShowPickerModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET KONFIRMASI RESET BULAN (Ketik Nama Bulan) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-red-100 text-center animate-slide-up sm:animate-bounce-in">
            {/* Grab handle bar untuk mobile bottom sheet */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
              ⚠️
            </div>

            <h3 className="font-black text-gray-800 text-lg">
              Reset Bulan {selectedMonthName} {selectedYear}
            </h3>

            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tindakan ini akan menghapus <strong>{transactionCount} transaksi</strong> di bulan{' '}
              <strong className="text-gray-800">{selectedMonthName}</strong> senilai{' '}
              <strong className="text-red-500">{formatRupiah(totalExpense)}</strong>.
            </p>

            <div className="bg-red-50 border border-red-100 rounded-xl p-3 my-3 text-left">
              <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
                Ketik nama bulan "<span className="text-red-600 underline">{selectedMonthName}</span>" untuk konfirmasi:
              </label>
              <input
                type="text"
                value={typedMonth}
                onChange={(e) => setTypedMonth(e.target.value)}
                placeholder={`Ketik "${selectedMonthName}"`}
                className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                autoFocus
              />
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setTypedMonth('');
                }}
                disabled={isResetting}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting || !isConfirmationMatched}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                  isConfirmationMatched && !isResetting
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isResetting ? 'Mereset...' : 'Ya, Reset Bulan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SNACKBAR URUNGKAN (UNDO) 10 DETIK */}
      {undoState && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-gray-900/95 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-slide-up border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {undoState.secondsLeft}s
            </div>
            <div>
              <p className="font-bold text-xs text-white">Bulan {undoState.monthName} direset</p>
              <p className="text-[11px] text-gray-300">Data tersimpan sementara ({undoState.backup.length} transaksi)</p>
            </div>
          </div>
          <button
            onClick={handleUndoReset}
            className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex-shrink-0"
          >
            ↩️ Urungkan ({undoState.secondsLeft}s)
          </button>
        </div>
      )}
    </>
  );
}
