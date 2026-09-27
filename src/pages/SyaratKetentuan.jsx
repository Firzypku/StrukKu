import { useNavigate } from 'react-router-dom';

export default function SyaratKetentuan() {
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
            <h1 className="text-xl font-black text-white tracking-tight">Syarat & Ketentuan</h1>
            <p className="text-white/60 text-xs mt-0.5">Terakhir Diperbarui: September 2026</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">1. Sifat Layanan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            StrukKu adalah sebuah aplikasi independen berupa proyek mahasiswa yang dikembangkan secara mandiri. Kami <strong>bukanlah</strong> lembaga keuangan berlisensi, platform perbankan, atau perusahaan layanan finansial resmi.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">2. Ketersediaan Aplikasi</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Layanan StrukKu disediakan secara gratis "apa adanya" (<i>as is</i>). Kami berusaha memberikan layanan terbaik, namun kami tidak memberikan jaminan ketersediaan sistem penuh waktu (24/7) atau bebas dari gangguan (<i>downtime</i>).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">3. Tanggung Jawab Keamanan Akun</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anda sepenuhnya bertanggung jawab atas keamanan kredensial (seperti <i>password</i> atau otentikasi) akun Anda sendiri. StrukKu tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian Anda dalam menjaga kerahasiaan akun.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">4. Akurasi Fitur OCR</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fitur pemindaian otomatis (OCR) memproses gambar secara perangkat lunak untuk mengekstrak teks. Hasil pemindaian struk hanyalah bentuk <strong>perkiraan</strong> yang mungkin mengandung kesalahan. Anda <strong>wajib</strong> untuk selalu memverifikasi ulang, mengecek, dan mengedit data harga atau item jika terdapat ketidakakuratan sebelum menyimpannya.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">5. Kepemilikan Konten dan Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Semua data transaksi, gambar struk (jika disimpan), serta riwayat catatan finansial yang diinput ke dalam aplikasi sepenuhnya merupakan milik Anda sebagai pengguna. Kami tidak mengklaim kepemilikan atas data pribadi Anda.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">6. Penangguhan Akun</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kami memiliki hak dan wewenang penuh untuk membatasi, menangguhkan, atau menghapus akses akun kapan saja apabila ditemukan indikasi penyalahgunaan layanan, aktivitas melanggar hukum, atau pelanggaran terhadap syarat dan ketentuan ini, demi menjaga integritas sistem.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">7. Hukum yang Berlaku</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Syarat dan ketentuan layanan ini tunduk dan ditafsirkan berdasarkan Hukum Negara Kesatuan Republik Indonesia. Setiap perselisihan yang mungkin timbul akan diselesaikan dengan mengacu pada yurisdiksi hukum Indonesia.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">8. Perubahan Syarat & Ketentuan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Syarat dan ketentuan ini dapat diperbarui sewaktu-waktu tanpa pemberitahuan sebelumnya. Setiap perubahan akan diumumkan langsung melalui notifikasi di dalam aplikasi. Penggunaan terus-menerus terhadap aplikasi dianggap sebagai bentuk persetujuan terhadap perubahan tersebut.
          </p>
        </div>
      </div>
    </div>
  );
}
