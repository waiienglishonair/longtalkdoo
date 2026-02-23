import { Baby, MessageSquare, Briefcase, Plane, MoreHorizontal, Flame, ChevronRight, Home, BookOpen, ShoppingBag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen relative overflow-hidden bg-[#121212]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#30e86e] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-[#20c055] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#30e86e]/30 bg-[#1e1e1e]">
            {/* Placeholder avatar */}
            <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] flex items-center justify-center text-white/50">
              <User size={20} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Good Morning,</p>
            <h2 className="text-lg font-bold text-white">Learner!</h2>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>
      </header>

      {/* Hero Banner Section */}
      <section className="px-6 mb-8 z-10 relative">
        <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group hover:border-[#30e86e]/30 transition-all duration-300">
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[#30e86e]/20 rounded-full filter blur-[40px] group-hover:bg-[#30e86e]/40 transition-colors"></div>
          <h1 className="text-3xl font-extrabold text-white mb-3">LongTalkDoo</h1>
          <h2 className="text-xl font-bold text-[#30e86e] mb-2">Speak English with Confidence</h2>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">Interactive lessons designed for fast learning and real conversations.</p>
        </div>
      </section>

      {/* Top Categories */}
      <section className="px-6 mb-8 z-10 relative">
        <h3 className="text-lg font-bold text-white mb-4">Top Categories</h3>
        <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryItem icon={<Baby />} label="Basic" />
          <CategoryItem icon={<MessageSquare />} label="Dialogue" />
          <CategoryItem icon={<Briefcase />} label="Business" />
          <CategoryItem icon={<Plane />} label="Travel" />
          <CategoryItem icon={<MoreHorizontal />} label="All" />
        </div>
      </section>

      {/* Premium Pass Banner */}
      <section className="px-6 mb-8 z-10 relative">
        <div className="bg-gradient-to-r from-[#30e86e] to-[#20c055] rounded-3xl p-1 shadow-[0_0_30px_rgba(48,232,110,0.2)] hover:shadow-[0_0_40px_rgba(48,232,110,0.4)] transition-shadow">
          <div className="bg-[#121212] rounded-[22px] px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2 mb-1">
                <span className="text-[#30e86e]">Premium Pass</span>
              </h3>
              <p className="text-xs text-gray-400">Learn everything on LongTalkDoo for 1 year.</p>
            </div>
            <button className="bg-[#30e86e] text-[#121212] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#20c055] transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="px-6 mb-8 z-10 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="text-orange-500" fill="currentColor" size={20} />
            Featured Courses
          </h3>
          <Link href="#" className="text-xs font-bold text-[#30e86e] hover:text-white transition-colors">
            VIEW ALL
          </Link>
        </div>

        <div className="space-y-4">
          <CourseCard
            title="English Grammar: Zero to Hero"
            lessons="12 lessons"
            duration="4h 30m"
            bgColor="bg-blue-500/10"
            iconColor="text-blue-400"
          />
          <CourseCard
            title="Business English Pro"
            lessons="24 lessons"
            duration="8h 15m"
            bgColor="bg-purple-500/10"
            iconColor="text-purple-400"
          />
          <CourseCard
            title="Daily Slang & Expressions"
            lessons="18 lessons"
            duration="5h 45m"
            bgColor="bg-pink-500/10"
            iconColor="text-pink-400"
          />
          <CourseCard
            title="TOEIC Prep Intensive"
            lessons="40 lessons"
            duration="15h 00m"
            bgColor="bg-yellow-500/10"
            iconColor="text-yellow-400"
          />
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass rounded-t-3xl z-50 border-t border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <NavItem icon={<Home size={24} />} label="Home" active />
          <NavItem icon={<BookOpen size={24} />} label="My Class" />
          <NavItem icon={<ShoppingBag size={24} />} label="Store" />
          <NavItem icon={<User size={24} />} label="Profile" />
        </div>
      </nav>
    </div>
  )
}

function CategoryItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[64px]">
      <div className="w-14 h-14 rounded-2xl bg-[#1e1e1e] flex items-center justify-center border border-white/5 group-hover:border-[#30e86e] group-hover:bg-[#30e86e]/10 transition-all text-gray-400 group-hover:text-[#30e86e] shadow-lg">
        {icon}
      </div>
      <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </div>
  )
}

function CourseCard({ title, lessons, duration, bgColor, iconColor }: { title: string, lessons: string, duration: string, bgColor: string, iconColor: string }) {
  return (
    <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${iconColor}`}>
          <BookOpen strokeWidth={2.5} size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1 group-hover:text-[#30e86e] transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-medium">{lessons} • {duration}</p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#30e86e] group-hover:text-black transition-colors">
        <ChevronRight size={18} />
      </div>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-[#30e86e]' : 'text-gray-500 hover:text-gray-300'}`}>
      <div className={`p-1 ${active ? 'bg-[#30e86e]/10 rounded-xl' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  )
}
