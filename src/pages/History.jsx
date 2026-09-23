/**
 * History.jsx — Riwayat pengeluaran + kalender dinamis + navigasi bulan lampau + reset bulan + export Excel
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses, MONTH_NAMES } from '../hooks/useExpenses';
import { formatRupiah, formatDate } from '../utils/prediction';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/ocr';
import MonthSelector from '../components/MonthSelector';

export default function History() {
  const navigate = useNavigate();
  const {
    expenses,
    thisMonth,
    remove,
    stats,
    selectedYear,
    selectedMonth,
    selectedMonthName,
    isCurrentMonth,
    availableMonths,
    prevMonth,
    nextMonth,
    setMonthYear,
    goToCurrentMonth,
    resetSelectedMonth,
  } = useExpenses();

  const [view, setView] = useState('list'); // list | calendar
  const [timeScope, setTimeScope] = useState('month'); // 'month' (bulan terpilih) | 'all' (semua riwayat)
  const [filterCat, setFilterCat] = useState('Semua');
  const [searchQ, setSearchQ] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sumber data berdasarkan timeScope
  const activeExpenses = timeScope === 'month' ? thisMonth : expenses;

  // Kalender dinamis mengikuti bulan & tahun yang dipilih
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    const byDate = {};
    thisMonth.forEach((e) => {
      byDate[e.date] = (byDate[e.date] || 0) + (parseFloat(e.amount) || 0);
    });

    const activeDaysCount = Object.keys(byDate).length || 1;
    const avg = stats.thisMonthTotal / activeDaysCount;

    const cells = [];
    // Padding hari sebelum tanggal 1
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

  // Export Excel
  const handleExportExcel = async (exportScope = 'month') => {
    try {
      const XLSX = await import('xlsx');
      const dataToExport = exportScope === 'month' ? thisMonth : expenses;

      if (!dataToExport || dataToExport.length === 0) {
        alert('Tidak ada data pengeluaran untuk diekspor.');
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

      // Lebar kolom rapi dan tidak saling bertumpuk
      ws['!cols'] = [
        { wch: 14 }, // Tanggal
        { wch: 28 }, // Keterangan
        { wch: 16 }, // Kategori
        { wch: 18 }, // Jumlah (Rp)
        { wch: 32 }, // Catatan
      ];

      const wb = XLSX.utils.book_new();
      const sheetName = exportScope === 'month' ? `${selectedMonthName}` : 'Semua';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const fileName =
        exportScope === 'month'
          ? `Riwayat_StrukKu_${selectedMonthName}_${selectedYear}.xlsx`
          : `Riwayat_StrukKu_Semua_${new Date().toISOString().split('T')[0]}.xlsx`;

      XLSX.writeFile(wb, fileName);
      setShowExportModal(false);
    } catch (err) {
      alert('Gagal export: ' + err.message);
    }
  };

  const handleDelete = (id) => {
    setDeleting(id);
    setTimeout(() => {
      remove(id);
      setDeleting(null);
    }, 300);
  };

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Riwayat Pengeluaran</h1>
            <p className="text-white/60 text-xs mt-0.5">Pantau & jelajahi catatan bulanan</p>
          </div>
          <button
            id="btn-export-excel"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition-all active:scale-95 shadow-sm"
          >
            📤 Export Excel
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/15 rounded-2xl p-1 gap-1">
          {[
            { id: 'list', label: '📋 Daftar' },
            { id: 'calendar', label: '📅 Kalender' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`view-${tab.id}`}
              onClick={() => setView(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                view === tab.id ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Month Selector & Navigation Bar */}
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
          onResetMonth={resetSelectedMonth}
          totalExpense={stats.thisMonthTotal}
          transactionCount={stats.thisMonthCount}
          showResetButton={true}
        />

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-gray-800 text-sm">
                  {selectedMonthName} {selectedYear}
                </h2>
                <p className="text-[11px] text-gray-400">Peta pengeluaran harian</p>
              </div>
              <div className="flex gap-2 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Hemat
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger inline-block" /> Boros
                </span>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <div key={d} className="text-center text-[11px] text-gray-400 font-semibold py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
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

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Total {selectedMonthName}:</span>
              <span className="font-extrabold text-primary text-sm">{formatRupiah(stats.thisMonthTotal)}</span>
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <>
            {/* Scope Filter (Bulan Terpilih vs Semua Waktu) */}
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
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
                  id={`filter-${cat.toLowerCase()}`}
                  onClick={() => setFilterCat(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                    filterCat === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
                  }`}
                >
                  {cat !== 'Semua' && (CATEGORY_ICONS[cat] || '💳')} {cat}
                </button>
              ))}
            </div>

            {/* Expense List */}
            {grouped.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-white/60">
                <span className="text-5xl block mb-3">📭</span>
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
                    : 'Mulai scan struk belanjamu atau catat pengeluaran secara manual!'}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => navigate('/scan')}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
                  >
                    📸 Catat Pengeluaran
                  </button>
                  {!isCurrentMonth && (
                    <button
                      onClick={goToCurrentMonth}
                      className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      Bulan Sekarang
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

                  {/* Items */}
                  {items.map((expense) => (
                    <div
                      key={expense.id}
                      className={`bg-white rounded-2xl p-4 shadow-card border border-white/60 flex items-center gap-3 transition-all duration-300 ${
                        deleting === expense.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      {/* Category icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[expense.category] || '#C8D6E5'}20` }}
                      >
                        {CATEGORY_ICONS[expense.category] || '💳'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{expense.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {expense.category}
                          {expense.note && ` · ${expense.note}`}
                        </p>
                      </div>

                      {/* Amount + delete */}
                      <div className="flex flex-col items-end gap-1">
                        <p className="font-bold text-gray-800 text-sm">
                          {formatRupiah(parseFloat(expense.amount))}
                        </p>
                        <button
                          id={`btn-delete-${expense.id}`}
                          onClick={() => handleDelete(expense.id)}
                          className="text-gray-300 text-xs hover:text-danger transition-colors p-1"
                          title="Hapus transaksi"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>

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
