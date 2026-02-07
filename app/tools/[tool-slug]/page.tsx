export default function ToolPage({
  params,
}: {
  params: { "tool-slug": string };
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-text-secondary">
          Tool: {params["tool-slug"]}
        </p>
      </div>
    </div>
  );
}
