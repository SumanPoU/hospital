export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-background/80 backdrop-blur-sm border shadow-2xl">
        {/* <Loader2 className="relative h-12 w-12 animate-spin text-primary" /> */}
        <p className="text-lg font-semibold text-foreground nunito-text">
          Loading Admin Panel
        </p>
      </div>
    </div>
  );
}