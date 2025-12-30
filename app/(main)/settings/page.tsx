export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <p className="font-medium">John Doe</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">john@example.com</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
