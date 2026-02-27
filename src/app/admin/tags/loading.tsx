export default function TagsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                <div className="h-4 w-40 bg-gray-100 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                    <div className="h-5 w-28 bg-gray-200 rounded-lg" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-primary/20 rounded-xl" />
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50">
                            <div className="h-4 w-24 bg-gray-200 rounded-lg" />
                            <div className="h-4 w-20 bg-gray-100 rounded-lg" />
                            <div className="h-4 w-24 bg-gray-100 rounded-lg ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
