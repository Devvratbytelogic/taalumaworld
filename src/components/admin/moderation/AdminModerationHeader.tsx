export function AdminModerationHeader() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Moderation Queue
          </h1>
          <p className="text-muted-foreground">
            Review and moderate flagged content
          </p>
        </div>
      </div>
    </div>
  );
}
