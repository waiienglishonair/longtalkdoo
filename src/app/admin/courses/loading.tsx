export default function CoursesLoading() {
    return (
        <div className="space-y-6 max-w-5xl animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="h-36 bg-gray-100" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded-lg" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded-lg" />
                            <div className="flex justify-between mt-3">
                                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                                <div className="h-5 w-20 bg-gray-200 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
