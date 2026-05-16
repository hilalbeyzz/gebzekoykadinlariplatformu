import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#c9b987_0%,transparent_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-background-light mb-6">Biz Kimiz?</h1>
            <p className="text-xl text-foreground-dark/90 max-w-3xl mx-auto leading-relaxed">
              Gebze Köy Kadınları Kültür Platformu, köylerimizde yaşayan kadınların sosyal ve ekonomik hayatta daha aktif rol almalarını sağlamak amacıyla kurulmuş bir dayanışma topluluğudur.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(100,113,42,0.4),rgba(201,185,135,0.6))]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-primary-dark text-2xl font-bold italic text-center px-8">
                   "Kadın elinin değdiği her yer güzelleşir, kadın emeğinin olduğu her iş bereketlenir."
                 </span>
               </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground-light mb-8">Hikayemiz ve Misyonumuz</h2>
              <div className="space-y-6 text-foreground-light/80 text-lg leading-relaxed">
                <p>
                  Yolculuğumuz, Gebze'nin bereketli köylerinde kadınların ürettiği eşsiz değerlerin hak ettiği karşılığı bulamaması ve bu emeğin görünür kılınması ihtiyacıyla başladı.
                </p>
                <p>
                  Geleneksel bilgiyi modern yöntemlerle birleştirerek, ev yapımı gıdalardan el emeği sanatlara kadar her alanda kadınlarımızı destekliyoruz. Eğitimler düzenliyor, pazar alanları oluşturuyor ve birbirimize güç veriyoruz.
                </p>
                <div className="bg-secondary/20 p-6 rounded-2xl border-l-4 border-primary mt-8">
                  <h3 className="font-bold text-primary-dark mb-2">Vizyonumuz</h3>
                  <p className="text-sm italic">
                    Köy kadınlarının ekonomik özgürlüklerini kazandığı, geleneksel kültürün korunduğu ve gelecek nesillere aktarıldığı, sürdürülebilir bir kırsal kalkınma modeli oluşturmak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground-light mb-16">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Dayanışma", desc: "Birbirimizin elinden tutarak, birlikte büyüyoruz.", icon: "🤝" },
              { title: "Ekolojik Üretim", desc: "Doğaya saygılı, temiz ve sağlıklı gıda üretimini savunuyoruz.", icon: "🌿" },
              { title: "Kültürel Miras", desc: "Unutulmaya yüz tutmuş geleneklerimizi yaşatıyoruz.", icon: "🏺" }
            ].map((value, i) => (
              <div key={i} className="p-8 bg-background-light rounded-2xl shadow-sm border border-border-warm hover:scale-105 transition-transform">
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
                <p className="text-foreground-light/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
