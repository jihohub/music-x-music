import { AlbumPageWrapper } from "./AlbumPageWrapper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AlbumPageWrapper id={id} />;
}
