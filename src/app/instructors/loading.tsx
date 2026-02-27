export default function InstructorsLoading() {
    return (
        <div className="text-text-main">
            <div className="fixed inset-0 z-0 pointer-events-none grid-notebook" />
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Hero skeleton */}
                <div className="bg-gradient-to-br from-primary via-primary-dark to-primary py-12 lg:py-20 text-center">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 flex flex-col items-center">
                        <div className="h-6 w-36 bg-white/15 rounded-full" />
                        <div className="h-10 w-64 bg-white/20 rounded-xl" />
                        <div className="h-4 w-80 bg-white/10 rounded-lg" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 animate-pulse">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                        <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="h-24 bg-gray-100" />
                                <div className="p-4 space-y-2">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl -mt-10" />
                                    <div className="h-4 w-28 bg-gray-200 rounded-lg" />
                                    <div className="h-3 w-40 bg-gray-100 rounded-lg" />
                                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                                        <div className="h-3 w-16 bg-gray-100 rounded" />
                                        <div className="h-3 w-12 bg-gray-100 rounded" />
                                        <div className="h-3 w-8 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
