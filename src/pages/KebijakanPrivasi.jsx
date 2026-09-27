import { useNavigate } from 'react-router-dom';

export default function KebijakanPrivasi() {
  const navigate = useNavigate();

  return (
    <div className="pb-28">
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] px-4 pt-12 pb-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-all active:scale-95 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Kebijakan Privasi</h1>
            <p className="text-white/60 text-xs mt-0.5">Terakhir Diperbarui: September 2026</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">1. Pengendali Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aplikasi StrukKu dioperasikan dan dikembangkan oleh Muhammad Firzy Islami Fathi, Mahasiswa Universitas Telkom Surabaya. Kami berkomitmen untuk melindungi privasi Anda sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">2. Data yang Dikumpulkan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Untuk menyediakan layanan pencatatan pengeluaran yang optimal, kami mengumpulkan data berikut:
          </p>
          <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li>Alamat email</li>
            <li>Nama lengkap atau panggilan</li>
            <li>Foto profil</li>
            <li>Data transaksi dan riwayat pengeluaran yang Anda catat</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">3. Tujuan Penggunaan Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data Anda kami kumpulkan secara eksklusif untuk tujuan menyediakan, memelihara, dan meningkatkan layanan pelacakan pengeluaran keuangan pada aplikasi StrukKu, serta untuk keamanan akun Anda.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">4. Pemrosesan OCR (Optical Character Recognition)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fitur pemindaian struk melalui teknologi OCR dilakukan secara lokal di perangkat pengguna. Gambar struk yang Anda pindai <span className="font-semibold text-slate-800">TIDAK</span> pernah dikirim, disimpan, atau diproses di server kami. Hal ini menjamin privasi atas detail fisik nota pembelian Anda.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">5. Penyimpanan dan Keamanan Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data pribadi dan transaksi Anda disimpan menggunakan infrastruktur basis data <i>cloud</i> dari Supabase. Kami menerapkan kebijakan keamanan ketat; data hanya dapat diakses oleh Anda sebagai pemilik akun menggunakan kredensial login yang sah.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">6. Berbagi Data dengan Pihak Ketiga</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            StrukKu menggunakan layanan pihak ketiga yang terpercaya untuk menjalankan aplikasi:
          </p>
          <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li><strong>Supabase:</strong> Sebagai penyedia infrastruktur basis data dan autentikasi.</li>
            <li><strong>Vercel:</strong> Sebagai penyedia layanan <i>hosting</i> web.</li>
          </ul>
          <p className="text-xs text-slate-600 leading-relaxed mt-2">
            Kami tidak pernah menjual atau menyewakan data Anda kepada pihak ketiga lainnya untuk tujuan pemasaran.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">7. Hak Pengguna</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sesuai UU PDP No. 27 Tahun 2022, Anda memiliki hak atas data pribadi Anda:
          </p>
          <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li><strong>Hak Akses:</strong> Melihat seluruh data yang tersimpan.</li>
            <li><strong>Hak Koreksi:</strong> Memperbarui data yang tidak akurat.</li>
            <li><strong>Hak Penghapusan:</strong> Meminta penghapusan data secara permanen.</li>
            <li><strong>Hak Menarik Persetujuan:</strong> Membatalkan izin pemrosesan data (akan mengakibatkan penutupan akun).</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">8. Retensi Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data akan disimpan selama akun Anda berstatus aktif. Jika Anda memilih untuk menghapus atau menutup akun, seluruh data pribadi dan riwayat transaksi akan dihapus dari sistem kami secara permanen, kecuali diwajibkan sebaliknya oleh hukum yang berlaku.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">9. Kontak dan Keluhan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Jika Anda memiliki pertanyaan, permintaan akses data, atau keluhan terkait kebijakan privasi ini, Anda dapat menghubungi pengembang melalui formulir masukan yang tersedia di dalam aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
}
