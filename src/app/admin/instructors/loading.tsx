export default function InstructorsAdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-48 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-10 w-32 bg-primary/20 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="h-24 bg-gray-100" />
                        <div className="p-4 space-y-2">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl -mt-10" />
                            <div className="h-4 w-28 bg-gray-200 rounded-lg" />
                            <div className="h-3 w-40 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
