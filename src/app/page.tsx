import Link from 'next/link'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function HomePage() {
  return (
    <div className="text-text-main">
      {/* Notebook Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none grid-notebook"></div>

      <div className="relative z-10 min-h-screen flex flex-col pb-20 lg:pb-0">

        {/* ─── HEADER ─── */}
        <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
            {/* Mobile: hamburger */}
            <button className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors lg:hidden">
              <MaterialIcon name="menu" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm">
                <span className="text-primary font-[var(--font-brand)] text-lg font-bold">L</span>
              </div>
              <h1 className="text-xl font-[var(--font-brand)] font-bold tracking-tight">LongTalkDoo</h1>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link href="#" className="text-white/90 hover:text-white transition-colors border-b-2 border-white pb-0.5">Home</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Courses</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Store</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">About</Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <MaterialIcon name="search" />
              </button>
              <div className="hidden lg:flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <MaterialIcon name="notifications" />
                </button>
                <Link href="#" className="bg-white text-primary text-sm font-bold px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ─── PROMO BANNER ─── */}
        <div className="bg-secondary text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1 rounded-lg">
                <MaterialIcon name="local_offer" className="text-lg" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-[9px] sm:text-xs font-bold opacity-90 uppercase tracking-tighter">New User Promo</span>
                <span className="text-sm font-semibold">Claim your ฿300 discount</span>
              </div>
            </div>
            <button className="bg-white text-secondary text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform uppercase tracking-wider flex-shrink-0">
              Claim Now
            </button>
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex-1">

          {/* Hero Section */}
          <section className="mt-6 lg:mt-10">
            <div className="relative bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-5 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:gap-12">
              {/* Background Icon */}
              <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none">
                <MaterialIcon name="school" className="text-[10rem] lg:text-[16rem] text-primary translate-x-10 -translate-y-5 rotate-12" />
              </div>

              <div className="relative z-10 space-y-2 lg:space-y-4 lg:flex-1">
                <span className="inline-block px-2 py-0.5 lg:px-3 lg:py-1 bg-primary/10 text-primary text-[10px] lg:text-xs font-bold tracking-wider uppercase rounded">English Mastery</span>
                <h2 className="text-2xl lg:text-5xl font-bold leading-tight text-gray-900">
                  Speak English <br />
                  <span className="text-primary font-[var(--font-brand)]">with Confidence</span>
                </h2>
                <p className="text-xs lg:text-base text-text-sub max-w-[70%] lg:max-w-md leading-relaxed">
                  Interactive lessons designed for fast learning and real conversations.
                </p>
                <button className="relative z-10 bg-primary hover:bg-primary-dark text-white text-sm lg:text-base font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 group mt-2">
                  Start Learning
                  <MaterialIcon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Teacher Image — right on mobile, explicit column on desktop */}
              <div className="absolute right-4 bottom-4 w-28 h-28 pointer-events-none lg:relative lg:right-auto lg:bottom-auto lg:w-64 lg:h-64 lg:pointer-events-auto lg:flex-shrink-0">
                <img
                  alt="Friendly Teacher"
                  className="w-full h-full rounded-2xl lg:rounded-3xl border-4 border-white shadow-lg object-cover rotate-3 lg:rotate-2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABmS--0GoyxlgEznAKPDaJZk2R9As-AZTPsBbbBrYT-3Zc8_66iPMibui9TCfCP9bqFZT1fFwzhLi9DUzhRkalTLTdrCfpqp8rlzLaLyKpLEwZiLLnw8BpotpUCWI-lACPZyvvpCyX82zaB-hI6aNObafCYqxD2zRYKEW-oUIxoETQm79FrTwB5ALLdHr7hjhWNDmZokDUXTd78K6TMT2XcJZyR10i2Btig1LoEl0U87d01PUmOuPKjLo1q4iP56AJhCz9ddhaNsI"
                />
              </div>
            </div>
          </section>

          {/* Top Categories */}
          <section className="mt-8 lg:mt-12">
            <h3 className="text-sm lg:text-base font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              Top Categories
            </h3>
            <div className="flex gap-4 lg:gap-6 overflow-x-auto hide-scrollbar pb-2 lg:overflow-visible lg:flex-wrap">
              <CategoryItem icon="child_care" label="Basic" />
              <CategoryItem icon="forum" label="Dialogue" />
              <CategoryItem icon="business_center" label="Business" />
              <CategoryItem icon="flight_takeoff" label="Travel" />
              <CategoryItem icon="headphones" label="Listening" desktopOnly />
              <CategoryItem icon="edit_note" label="Writing" desktopOnly />
              <CategoryItem icon="record_voice_over" label="Speaking" desktopOnly />
              <CategoryItem icon="more_horiz" label="All" isDefault />
            </div>
          </section>

          {/* Featured Courses */}
          <section className="mt-8 lg:mt-12 mb-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 text-gray-900">
                <MaterialIcon name="local_fire_department" className="text-secondary fill-1" />
                Featured Courses
              </h3>
              <Link href="#" className="text-xs lg:text-sm text-primary font-bold hover:underline">VIEW ALL</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              <CourseCard
                title="English Grammar: Zero to Hero"
                instructor="Kru Whan"
                originalPrice="฿3,500"
                salePrice="฿1,590"
                badge="HOT"
                badgeColor="bg-secondary"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuC38u1UZ08eLkeCvTNCFAE9mXmmnwVvrXrRc8_B3jLbT9ZX8nsp2Svkp53koZzBGXp8Uz9y_hCth3qogfg3FqTSZEeNh5dIZhQglOpWvUW48p-wAaRx-_FZPxbAzCis3NKauNq0B2pXgSuRb0CSsrdJyOuZBGM8sBrRhwlLGgf0pScLj_9EeWUPcACigcI5a9QxwmbiQOWaPICsq61bOSw5-Bbol01joCt5004jtl4UuQnGg1E18gXm1az0HwVWcHBAX-S7huEPPyk"
                instructorImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDqCHlRepjMzRkHzYKbz1mYezVVfR_Vd4q1AFpxYyeNFuIDQX-ZNi0XVVVAeEYIGs5wsApjbC0z3Wf1voN_-xO5e9PWii8w5qquLynki0tK0HjJWJjK5r4NXwRRp8H6rqzcmQjxzqXmwmwaPHkCxva2UAvg4JasAJc-TUVVm52N_aJInqWhglmLwzXB1ld6LaCkTTCst9Gi4s2mAylmAoJJ_2Xtj53kd2A_dsHsdBQp1yly5ynLVwUmeF78vAp7tlq1-Wz98mt2sZ8"
              />
              <CourseCard
                title="Business English Pro"
                instructor="Ajarn Ping"
                originalPrice="฿4,900"
                salePrice="฿2,990"
                badge="TOP SELLER"
                badgeColor="bg-primary"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuD_3zbBR7pzCTQfK7DRb4C689sVjsICHDEyM5iB8G91rT4W8wqdwgDxlaqGMNN7BxRNaYVm2PcpIfWryFPF-xjfbbmD3vmVwcAUihPDKsm0PROh-IjYnCKWlYN4jc9ci2_cY6F5qoYBFAgTcT-6jINo7_MnS2XE8xirppVUenqQ1o61lQmlJ-Ukrh0z_YHh1LFvgUb85YRwUz_knOMf2WbuSrY6W2WNcJsAycqZOpDFtU_jkAJJVTuOYh5zz9uwqegP5dqATzMdpuU"
                instructorImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9c0hEI8aiZZKTFOy7m54FnN5v-823OjTJrqVPU-HvGUqvlLEYKHr5ED-IWd8IlIwtVtaBlqkTqhIJZCfpXCE0Jocw0sB2FvgcwY1xAcD9Ukz068Ez1zyId8jrHaceAaYjqk3VCV0hMiHJKijOYtjUwdujVqrVHAGYiDxtyiGfP0wYf7BqaNAi-e5xZ7nhj0ksvzl8SlmhFZQswFdcvBWAyG1mPDAdVwt4FuFYdaQMcl9A7KRcErjNxU0ndIGxLvmv6UA_A0v6MZw"
              />
              <CourseCard
                title="Daily Slang & Expressions"
                instructor="Teacher Sarah"
                originalPrice="฿1,200"
                salePrice="฿890"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAaqmpaHXXLrp2O6b-DMtRV5RMkPDO7oOCX1Yf_AuohHc8Ku3y8b18roeCs-eYjw6zAQI4Co_oFyK25n4n3SvGv-Kzm7iulkb2phcrIb5JMeGHmiFaT1G2Kj2_wwb_hdQz1NOCAJX0OvQWqNjAf4-zVq7CluhUWTEpmNYYkWYunAB7A5szsm9eKZSwLz9XoG-f2axciHE9DRnh6xVf2BIMm4v7b_sBYdkX46fQKYeolzamPOWO_RKNhnxRJ0H00yYz8hz5RE0xLf70"
                instructorImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCmiz6V_5FDAViXbpgviHhH7Xi5ICOzyWqHXqqnPphm2vZAdhyovVjLpLZQqrsNsx8w3Orwhs0V4z4lGAfYVYHJzUZ18ttvK7Jx3hPevcVIISLvUTgTSxXuLbUIKP8S7gDxSvYVNkJOGNgcoPBKa7ztXlg3xpv3x9Qb5GqHz6yPzFdi_LJB6FIunHOVsIdYPStORbfTijeUw08KmLgzUrbZDaN1_e0b0x7kiRXmbcKirzseL0C2t98hXVQXgMj0K3of4013aVNOW1w"
              />
              <CourseCard
                title="TOEIC Prep Intensive"
                instructor="Kru Bird"
                originalPrice="฿5,000"
                salePrice="฿3,990"
                badge="NEW"
                badgeColor="bg-secondary"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDTUphizz0cVxSa3WTsCkpdVXMtozQSdrBLcVsvwRnOJ9EuKuLfwNUiJhxq0maB7ysiv2pdlDm_H8lzl-UObf_YkMFIFApDm0BBHHu1LNP4LvL32oDiW-2F321OGE8286E-ASt1p_E9kHh2KLyS6hvQC5W_5AUhYBnrGU6cEnHVdOfUnKrqcaW2s3n3Z25NNhE4Nmfl8QIb4VDVg0nW2IdZgS6BkkW1FmYfeeix_xCKs9lKl3QwW5FsN1e8-pdU-buFwMqFDICRWN4"
                instructorImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBz-mZwDIRtL0JV3GYkQ-fS8HfaoBb45MZQKmhUUWAsCT3dS5KCi7PUTnJc6XlN8S3DA_9loQkjsCc0eYIm9P4LQYUjstiQEsJ76sLXGiXK1hZgd0k2cLg066VjDXw0KbjWKuJhhG1G6ref_SjO52yIeMG4cS_Oe0UzP8wJsiB-P0UAnbUFmGT9SH_qwUMRsluy5atgFb-RJgSXGlw22HPqD-lNyXG7B_-WAajE0l7OxfM5JlOW2AZOy7RNcc2IeR02BVIQnKo6M7M"
              />
            </div>
          </section>

          {/* Premium Pass */}
          <section className="mb-8 lg:mb-12">
            <div className="bg-primary rounded-2xl lg:rounded-3xl p-6 lg:p-10 flex items-center justify-between text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 p-4 opacity-10">
                <MaterialIcon name="workspace_premium" className="text-9xl lg:text-[12rem]" />
              </div>
              <div className="relative z-10 flex flex-col gap-1 lg:gap-2">
                <span className="text-[10px] lg:text-xs opacity-80 uppercase tracking-[0.2em] font-black">All Access</span>
                <h4 className="text-xl lg:text-3xl font-bold">Premium Pass</h4>
                <p className="text-xs lg:text-sm opacity-90 mb-4 max-w-[180px] lg:max-w-sm">Learn everything on LongTalkDoo for 1 year. Unlimited courses, quizzes, and certificates.</p>
                <button className="bg-white text-primary text-xs lg:text-sm font-bold py-2.5 lg:py-3 px-6 lg:px-8 rounded-full w-fit hover:bg-gray-50 transition-colors shadow-lg active:scale-95">
                  Buy Now
                </button>
              </div>
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <MaterialIcon name="diamond" className="text-4xl lg:text-6xl text-white" />
              </div>
            </div>
          </section>

        </div>

        {/* ─── FOOTER (desktop only) ─── */}
        <footer className="hidden lg:block bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm">
                    <span className="text-white font-[var(--font-brand)] text-lg font-bold">L</span>
                  </div>
                  <span className="text-lg font-[var(--font-brand)] font-bold text-text-main">LongTalkDoo</span>
                </div>
                <p className="text-sm text-text-sub leading-relaxed">Interactive English lessons designed for fast learning and real conversations.</p>
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-main mb-3">Courses</h5>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li><Link href="#" className="hover:text-primary transition-colors">Basic English</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Business English</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">TOEIC Prep</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Daily Slang</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-main mb-3">Company</h5>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-main mb-3">Support</h5>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-text-sub">
              © 2026 LongTalkDoo. All rights reserved.
            </div>
          </div>
        </footer>

        {/* ─── BOTTOM NAV (mobile only) ─── */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-10px_25px_rgba(0,0,0,0.05)] lg:hidden">
          <NavItem icon="home" label="Home" active />
          <NavItem icon="menu_book" label="My Class" />
          <NavItem icon="shopping_bag" label="Store" />
          <NavItem icon="person" label="Profile" />
        </nav>
      </div>
    </div>
  )
}

