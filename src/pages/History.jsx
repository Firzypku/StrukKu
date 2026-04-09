/**
 * History.jsx — Riwayat pengeluaran + kalender + export Excel
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { formatRupiah, formatDate } from '../utils/prediction';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/ocr';

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

export default function History() {
  const navigate = useNavigate();
  const { expenses, thisMonth, remove, stats } = useExpenses();
  const [view, setView] = useState('list'); // list | calendar
  const [filterCat, setFilterCat] = useState('Semua');
  const [searchQ, setSearchQ] = useState('');
  const [deleting, setDeleting] = useState(null);

  const now = new Date();

  // Kalender
  const calendarDays = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const byDate = {};
    thisMonth.forEach((e) => {
      byDate[e.date] = (byDate[e.date] || 0) + (parseFloat(e.amount) || 0);
    });

    const avg = stats.thisMonthTotal / (Object.keys(byDate).length || 1);

    const cells = [];
    // Padding
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const amount = byDate[dateStr] || 0;
      let status = 'none';
      if (amount > 0) status = amount > avg * 1.3 ? 'high' : 'low';
      cells.push({ day: d, dateStr, amount, status });
    }
    return cells;
  }, [thisMonth, stats.thisMonthTotal, now]);

  // Filter & search
  const categories = ['Semua', ...new Set(expenses.map((e) => e.category).filter(Boolean))];

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = filterCat === 'Semua' || e.category === filterCat;
      const matchSearch =
        !searchQ ||
        e.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
        e.note?.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [expenses, filterCat, searchQ]);

  // Export Excel
  const exportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const data = expenses.map((e) => ({
        Tanggal: e.date,
        Keterangan: e.title,
        Kategori: e.category,
        'Jumlah (Rp)': parseFloat(e.amount) || 0,
        Catatan: e.note || '',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Pengeluaran');
      XLSX.writeFile(wb, `strukku_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h1 className="text-xl font-bold text-white">Riwayat</h1>
          <button
            id="btn-export-excel"
            onClick={exportExcel}
            className="flex items-center gap-1.5 bg-white/20 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all active:scale-95"
          >
            📤 Export
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
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                view === tab.id ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">
                {MONTHS[now.getMonth()]} {now.getFullYear()}
              </h2>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success inline-block" /> Hemat</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-danger inline-block" /> Boros</span>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d) => (
                <div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>
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
                      : 'bg-gray-50 text-gray-500'
                  } ${cell?.day === now.getDate() ? 'ring-2 ring-primary' : ''}`}
                >
                  {cell && (
                    <>
                      <span className="font-bold">{cell.day}</span>
                      {cell.amount > 0 && (
                        <span className="text-[8px] leading-tight mt-0.5">
                          {(cell.amount / 1000).toFixed(0)}K
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm">
              <span className="text-gray-500">Total bulan ini:</span>
              <span className="font-bold text-primary">{formatRupiah(stats.thisMonthTotal)}</span>
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <>
            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                id="input-search"
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Cari pengeluaran..."
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
                <p className="font-bold text-gray-600">Tidak ada data</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQ ? 'Coba kata kunci lain' : 'Mulai catat pengeluaranmu!'}
                </p>
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
                          className="text-gray-300 text-xs hover:text-danger transition-colors"
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
    </div>
  );
}
