/**
 * Social.jsx — Split bill + Leaderboard
 */

import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatRupiah } from '../utils/prediction';
import { LeaderboardRow } from '../components/FeatureCard';

// Dummy leaderboard data
const DUMMY_LEADERBOARD = [
  { rank: 1, name: 'Andi S.', avatar: '🎯', savedAmount: 850000 },
  { rank: 2, name: 'Bunga N.', avatar: '🌸', savedAmount: 720000 },
  { rank: 3, name: 'Candra P.', avatar: '⚡', savedAmount: 650000 },
  { rank: 4, name: 'Dewi R.', avatar: '🌙', savedAmount: 580000 },
  { rank: 5, name: 'Eko W.', avatar: '🔥', savedAmount: 520000 },
  { rank: 6, name: 'Fitri H.', avatar: '🌊', savedAmount: 490000 },
  { rank: 7, name: 'Gilang M.', avatar: '💫', savedAmount: 430000 },
];

export default function Social() {
  const { stats } = useExpenses();
  const [activeTab, setActiveTab] = useState('split');

  // Split bill state
  const [splitTotal, setSplitTotal] = useState('');
  const [splitPeople, setSplitPeople] = useState('2');
  const [splitResult, setSplitResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const calculateSplit = () => {
    const total = parseFloat(splitTotal) || 0;
    const people = parseInt(splitPeople) || 2;
    if (total <= 0 || people <= 0) return;
    const perPerson = Math.ceil(total / people);
    setSplitResult({ total, people, perPerson });
  };

  const shareWhatsApp = () => {
    if (!splitResult) return;
    const text = encodeURIComponent(
      `💰 *Split Bill StrukKu*\n\nTotal: ${formatRupiah(splitResult.total)}\nJumlah orang: ${splitResult.people}\n*Masing-masing: ${formatRupiah(splitResult.perPerson)}*\n\n_Dihitung pakai StrukKu_ 🧾`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyText = () => {
    if (!splitResult) return;
    const text = `Split Bill: Total ${formatRupiah(splitResult.total)}, ${splitResult.people} orang, masing-masing ${formatRupiah(splitResult.perPerson)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // User's rank in leaderboard (based on budget remaining as "saved")
  const userSaved = useMemo(() => {
    // Simulasi: semakin sedikit pengeluaran, semakin hemat
    return Math.max(0, 1000000 - stats.thisMonthTotal);
  }, [stats.thisMonthTotal]);

  const userRank = DUMMY_LEADERBOARD.filter((p) => p.savedAmount > userSaved).length + 1;

  const fullLeaderboard = useMemo(() => {
    const user = {
      rank: userRank,
      name: 'Kamu',
      avatar: '🎓',
      savedAmount: userSaved,
      isUser: true,
    };

    // Insert user ke posisi yang benar
    const combined = [...DUMMY_LEADERBOARD, user].sort((a, b) => b.savedAmount - a.savedAmount);
    return combined.map((item, i) => ({ ...item, rank: i + 1 }));
  }, [userRank, userSaved]);

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-primary px-4 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <h1 className="text-xl font-bold text-white mb-1">Sosial</h1>
        <p className="text-white/60 text-sm">Split bill & kompetisi hemat 🤝</p>

        <div className="mt-4 flex bg-white/15 rounded-2xl p-1 gap-1">
          {[
            { id: 'split', label: '🤝 Split Bill' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`social-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-purple-600 shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Split Bill Tab */}
        {activeTab === 'split' && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <h2 className="font-bold text-gray-800 mb-4">Hitung Split Bill</h2>

              {/* Total */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Total Tagihan (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rp</span>
                  <input
                    id="split-total"
                    type="number"
                    value={splitTotal}
                    onChange={(e) => { setSplitTotal(e.target.value); setSplitResult(null); }}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50"
                  />
                </div>
                {splitTotal && <p className="text-xs text-primary font-semibold mt-1 ml-1">{formatRupiah(parseFloat(splitTotal))}</p>}
              </div>

              {/* Jumlah orang */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Jumlah Orang</label>
                <div className="flex items-center gap-3">
                  <button
                    id="split-minus"
                    onClick={() => { setSplitPeople(p => Math.max(2, parseInt(p) - 1).toString()); setSplitResult(null); }}
                    className="w-11 h-11 bg-gray-100 rounded-xl text-xl font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <input
                    id="split-people"
                    type="number"
                    min="2"
                    value={splitPeople}
                    onChange={(e) => { setSplitPeople(e.target.value); setSplitResult(null); }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50"
                  />
                  <button
                    id="split-plus"
                    onClick={() => { setSplitPeople(p => (parseInt(p) + 1).toString()); setSplitResult(null); }}
                    className="w-11 h-11 bg-primary rounded-xl text-xl font-bold text-white hover:bg-primary-dark active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick people count */}
              <div className="flex gap-2 mb-5">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setSplitPeople(n.toString()); setSplitResult(null); }}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                      parseInt(splitPeople) === n
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                id="btn-hitung-split"
                onClick={calculateSplit}
                disabled={!splitTotal || parseFloat(splitTotal) <= 0}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-95 ${
                  splitTotal && parseFloat(splitTotal) > 0
                    ? 'bg-primary text-white shadow-md hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                🧮 Hitung Split Bill
              </button>
            </div>

            {/* Result */}
            {splitResult && (
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-lg animate-bounce-in">
                <p className="text-white/60 text-sm mb-1">Masing-masing bayar</p>
                <p className="text-4xl font-black mb-1">{formatRupiah(splitResult.perPerson)}</p>
                <p className="text-white/60 text-sm">
                  Total {formatRupiah(splitResult.total)} ÷ {splitResult.people} orang
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    id="btn-share-wa"
                    onClick={shareWhatsApp}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-400 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    📱 Share WhatsApp
                  </button>
                  <button
                    id="btn-copy-split"
                    onClick={copyText}
                    className="flex-1 bg-white/20 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/30 active:scale-95 transition-all"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-primary mb-2">💡 Cara Pakai Split Bill</p>
              <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                <li>Masukkan total tagihan bersama</li>
                <li>Set jumlah orang yang ikut patungan</li>
                <li>Klik Hitung, lalu share ke WhatsApp!</li>
              </ol>
            </div>
          </>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <>
            {/* Top 3 Podium */}
            <div className="bg-gradient-to-br from-warn to-orange-400 rounded-2xl p-4 text-white">
              <p className="text-center font-bold text-sm text-white/80 mb-3">🏆 Hall of Fame — Paling Hemat Bulan Ini</p>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mx-auto mb-1">
                    {fullLeaderboard[1]?.avatar}
                  </div>
                  <div className="bg-white/20 rounded-t-xl px-2 pt-2 pb-1" style={{ height: '50px' }}>
                    <p className="text-xs font-bold">🥈</p>
                  </div>
                  <p className="text-xs font-semibold mt-1 truncate max-w-[60px]">{fullLeaderboard[1]?.name}</p>
                </div>
                {/* 1st */}
                <div className="text-center -mb-2">
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-3xl mx-auto mb-1 border-2 border-white/50">
                    {fullLeaderboard[0]?.avatar}
                  </div>
                  <div className="bg-white/30 rounded-t-xl px-2 pt-2 pb-1" style={{ height: '65px' }}>
                    <p className="text-sm font-bold">🥇</p>
                  </div>
                  <p className="text-xs font-bold mt-1 truncate max-w-[70px]">{fullLeaderboard[0]?.name}</p>
                </div>
                {/* 3rd */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mx-auto mb-1">
                    {fullLeaderboard[2]?.avatar}
                  </div>
                  <div className="bg-white/20 rounded-t-xl px-2 pt-2 pb-1" style={{ height: '40px' }}>
                    <p className="text-xs font-bold">🥉</p>
                  </div>
                  <p className="text-xs font-semibold mt-1 truncate max-w-[60px]">{fullLeaderboard[2]?.name}</p>
                </div>
              </div>
            </div>

            {/* Full leaderboard */}
            <div className="bg-white rounded-2xl shadow-card border border-white/60 overflow-hidden">
              <div className="p-4 border-b border-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-gray-800">Ranking Hemat</h2>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">Ranking #{fullLeaderboard.find(l => l.isUser)?.rank || '?'}</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {fullLeaderboard.map((player) => (
                  <LeaderboardRow
                    key={player.rank}
                    rank={player.rank}
                    name={player.name}
                    avatar={player.avatar}
                    amount={player.savedAmount}
                    isUser={player.isUser}
                  />
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500">
                💡 Ranking berdasarkan estimasi penghematan vs rata-rata mahasiswa.<br/>
                Data anonim — privasi terlindungi.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
