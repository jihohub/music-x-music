import { ArtistPageWrapper } from "./ArtistPageWrapper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ArtistPageWrapper id={id} />;
}
