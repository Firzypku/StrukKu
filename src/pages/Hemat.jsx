/**
 * Hemat.jsx — Tantangan hemat, tips, dan rekomendasi resep
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallenges, updateChallenge } from '../utils/storage';
import { generateMultipleTips, RECIPE_RECOMMENDATIONS, formatRupiah } from '../utils/prediction';
import { useExpenses } from '../hooks/useExpenses';
import { ChallengeProgressBar } from '../components/ProgressBar';
import { TipCard } from '../components/FeatureCard';

export default function Hemat() {
  const navigate = useNavigate();
  const { thisMonth } = useExpenses();
  const [challenges, setChallenges] = useState([]);
  const [tips, setTips] = useState([]);
  const [activeTab, setActiveTab] = useState('tantangan');
  const [showRecipe, setShowRecipe] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      const ch = await getChallenges();
      setChallenges(ch);
    };
    fetchChallenges();
    setTips(generateMultipleTips(thisMonth, 4));
  }, [thisMonth]);

  const handleChallengeProgress = async (challenge) => {
    const newProgress = Math.min(challenge.progress + 1, challenge.target);
    const completed = newProgress >= challenge.target;
    await updateChallenge(challenge.id, { progress: newProgress, completed });
    const updated = await getChallenges();
    setChallenges(updated);
  };

  const resetChallenge = async (id) => {
    await updateChallenge(id, { progress: 0, completed: false });
    const updated = await getChallenges();
    setChallenges(updated);
  };

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-success to-teal-500 px-4 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Tips & Tantangan</h1>
          <div className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-xl">
            🏆 {completedCount}/{challenges.length}
          </div>
        </div>
        <p className="text-white/60 text-sm">Hemat lebih, hidup lebih baik 💚</p>

        {/* Tabs */}
        <div className="mt-4 flex bg-white/15 rounded-2xl p-1 gap-1">
          {[
            { id: 'tantangan', label: '🏆 Tantangan' },
            { id: 'tips', label: '💡 Tips' },
            { id: 'resep', label: '🍳 Resep' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-success shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Tantangan Tab */}
        {activeTab === 'tantangan' && (
          <>
            {completedCount > 0 && (
              <div className="bg-gradient-to-br from-warn to-orange-400 rounded-2xl p-4 text-white text-center animate-bounceIn">
                <p className="text-4xl mb-1">🎉</p>
                <p className="font-black text-lg">{completedCount} Tantangan Selesai!</p>
                <p className="text-white/70 text-sm">{completedCount >= challenges.length ? 'Kamu luar biasa! Semua tantangan selesai!' : 'Terus semangat!'}</p>
              </div>
            )}

            <div className="space-y-3">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className={`bg-white rounded-2xl p-4 shadow-card border transition-all duration-200 ${
                    ch.completed ? 'border-success/30 bg-green-50/50' : 'border-white/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{ch.badge}</span>
                        <h3 className="font-bold text-gray-800 text-sm">{ch.title}</h3>
                        {ch.completed && (
                          <span className="bg-success text-white text-xs font-bold px-2 py-0.5 rounded-full">✓ Done!</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{ch.description}</p>
                    </div>
                  </div>

                  <ChallengeProgressBar
                    current={ch.progress}
                    target={ch.target}
                    unit={ch.unit}
                    badge=""
                  />

                  <div className="flex gap-2 mt-3">
                    {!ch.completed && (
                      <button
                        id={`btn-progress-${ch.id}`}
                        onClick={() => handleChallengeProgress(ch)}
                        className="flex-1 py-2.5 bg-success text-white rounded-xl text-sm font-bold hover:bg-success-dark active:scale-95 transition-all"
                      >
                        + Tambah Progress
                      </button>
                    )}
                    <button
                      id={`btn-reset-${ch.id}`}
                      onClick={() => resetChallenge(ch.id)}
                      className="px-3 py-2.5 bg-gray-50 text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <TipCard key={i} tip={tip.tip} icon={tip.icon} category={tip.category} index={i} />
            ))}

            {/* More tips button */}
            <button
              id="btn-refresh-tips"
              onClick={() => setTips(generateMultipleTips(thisMonth, 4))}
              className="w-full py-3 bg-white border border-gray-100 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-card"
            >
              🔄 Tampilkan Tips Lain
            </button>

            {/* Tips categors */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
              <h3 className="font-bold text-gray-800 mb-3">📌 Tips Wajib Tahu</h3>
              <div className="space-y-3">
                {[
                  { icon: '🍱', text: 'Bawa bekal ke kampus bisa hemat Rp 500.000/bulan' },
                  { icon: '🚇', text: 'Gunakan KRL/MRT untuk hemat transportasi harian' },
                  { icon: '📱', text: 'Gunakan aplikasi cashback saat belanja online' },
                  { icon: '🛒', text: 'Belanja kebutuhan bulanan sekali, bukan per hari' },
                  { icon: '☕', text: 'Buat kopi sendiri daripada beli setiap hari' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resep Tab */}
        {activeTab === 'resep' && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-sm text-success font-medium text-center">
              💚 Masak sendiri = lebih hemat & lebih sehat!
            </div>

            {RECIPE_RECOMMENDATIONS.map((recipe, i) => (
              <div
                key={recipe.name}
                className="bg-white rounded-2xl shadow-card border border-white/60 overflow-hidden"
              >
                {/* Recipe header */}
                <button
                  id={`recipe-${i}`}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-all"
                  onClick={() => setShowRecipe(showRecipe === i ? null : i)}
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{recipe.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-success font-semibold">≈ {formatRupiah(recipe.estimasi)}</span>
                      <span className="text-xs text-gray-400">⏱ {recipe.waktu}</span>
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg">{showRecipe === i ? '▲' : '▼'}</span>
                </button>

                {/* Recipe detail */}
                {showRecipe === i && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Bahan-bahan:</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.bahan.map((b) => (
                        <span key={b} className="bg-green-50 text-success text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <p className="text-xs text-amber-700">
                        💡 Bahan biasanya sudah ada di dapur! Estimasi hemat vs beli jadi: <strong>Rp {formatRupiah(recipe.estimasi * 2 - recipe.estimasi)}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