function CategoryItem({ icon, label, isDefault = false, desktopOnly = false }: { icon: string; label: string; isDefault?: boolean; desktopOnly?: boolean }) {
  return (
    <Link href="#" className={`flex-shrink-0 flex flex-col items-center gap-2 ${desktopOnly ? 'hidden lg:flex' : ''}`}>
      <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center shadow-sm transition-all hover:scale-105 hover:shadow-md ${isDefault ? 'bg-slate-50 text-text-sub border border-gray-100 hover:border-gray-200' : 'bg-blue-50 text-primary border border-blue-100/50 hover:border-primary/30 hover:bg-blue-100/50'}`}>
        <MaterialIcon name={icon} className="text-3xl lg:text-4xl" />
      </div>
      <span className="text-xs lg:text-sm font-semibold text-text-sub">{label}</span>
    </Link>
  )
}

function CourseCard({
  title, instructor, originalPrice, salePrice, badge, badgeColor, image, instructorImage
}: {
  title: string; instructor: string; originalPrice: string; salePrice: string;
  badge?: string; badgeColor?: string; image: string; instructorImage: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={image} />
        {badge && (
          <div className={`absolute top-2 left-2 ${badgeColor} text-white text-[9px] lg:text-[10px] font-black px-2 py-0.5 rounded shadow-sm`}>
            {badge}
          </div>
        )}
      </div>
      <div className="p-3 lg:p-4 flex flex-col flex-grow">
        <h4 className="text-xs lg:text-sm font-bold line-clamp-2 mb-2 text-gray-900 leading-tight h-8 lg:h-10 group-hover:text-primary transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full overflow-hidden">
            <img alt={instructor} className="w-full h-full object-cover" src={instructorImage} />
          </div>
          <span className="text-[9px] lg:text-xs text-gray-500 font-medium">{instructor}</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-[10px] lg:text-xs text-gray-400 line-through">{originalPrice}</span>
          <span className="text-sm lg:text-base font-black text-secondary">{salePrice}</span>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <Link href="#" className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
      <MaterialIcon name={icon} className={active ? 'fill-1' : ''} />
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </Link>
  )
}
