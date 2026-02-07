export default function BlogPost({
  params,
}: {
  params: { topic: string; title: string };
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-text-secondary">
          Blog post: {params.topic}/{params.title}
        </p>
      </div>
    </div>
  );
}
