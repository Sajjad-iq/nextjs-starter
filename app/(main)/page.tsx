export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
        <p className="text-muted-foreground">Retail System</p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold mb-1">Dashboard</h3>
            <p className="text-sm text-muted-foreground">View your dashboard</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold mb-1">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </button>
        </div>
      </div>
    </div>
  );
}
