export default function CategoriesLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-48 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-10 w-40 bg-primary/20 rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                        <div className="h-4 w-32 bg-gray-200 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
                        <div className="h-4 w-20 bg-gray-100 rounded-lg ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}
