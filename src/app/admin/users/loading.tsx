export default function UsersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-40 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-56 bg-gray-100 rounded-lg" />
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-3">
                    <div className="h-10 flex-1 bg-gray-100 rounded-xl" />
                    <div className="h-10 w-24 bg-gray-100 rounded-xl" />
                </div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
                        <div className="w-10 h-10 bg-gray-100 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <div className="h-4 w-32 bg-gray-200 rounded-lg" />
                            <div className="h-3 w-48 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="h-6 w-16 bg-gray-100 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
