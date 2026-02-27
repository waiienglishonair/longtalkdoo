export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                </div>
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <div className="flex justify-between">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                            <div className="w-14 h-6 bg-gray-100 rounded-full" />
                        </div>
                        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
                        <div className="h-7 w-20 bg-gray-200 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="h-5 w-40 bg-gray-200 rounded-lg" />
                </div>
                <div className="space-y-0">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
                            <div className="w-8 h-8 bg-gray-100 rounded-full" />
                            <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                            <div className="h-4 w-40 bg-gray-50 rounded-lg ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
