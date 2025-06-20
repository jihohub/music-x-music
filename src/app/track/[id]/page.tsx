import { TrackPageWrapper } from "./TrackPageWrapper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TrackPageWrapper id={id} />;
}
