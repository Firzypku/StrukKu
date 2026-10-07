/**
 * History.jsx — Riwayat pengeluaran + kalender dinamis + navigasi bulan lampau +
 * bottom sheet detail transaksi (Edit & Hapus dengan fitur Urungkan 5 detik) + export Excel
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  List,
  Calendar,
  Search,
  Inbox,
  Camera,
  Sparkles,
  Loader2,
  Trash2,
  Edit3,
  ChevronRight,
  FolderArchive,
} from 'lucide-react';
import { useExpenses, MONTH_NAMES } from '../hooks/useExpenses';
import { formatRupiah, formatDate } from '../utils/prediction';
import { CATEGORY_COLORS } from '../utils/ocr';
import MonthSelector from '../components/MonthSelector';
import CategoryIcon from '../components/CategoryIcon';
import { todayLocal } from '../utils/date';
import { useToast } from '../context/ToastContext';
import { validateAmount, MAX_AMOUNT, sanitizeNumericInput } from '../utils/validation';

export default function History() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    expenses,
    thisMonth,
    remove,
    update,
    add,
    stats,
    selectedYear,
    selectedMonth,
    selectedMonthName,
    isCurrentMonth,
    availableMonths,
    loading,
    loadSamples,
    prevMonth,
    nextMonth,
    setMonthYear,
    goToCurrentMonth,
    resetSelectedMonth,
    undoResetMonth,
  } = useExpenses();

  const [loadingSamples, setLoadingSamples] = useState(false);

  const [view, setView] = useState('list'); // list | calendar
  const [timeScope, setTimeScope] = useState('month'); // 'month' (bulan terpilih) | 'all' (semua riwayat)
  const [filterCat, setFilterCat] = useState('Semua');
  const [searchQ, setSearchQ] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // ── State Detail Bottom Sheet & Edit ──────────────────────────────────────
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    category: 'Makanan',
    date: todayLocal(),
    note: '',
  });

  // ── State Undo Hapus (5 Detik) ─────────────────────────────────────────────
  const [undoItem, setUndoItem] = useState(null); // { expense, secondsLeft }
  const undoTimerRef = useRef(null);

  // Bersihkan timer saat unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    };
  }, []);

  // Sumber data berdasarkan timeScope
  const activeExpenses = timeScope === 'month' ? thisMonth : expenses;

  // Kalender dinamis mengikuti bulan & tahun yang dipilih
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    const byDate = {};
    thisMonth.forEach((e) => {
      const dateKey = typeof e.date === 'string' ? e.date.split('T')[0] : e.date;
      if (dateKey) {
        byDate[dateKey] = (byDate[dateKey] || 0) + (parseFloat(e.amount) || 0);
      }
    });

    const activeDaysCount = Object.keys(byDate).length || 1;
    const avg = stats.thisMonthTotal / activeDaysCount;

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);

    const today = new Date();
    const isTodayInThisMonth =
      today.getFullYear() === selectedYear && today.getMonth() === selectedMonth;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const amount = byDate[dateStr] || 0;
      let status = 'none';
      if (amount > 0) status = amount > avg * 1.3 ? 'high' : 'low';
      cells.push({
        day: d,
        dateStr,
        amount,
        status,
        isToday: isTodayInThisMonth && today.getDate() === d,
      });
    }
    return cells;
  }, [thisMonth, stats.thisMonthTotal, selectedYear, selectedMonth]);

  // Kategori unik
  const categories = ['Semua', ...new Set(activeExpenses.map((e) => e.category).filter(Boolean))];

  // Data filter & search
  const filtered = useMemo(() => {
    return activeExpenses.filter((e) => {
      const matchCat = filterCat === 'Semua' || e.category === filterCat;
      const matchSearch =
        !searchQ ||
        e.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
        e.note?.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeExpenses, filterCat, searchQ]);

  // Grouping per tanggal untuk tampilan list
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const rawDate = e.date || 'Lainnya';
      const d = typeof rawDate === 'string' ? rawDate.split('T')[0] : rawDate;
      if (!map[d]) map[d] = [];
      map[d].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  // Buka detail bottom sheet
  const handleOpenDetail = (expense) => {
    setSelectedExpense(expense);
    setIsEditing(false);
    setEditForm({
      title: expense.title || '',
      amount: expense.amount ? expense.amount.toString() : '',
      category: expense.category || 'Makanan',
      date: expense.date || todayLocal(),
      note: expense.note || '',
    });
  };

  // Simpan perubahan edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedExpense) return;

    const amountVal = validateAmount(editForm.amount, {
      fieldName: 'Nominal belanja',
      min: 1,
      max: MAX_AMOUNT,
      required: true,
    });
    if (!amountVal.valid) {
      toast.error(amountVal.error);
      return;
    }
    const numAmount = amountVal.value;

    if (!editForm.title.trim()) {
      toast.error('Keterangan belanja tidak boleh kosong');
      return;
    }

    try {
      await update(selectedExpense.id, {
        title: editForm.title.trim(),
        amount: numAmount,
        category: editForm.category,
        date: editForm.date,
        note: editForm.note.trim() || null,
      });
      setSelectedExpense((prev) => ({
        ...prev,
        title: editForm.title.trim(),
        amount: numAmount,
        category: editForm.category,
        date: editForm.date,
        note: editForm.note.trim() || null,
      }));
      setIsEditing(false);
      toast.success('Transaksi berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal memperbarui transaksi: ' + err.message);
    }
  };

  // Hapus transaksi dengan fitur Urungkan 5 detik
  const handleDeleteWithUndo = (expenseToDelete) => {
    if (!expenseToDelete) return;

    // Tutup bottom sheet
    setSelectedExpense(null);
    setIsEditing(false);

    // Hapus dari data
    remove(expenseToDelete.id);

    // Bersihkan timer lama jika ada
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
    }

    let countdown = 5;
    setUndoItem({
      expense: expenseToDelete,
      secondsLeft: countdown,
    });

    const timer = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(timer);
        setUndoItem(null);
      } else {
        setUndoItem((prev) => (prev ? { ...prev, secondsLeft: countdown } : null));
      }
    }, 1000);

    undoTimerRef.current = timer;
  };

  // Eksekusi Urungkan (Undo)
  const handleUndo = async () => {
    if (!undoItem?.expense) return;
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
    }
    const restored = undoItem.expense;
    setUndoItem(null);

    try {
      await add({
        title: restored.title,
        amount: restored.amount,
        category: restored.category,
        date: restored.date,
        note: restored.note || null,
        image: restored.image || null,
      });
      toast.success(`Transaksi "${restored.title}" berhasil dipulihkan!`);
    } catch (e) {
      toast.error('Gagal memulihkan transaksi');
    }
  };

  // Muat data contoh mahasiswa
  const handleLoadSamples = async () => {
    setLoadingSamples(true);
    try {
      await loadSamples();
      toast.success('5 transaksi contoh mahasiswa berhasil dimuat.');
    } catch (err) {
      toast.error('Gagal memuat transaksi contoh: ' + err.message);
    } finally {
      setLoadingSamples(false);
    }
  };

  // Export Excel
  const handleExportExcel = async (exportScope = 'month') => {
    try {
      const XLSX = await import('xlsx');
      const dataToExport = exportScope === 'month' ? thisMonth : expenses;

      if (!dataToExport || dataToExport.length === 0) {
        toast.warning('Tidak ada data pengeluaran untuk diekspor.');
        return;
      }

      const data = dataToExport.map((e) => ({
        Tanggal: e.date,
        Keterangan: e.title,
        Kategori: e.category,
        'Jumlah (Rp)': parseFloat(e.amount) || 0,
        Catatan: e.note || '',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = [
        { wch: 14 },
        { wch: 28 },
        { wch: 16 },
        { wch: 18 },
        { wch: 32 },
      ];

      const wb = XLSX.utils.book_new();
      const sheetName = exportScope === 'month' ? `${selectedMonthName}` : 'Semua';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const fileName =
        exportScope === 'month'
          ? `Riwayat_StrukKu_${selectedMonthName}_${selectedYear}.xlsx`
          : `Riwayat_StrukKu_Semua_${todayLocal()}.xlsx`;

      XLSX.writeFile(wb, fileName);
      setShowExportModal(false);
      toast.success('File Excel berhasil diunduh!');
    } catch (err) {
      toast.error('Gagal export Excel: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#059669] px-4 pt-12 pb-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Riwayat Belanja</h1>
              <p className="text-emerald-100 text-xs">
                {timeScope === 'month' ? `${selectedMonthName} ${selectedYear}` : 'Semua Transaksi'} · {filtered.length} transaksi
              </p>
            </div>

            {/* Ekspor Excel */}
            <button
              id="btn-export-excel"
              onClick={() => setShowExportModal(true)}
              className="bg-white/15 text-white hover:bg-white/25 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 shadow-sm"
              title="Ekspor ke spreadsheet Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>

          {/* Month Selector Carousel */}
          <MonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedMonthName={selectedMonthName}
            isCurrentMonth={isCurrentMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            setMonthYear={setMonthYear}
            goToCurrentMonth={goToCurrentMonth}
            availableMonths={availableMonths}
            totalExpense={stats.thisMonthTotal}
            transactionCount={thisMonth.length}
            onResetMonth={resetSelectedMonth}
            onUndoResetMonth={undoResetMonth}
            showResetButton={false}
          />

          {/* View Toggle */}
          <div className="mt-4 flex bg-white/15 rounded-2xl p-1 gap-1">
            <button
              id="btn-view-list"
              onClick={() => setView('list')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                view === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
            <button
              id="btn-view-calendar"
              onClick={() => setView('calendar')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                view === 'calendar' ? 'bg-white text-emerald-800 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-sm">
                Kalender Belanja {selectedMonthName} {selectedYear}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Wajar
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Boros
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 font-semibold mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all duration-200 ${
                    !cell
                      ? ''
                      : cell.status === 'high'
                      ? 'bg-red-100 text-danger font-bold border border-red-200'
                      : cell.status === 'low'
                      ? 'bg-green-100 text-success font-bold border border-green-200'
                      : 'bg-gray-50 text-gray-600'
                  } ${cell?.isToday ? 'ring-2 ring-primary font-black shadow-sm' : ''}`}
                >
                  {cell && (
                    <>
                      <span className="text-[11px] leading-tight">{cell.day}</span>
                      {cell.amount > 0 && (
                        <span className="text-[8px] leading-tight mt-0.5 font-bold">
                          {(cell.amount / 1000).toFixed(0)}K
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Total {selectedMonthName}:</span>
              <span className="font-extrabold text-primary text-sm">{formatRupiah(stats.thisMonthTotal)}</span>
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <>
            {/* Scope Filter */}
            <div className="flex bg-gray-100/80 p-1 rounded-xl text-xs font-bold gap-1">
              <button
                onClick={() => setTimeScope('month')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  timeScope === 'month'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bulan {selectedMonthName} ({thisMonth.length})
              </button>
              <button
                onClick={() => setTimeScope('all')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  timeScope === 'all'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Semua Waktu ({expenses.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                id="input-search"
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder={`Cari transaksi ${timeScope === 'month' ? selectedMonthName : 'semua'}...`}
                className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-card"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setFilterCat(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95 inline-flex items-center gap-1.5 ${
                    filterCat === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
                  }`}
                >
                  {cat !== 'Semua' && <CategoryIcon category={cat} className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Expense List */}
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 shadow-card border border-white/60 flex items-center gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-white/60">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-7 h-7" />
                </div>
                <p className="font-bold text-gray-700 text-sm">
                  {searchQ
                    ? 'Tidak ada transaksi yang cocok'
                    : timeScope === 'month'
                    ? `Belum ada pengeluaran di ${selectedMonthName} ${selectedYear}`
                    : 'Belum ada riwayat pengeluaran'}
                </p>
                <p className="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto">
                  {searchQ
                    ? 'Coba gunakan kata kunci lain'
                    : 'Mulai scan struk belanjamu atau muat data contoh untuk mencoba seluruh fitur!'}
                </p>

                <div className="mt-5 flex flex-col gap-2.5 max-w-xs mx-auto">
                  <button
                    onClick={() => navigate('/scan')}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs hover:bg-primary-dark active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Catat Pengeluaran Pertama</span>
                  </button>

                  <button
                    onClick={handleLoadSamples}
                    disabled={loadingSamples}
                    className="w-full bg-amber-50 text-amber-800 border border-amber-200 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {loadingSamples ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-600" />}
                    <span>{loadingSamples ? 'Memuat Contoh...' : 'Muat 5 Transaksi Contoh Mahasiswa'}</span>
                  </button>

                  {!isCurrentMonth && (
                    <button
                      onClick={goToCurrentMonth}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-bold text-xs hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      Kembali ke Bulan Sekarang
                    </button>
                  )}
                </div>
              </div>
            ) : (
              grouped.map(([date, items]) => (
                <div key={date} className="space-y-2">
                  {/* Date header */}
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      {formatDate(date)}
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {formatRupiah(items.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0))}
                    </p>
                  </div>

                  {/* Items — Ketuk baris untuk membuka Detail Bottom Sheet */}
                  {items.map((expense) => (
                    <div
                      key={expense.id}
                      onClick={() => handleOpenDetail(expense)}
                      className="bg-white rounded-2xl p-4 shadow-card border border-white/60 flex items-center gap-3 transition-all duration-200 hover:border-blue-200 active:scale-[0.99] cursor-pointer group"
                    >
                      {/* Category icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${CATEGORY_COLORS[expense.category] || '#C8D6E5'}20` }}
                      >
                        <CategoryIcon category={expense.category} className="w-5 h-5 text-slate-700" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {expense.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {expense.category}
                          {expense.note && ` · ${expense.note}`}
                        </p>
                      </div>

                      {/* Amount + detail indicator */}
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 text-sm">
                          {formatRupiah(parseFloat(expense.amount))}
                        </p>
                        <span className="text-gray-300 text-xs group-hover:text-blue-600 transition-colors">
                          ›
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Floating Undo Notification (5 Detik) */}
      {undoItem && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 animate-slide-up">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <Trash2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs truncate">
              <strong>"{undoItem.expense.title}"</strong> dihapus
            </p>
          </div>
          <button
            onClick={handleUndo}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm whitespace-nowrap transition-all flex items-center gap-1.5"
          >
            <span>Urungkan</span>
            <span className="bg-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {undoItem.secondsLeft}d
            </span>
          </button>
        </div>
      )}

      {/* Bottom Sheet Detail Transaksi (Edit & Hapus) */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-slide-up max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Drag Handle on Mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            {!isEditing ? (
              // ── VIEW DETAIL MODE ──────────────────────────────────────────
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${CATEGORY_COLORS[selectedExpense.category] || '#C8D6E5'}25` }}
                    >
                      <CategoryIcon category={selectedExpense.category} className="w-6 h-6 text-slate-800" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedExpense.category}
                      </span>
                      <h3 className="font-black text-slate-900 text-base sm:text-lg mt-0.5 leading-snug">
                        {selectedExpense.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
                    aria-label="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">Nominal Belanja</span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatRupiah(parseFloat(selectedExpense.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Tanggal Transaksi</span>
                    <span className="font-bold text-slate-800">{formatDate(selectedExpense.date)}</span>
                  </div>
                  {selectedExpense.note && (
                    <div className="flex justify-between text-xs pt-1.5 border-t border-slate-200/40">
                      <span className="text-slate-500 font-medium">Catatan</span>
                      <span className="font-semibold text-slate-700 max-w-[200px] text-right">{selectedExpense.note}</span>
                    </div>
                  )}
                </div>

                {/* Struk Image if exists */}
                {selectedExpense.image && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Foto Bukti Struk
                    </span>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48 flex items-center justify-center">
                      <img
                        src={selectedExpense.image}
                        alt="Bukti Struk"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons: Edit & Hapus */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-all shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Transaksi</span>
                  </button>
                  <button
                    onClick={() => handleDeleteWithUndo(selectedExpense)}
                    className="py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-bold text-xs flex items-center justify-center gap-1.5 border border-red-200 transition-all shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ) : (
              // ── EDIT TRANSACTION FORM ──────────────────────────────────────
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Edit Transaksi</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Keterangan / Nama Toko
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={MAX_AMOUNT}
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    value={editForm.amount}
                    onChange={(e) => {
                      const clean = sanitizeNumericInput(e.target.value, MAX_AMOUNT);
                      setEditForm({ ...editForm, amount: clean });
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategori</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {['Makanan', 'Minuman', 'Kebutuhan Kos', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Fashion', 'Lainnya'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    value={editForm.note}
                    onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                    placeholder="Misal: bareng teman kos"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Pilihan Ekspor Excel */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div>
                <h3 className="font-extrabold text-gray-800 text-base">Ekspor Laporan Excel</h3>
                <p className="text-xs text-gray-400">Pilih jangkauan data pengeluaran</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              <button
                onClick={() => handleExportExcel('month')}
                className="w-full p-3.5 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 active:scale-95 transition-all text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-primary block">
                    📊 Ekspor Bulan {selectedMonthName} {selectedYear}
                  </span>
                  <span className="text-xs text-gray-400">
                    {thisMonth.length} transaksi · {formatRupiah(stats.thisMonthTotal)}
                  </span>
                </div>
                <span className="text-primary font-bold">→</span>
              </button>

              <button
                onClick={() => handleExportExcel('all')}
                className="w-full p-3.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-gray-800 block">
                    📁 Ekspor Semua Riwayat (Semua Waktu)
                  </span>
                  <span className="text-xs text-gray-400">
                    {expenses.length} transaksi · {formatRupiah(stats.total)}
                  </span>
                </div>
                <span className="text-gray-500 font-bold">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
