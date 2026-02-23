import { Activity, BookOpen, UserCheck, DollarSign, TrendingUp, Users } from 'lucide-react'

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">Welcome back, Admin</h1>
                <p className="text-gray-400 text-sm">Here's what's happening with your platform today.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Revenue"
                    value="$12,450"
                    trend="+15%"
                    isPositive={true}
                    icon={<DollarSign size={24} className="text-[#30e86e]" />}
                />
                <SummaryCard
                    title="Active Students"
                    value="1,248"
                    trend="+5.2%"
                    isPositive={true}
                    icon={<Users size={24} className="text-blue-400" />}
                />
                <SummaryCard
                    title="Course Completions"
                    value="456"
                    trend="-2.1%"
                    isPositive={false}
                    icon={<BookOpen size={24} className="text-purple-400" />}
                />
                <SummaryCard
                    title="Avg Session"
                    value="24m"
                    trend="+1.2%"
                    isPositive={true}
                    icon={<Activity size={24} className="text-orange-400" />}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Enrollments Table */}
                <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#1e1e1e]/50">
                        <h3 className="font-bold text-lg">Recent Enrollments</h3>
                        <button className="text-xs text-[#30e86e] font-bold hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle text-gray-400">
                            <thead className="text-xs uppercase bg-[#121212]/50 text-gray-500 font-bold border-b border-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Student</th>
                                    <th scope="col" className="px-6 py-4">Course</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow student="Michael K." course="Business English Pro" status="Active" date="Today, 10:42 AM" />
                                <TableRow student="Sarah L." course="TOEIC Prep Intensive" status="Active" date="Today, 09:15 AM" />
                                <TableRow student="David W." course="English Grammar" status="Completed" date="Yesterday" />
                                <TableRow student="Jessica T." course="Daily Slang" status="Active" date="Yesterday" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 flex flex-col">
                    <div className="p-5 border-b border-white/5 bg-[#1e1e1e]/50 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Top Courses</h3>
                        <TrendingUp size={18} className="text-gray-400" />
                    </div>
                    <div className="p-2 flex-1">
                        <div className="space-y-1">
                            <CourseListItem rank={1} name="Business English Pro" enrolls="450" />
                            <CourseListItem rank={2} name="TOEIC Prep Intensive" enrolls="312" />
                            <CourseListItem rank={3} name="English Grammar" enrolls="285" />
                            <CourseListItem rank={4} name="Daily Slang" enrolls="154" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SummaryCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
    return (
        <div className="bg-[#1e1e1e] rounded-2xl p-5 border border-white/5 hover:border-[#30e86e]/30 transition-all hover:shadow-[0_4px_20px_rgba(48,232,110,0.05)]">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#121212] rounded-xl border border-white/5">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-[#30e86e]/10 text-[#30e86e]' : 'bg-red-500/10 text-red-400'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </div>
    )
}

function TableRow({ student, course, status, date }: { student: string, course: string, status: string, date: string }) {
    const isCompleted = status === 'Completed'
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-medium text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#121212] to-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white">
                        {student.charAt(0)}
                    </div>
                    {student}
                </div>
            </td>
            <td className="px-6 py-4">{course}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-purple-500/10 text-purple-400' : 'bg-[#30e86e]/10 text-[#30e86e]'}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{date}</td>
        </tr>
    )
}

function CourseListItem({ rank, name, enrolls }: { rank: number, name: string, enrolls: string }) {
    return (
        <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-[#30e86e] text-black' : 'bg-[#121212] text-gray-400 border border-white/10'}`}>
                {rank}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-0.5 leading-none">{name}</h4>
                <p className="text-xs text-gray-500">{enrolls} students</p>
            </div>
        </div>
    )
}

// Ensure the code resolves the User component missing import, I'll update the layout
// In the previous component, I used users icon but didn't import it. I'll fix this.
