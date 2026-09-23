/**
 * Social.jsx — Split Bill "Satu Scan, Semua Tercatat", Cross E-Wallet Reminder, & Peta Hemat Kampus
 */

import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatRupiah } from '../utils/prediction';
import { getLocalDateString } from '../utils/dateHelper';

export default function Social() {
  const { add } = useExpenses();
  const [activeTab, setActiveTab] = useState('itemized'); // 'itemized' | 'quick' | 'campus'

  // ── State Split Bill Itemized ("Satu Scan, Semua Tercatat") ────────────────
  const [placeName, setPlaceName] = useState('Makan Bersama');
  const [friends, setFriends] = useState(['Kamu', 'Budi', 'Siti']);
  const [newFriendName, setNewFriendName] = useState('');

  const [items, setItems] = useState([
    { id: 1, name: 'Ayam Geprek Sambal Bawang', price: 18000, assignedTo: ['Kamu'] },
    { id: 2, name: 'Es Teh Manis Jumbo', price: 5000, assignedTo: ['Kamu'] },
    { id: 3, name: 'Nasi Goreng Spesial', price: 22000, assignedTo: ['Budi'] },
    { id: 4, name: 'Mie Nyemek Telur', price: 17000, assignedTo: ['Siti'] },
    { id: 5, name: 'Gorengan Tempe (Piring Bersama)', price: 12000, assignedTo: ['Kamu', 'Budi', 'Siti'] },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemAssigned, setNewItemAssigned] = useState(['Kamu']);

  const [extraFees, setExtraFees] = useState({ tax: 0, service: 0, discount: 0 });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'DANA / GoPay',
    accountNumber: '0812-3456-7890 (A.n Mahasiswa)',
  });

  const [paidStatus, setPaidStatus] = useState({});
  const [savedPortion, setSavedPortion] = useState(false);

  // ── State Quick Split ──────────────────────────────────────────────────────
  const [quickTotal, setQuickTotal] = useState('');
  const [quickPeople, setQuickPeople] = useState('3');
  const [quickResult, setQuickResult] = useState(null);

  // ── Perhitungan Itemized Split Bill ─────────────────────────────────────────
  const itemizedSummary = useMemo(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const taxAmt = parseFloat(extraFees.tax) || 0;
    const serviceAmt = parseFloat(extraFees.service) || 0;
    const discountAmt = parseFloat(extraFees.discount) || 0;
    const finalTotal = Math.max(0, rawSubtotal + taxAmt + serviceAmt - discountAmt);

    // Rasio penyesuaian biaya tambahan/diskon proporsional
    const feeRatio = rawSubtotal > 0 ? finalTotal / rawSubtotal : 1;

    const breakdown = {};
    friends.forEach((f) => {
      breakdown[f] = {
        name: f,
        items: [],
        rawTotal: 0,
        finalTotal: 0,
      };
    });

    items.forEach((item) => {
      const assigned = item.assignedTo.filter((f) => friends.includes(f));
      if (assigned.length === 0) return;
      const splitPrice = item.price / assigned.length;

      assigned.forEach((person) => {
        if (!breakdown[person]) return;
        breakdown[person].items.push({
          name: item.name,
          portionPrice: splitPrice,
          isShared: assigned.length > 1,
          totalAssigned: assigned.length,
        });
        breakdown[person].rawTotal += splitPrice;
      });
    });

    // Terapkan penyesuaian fee & pembulatan
    Object.keys(breakdown).forEach((person) => {
      breakdown[person].finalTotal = Math.round(breakdown[person].rawTotal * feeRatio);
    });

    return {
      subtotal: rawSubtotal,
      finalTotal,
      breakdown,
      myPortion: breakdown['Kamu']?.finalTotal || 0,
    };
  }, [items, friends, extraFees]);

  // Tambah Teman
  const handleAddFriend = (e) => {
    e.preventDefault();
    const name = newFriendName.trim();
    if (!name || friends.includes(name)) return;
    setFriends([...friends, name]);
    setNewFriendName('');
  };

  // Hapus Teman
  const handleRemoveFriend = (name) => {
    if (name === 'Kamu' || friends.length <= 2) return;
    setFriends(friends.filter((f) => f !== name));
  };

  // Tambah Item
  const handleAddItem = (e) => {
    e.preventDefault();
    const price = parseFloat(newItemPrice) || 0;
    if (!newItemName.trim() || price <= 0 || newItemAssigned.length === 0) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItemName.trim(),
        price,
        assignedTo: [...newItemAssigned],
      },
    ]);
    setNewItemName('');
    setNewItemPrice('');
  };

  // Hapus Item
  const handleRemoveItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Toggle penugasan teman di item baru
  const toggleNewItemAssign = (friend) => {
    if (newItemAssigned.includes(friend)) {
      if (newItemAssigned.length > 1) {
        setNewItemAssigned(newItemAssigned.filter((f) => f !== friend));
      }
    } else {
      setNewItemAssigned([...newItemAssigned, friend]);
    }
  };

  // Toggle status bayar
  const togglePaid = (person) => {
    setPaidStatus((prev) => ({ ...prev, [person]: !prev[person] }));
  };

  // Simpan bagian sendiri ke database StrukKu
  const handleSaveMyPortionToExpenses = async () => {
    const myAmount = itemizedSummary.myPortion;
    if (myAmount <= 0) return;

    try {
      await add({
        title: `Patungan di ${placeName || 'Resto'}`,
        amount: myAmount,
        category: 'Makanan',
        date: getLocalDateString(),
        note: `Split bill bersama ${friends.filter((f) => f !== 'Kamu').join(', ')}`,
      });
      setSavedPortion(true);
      setTimeout(() => setSavedPortion(false), 3000);
    } catch (e) {
      alert('Gagal menyimpan bagian ke pengeluaran: ' + e.message);
    }
  };

  // Share Rincian ke WhatsApp
  const handleShareToWhatsApp = () => {
    let text = `🧾 *TAGIHAN SPLIT BILL — ${placeName.toUpperCase()}*\n`;
    text += `Total Seluruh Tagihan: ${formatRupiah(itemizedSummary.finalTotal)}\n`;
    text += `--------------------------------\n\n`;

    Object.values(itemizedSummary.breakdown).forEach((person) => {
      text += `👤 *${person.name.toUpperCase()}*: *${formatRupiah(person.finalTotal)}*\n`;
      person.items.forEach((it) => {
        text += `   • ${it.name} ${it.isShared ? `(bagi ${it.totalAssigned})` : ''} - ${formatRupiah(it.portionPrice)}\n`;
      });
      text += `\n`;
    });

    text += `--------------------------------\n`;
    text += `💳 *Pembayaran via:*\n${paymentInfo.method}\nNo/Rek: *${paymentInfo.accountNumber}*\n\n`;
    text += `_Dihitung otomatis tanpa pusing pakai StrukKu_ 🧾✨`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Hitung Quick Split dengan pembagian presisi (bebas selisih pembulatan)
  const handleCalculateQuick = () => {
    const total = parseFloat(quickTotal);
    const people = parseInt(quickPeople, 10);
    if (!quickTotal || isNaN(total) || total <= 0) {
      alert('Total tagihan harus berupa angka positif lebih dari 0.');
      return;
    }
    if (isNaN(people) || people <= 0) {
      alert('Jumlah orang minimal 1.');
      return;
    }

    const baseAmount = Math.floor(total / people);
    const remainder = Math.round(total % people);
    const higherAmount = baseAmount + 1;
    const higherCount = remainder;
    const baseCount = people - remainder;

    setQuickResult({
      total,
      people,
      baseAmount,
      higherAmount,
      baseCount,
      higherCount,
      isEven: remainder === 0,
      perPerson: Math.ceil(total / people),
    });
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-primary px-4 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <h1 className="text-xl font-bold text-white mb-1">Sosial & Patungan</h1>
        <p className="text-white/70 text-xs">Satu Scan, Semua Tercatat tanpa ribet e-wallet 🤝</p>

        {/* Tab Selector */}
        <div className="mt-4 flex bg-white/15 rounded-2xl p-1 gap-1">
          {[
            { id: 'itemized', label: '🍕 Split per Item' },
            { id: 'quick', label: '⚡ Bagi Rata' },
            { id: 'campus', label: '📍 Peta Hemat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* TAB 1: SPLIT PER ITEM ("SATU SCAN, SEMUA TERCATAT") */}
        {activeTab === 'itemized' && (
          <>
            {/* Header Acara & Teman */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Tempat / Restoran</label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Misal: Mie Gacoan, Warmindo, Kopi Kenangan"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Daftar Teman Patungan */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">
                  Orang yang Ikut Patungan ({friends.length} orang)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {friends.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100"
                    >
                      {f === 'Kamu' ? '👤 Kamu' : f}
                      {f !== 'Kamu' && (
                        <button
                          onClick={() => handleRemoveFriend(f)}
                          className="hover:text-red-500 font-normal ml-0.5"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddFriend} className="flex gap-1.5">
                  <input
                    type="text"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    placeholder="+ Tambah nama teman..."
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                  >
                    Tambah
                  </button>
                </form>
              </div>
            </div>

            {/* Input Item Pesanan */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
              <h3 className="text-xs font-bold text-gray-700 mb-2">Daftar Menu & Pesanan ({items.length})</h3>

              {/* Form Tambah Item Baru */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama makanan/minuman"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="col-span-2 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block mb-1">Siapa yang memesan ini?</span>
                  <div className="flex flex-wrap gap-1">
                    {friends.map((f) => {
                      const isAssigned = newItemAssigned.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleNewItemAssign(f)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                            isAssigned
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-gray-600 border-gray-200'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                >
                  + Tambahkan Item
                </button>
              </div>

              {/* List Item yang Sudah Masuk */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 border border-gray-100 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-purple-600 font-semibold truncate">
                        Porsi: {item.assignedTo.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{formatRupiah(item.price)}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 font-bold px-1"
                        title="Hapus"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekapitulasi Pembagian per Orang */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Rincian Tagihan per Orang</h3>
                  <p className="text-[11px] text-gray-400">Total: {formatRupiah(itemizedSummary.finalTotal)}</p>
                </div>
                <button
                  onClick={handleShareToWhatsApp}
                  className="px-3 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                >
                  <span>📲 Share WA</span>
                </button>
              </div>

              {/* Kartu per Orang */}
              <div className="space-y-2">
                {Object.values(itemizedSummary.breakdown).map((person) => {
                  const isMe = person.name === 'Kamu';
                  const isPaid = paidStatus[person.name];

                  return (
                    <div
                      key={person.name}
                      className={`p-3 rounded-2xl border transition-all ${
                        isMe
                          ? 'bg-purple-50/80 border-purple-200'
                          : isPaid
                          ? 'bg-green-50/60 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-gray-800">
                            {isMe ? '👤 Kamu (Bagian Sendiri)' : person.name}
                          </span>
                          {!isMe && (
                            <button
                              onClick={() => togglePaid(person.name)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                                isPaid
                                  ? 'bg-green-500 text-white'
                                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              }`}
                            >
                              {isPaid ? '✅ Lunas' : '⏳ Belum Bayar'}
                            </button>
                          )}
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {formatRupiah(person.finalTotal)}
                        </span>
                      </div>

                      {/* Rincian item kecil */}
                      <div className="mt-1 text-[10px] text-gray-500">
                        {person.items.map((it, idx) => (
                          <span key={idx}>
                            {it.name} ({formatRupiah(it.portionPrice)})
                            {idx < person.items.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>

                      {/* Tindakan Khusus untuk "Kamu" */}
                      {isMe && (
                        <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-purple-700 font-semibold">
                            {savedPortion ? '✅ Sudah masuk pengeluaran!' : 'Otomatis catat porsi ini ke akunmu:'}
                          </span>
                          <button
                            onClick={handleSaveMyPortionToExpenses}
                            disabled={savedPortion || person.finalTotal <= 0}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                              savedPortion
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            {savedPortion ? 'Tersimpan' : '💾 Catat Bagianku'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Setting Rekening / E-Wallet Pembayaran */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block mb-1">
                  Info Rekening/E-Wallet Tujuan (Untuk ditagihkan):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nama E-Wallet / Bank"
                    value={paymentInfo.method}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
                    className="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 font-bold"
                  />
                  <input
                    type="text"
                    placeholder="No. Rekening / No. HP"
                    value={paymentInfo.accountNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                    className="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 font-bold"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BAGI RATA CEPAT */}
        {activeTab === 'quick' && (
          <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60 space-y-4">
            <h2 className="font-bold text-gray-800 text-sm">Bagi Rata Cepat (Quick Split)</h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Total Tagihan (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={quickTotal}
                  onChange={(e) => {
                    setQuickTotal(e.target.value);
                    setQuickResult(null);
                  }}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Jumlah Orang</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setQuickPeople(n.toString());
                      setQuickResult(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      parseInt(quickPeople, 10) === n
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {n} org
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculateQuick}
              disabled={!quickTotal || parseFloat(quickTotal) <= 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                quickTotal && parseFloat(quickTotal) > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              Hitung Bagi Rata 🧮
            </button>

            {quickResult && (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg animate-bounce-in text-center">
                <p className="text-xs text-white/70">Pembagian Tagihan:</p>
                {quickResult.isEven ? (
                  <>
                    <p className="text-3xl font-black my-1">{formatRupiah(quickResult.perPerson)}</p>
                    <p className="text-[11px] text-white/80">
                      Rata pas: {quickResult.people} orang × {formatRupiah(quickResult.perPerson)}
                    </p>
                  </>
                ) : (
                  <div className="my-2 space-y-1.5 bg-white/10 p-3 rounded-xl border border-white/20 text-left text-xs">
                    <p className="font-extrabold text-center text-sm text-yellow-300">
                      Pembagian Pas ({formatRupiah(quickResult.total)}):
                    </p>
                    <div className="flex justify-between font-bold">
                      <span>• {quickResult.baseCount} orang membayar:</span>
                      <span className="text-white">{formatRupiah(quickResult.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>• {quickResult.higherCount} orang membayar:</span>
                      <span className="text-yellow-200">{formatRupiah(quickResult.higherAmount)}</span>
                    </div>
                    <p className="text-[10px] text-white/70 text-center pt-1 border-t border-white/15">
                      💡 Bebas selisih! Total pas 100% tanpa ada yang menalangi kelebihan receh.
                    </p>
                  </div>
                )}
                <p className="text-[10px] text-white/60 mt-2">
                  Total Tagihan: {formatRupiah(quickResult.total)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PETA HEMAT KAMPUS (BENCHMARK HARGA MAHASISWA) */}
        {activeTab === 'campus' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📍</span>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">Peta Hemat Kampus & Sekitar Kos</h2>
                  <p className="text-xs text-gray-400">Data acuan harga rata-rata mahasiswa Telkom & Surabaya</p>
                </div>
              </div>

              {/* Rata-rata Harga Menu Favorit */}
              <div className="space-y-2 my-4">
                {[
                  { menu: 'Nasi Ayam Geprek + Es Teh', range: 'Rp 12.000 - Rp 16.000', badge: 'Terfavorit 🔥' },
                  { menu: 'Nasi Pecel / Warteg 2 Lauk', range: 'Rp 10.000 - Rp 14.000', badge: 'Paling Hemat 🥗' },
                  { menu: 'Kopi Susu Gula Aren', range: 'Rp 12.000 - Rp 18.000', badge: 'Tempat Nugas ☕' },
                  { menu: 'Laundry Kiloan', range: 'Rp 6.000 - Rp 8.000 / kg', badge: 'Kebutuhan Kos 👕' },
                ].map((item) => (
                  <div key={item.menu} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-800 block">{item.menu}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{item.badge}</span>
                    </div>
                    <span className="font-extrabold text-primary">{item.range}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
                💡 <strong>Data Komparasi Mahasiswa:</strong> Mahasiswa kos di area kampus rata-rata menghabiskan{' '}
                <strong>Rp 35.000 - Rp 45.000/hari</strong> untuk makan. Menggunakan fitur <em>Satu Scan, Semua Tercatat</em> membantu kamu terhindar dari menalangi teman yang lupa bayar!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
