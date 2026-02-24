function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1 text-text-main">ยินดีต้อนรับกลับมา, แอดมิน</h1>
                <p className="text-text-sub text-sm">สรุปสิ่งที่เกิดขึ้นบนแพลตฟอร์มของคุณวันนี้</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="รายได้ทั้งหมด"
                    value="฿124,500"
                    trend="+15%"
                    isPositive={true}
                    icon="payments"
                    iconColor="text-primary"
                    iconBg="bg-primary/10"
                />
                <SummaryCard
                    title="นักเรียนที่ใช้งาน"
                    value="1,248"
                    trend="+5.2%"
                    isPositive={true}
                    icon="group"
                    iconColor="text-blue-500"
                    iconBg="bg-blue-50"
                />
                <SummaryCard
                    title="เรียนจบ"
                    value="456"
                    trend="-2.1%"
                    isPositive={false}
                    icon="school"
                    iconColor="text-purple-500"
                    iconBg="bg-purple-50"
                />
                <SummaryCard
                    title="เวลาเฉลี่ย"
                    value="24m"
                    trend="+1.2%"
                    isPositive={true}
                    icon="timer"
                    iconColor="text-orange-500"
                    iconBg="bg-orange-50"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Enrollments Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-text-main">การลงทะเบียนล่าสุด</h3>
                        <button className="text-xs text-primary font-bold hover:underline transition-colors">ดูทั้งหมด</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left align-middle text-text-sub">
                            <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-4">นักเรียน</th>
                                    <th scope="col" className="px-6 py-4">คอร์ส</th>
                                    <th scope="col" className="px-6 py-4">สถานะ</th>
                                    <th scope="col" className="px-6 py-4">วันที่</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow student="ไมเคิล ก." course="ภาษาอังกฤษธุรกิจ Pro" status="กำลังเรียน" date="วันนี้, 10:42" />
                                <TableRow student="ซาร่าห์ ล." course="ติว TOEIC แบบเข้มข้น" status="กำลังเรียน" date="วันนี้, 09:15" />
                                <TableRow student="เดวิด ว." course="ไวยากรณ์อังกฤษ" status="เรียนจบ" date="เมื่อวาน" />
                                <TableRow student="เจสซิก้า ท." course="สแลงประจำวัน" status="กำลังเรียน" date="เมื่อวาน" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-text-main">คอร์สยอดนิยม</h3>
                        <MaterialIcon name="trending_up" className="text-text-sub" />
                    </div>
                    <div className="p-2 flex-1">
                        <div className="space-y-1">
                            <CourseListItem rank={1} name="ภาษาอังกฤษธุรกิจ Pro" enrolls="450" />
                            <CourseListItem rank={2} name="ติว TOEIC แบบเข้มข้น" enrolls="312" />
                            <CourseListItem rank={3} name="ไวยากรณ์อังกฤษ" enrolls="285" />
                            <CourseListItem rank={4} name="สแลงประจำวัน" enrolls="154" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SummaryCard({ title, value, trend, isPositive, icon, iconColor, iconBg }: {
    title: string; value: string; trend: string; isPositive: boolean; icon: string; iconColor: string; iconBg: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-primary/30 transition-all hover:shadow-md shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${iconBg} rounded-xl`}>
                    <MaterialIcon name={icon} className={`text-2xl ${iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-secondary'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <h4 className="text-text-sub text-sm font-medium mb-1">{title}</h4>
                <h3 className="text-2xl font-bold text-text-main tracking-tight">{value}</h3>
            </div>
        </div>
    )
}

function TableRow({ student, course, status, date }: { student: string; course: string; status: string; date: string }) {
    const isCompleted = status === 'เรียนจบ'
    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 font-medium text-text-main">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {student.charAt(0)}
                    </div>
                    {student}
                </div>
            </td>
            <td className="px-6 py-4">{course}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-purple-50 text-purple-500' : 'bg-green-50 text-green-600'}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{date}</td>
        </tr>
    )
}

function CourseListItem({ rank, name, enrolls }: { rank: number; name: string; enrolls: string }) {
    return (
        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-text-sub border border-gray-200'}`}>
                {rank}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-text-main mb-0.5 leading-none">{name}</h4>
                <p className="text-xs text-text-sub">{enrolls} นักเรียน</p>
            </div>
        </div>
    )
}
