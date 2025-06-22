import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicSearchResult,
  AppleMusicTrack,
} from "@/types/apple-music";
import { useCallback, useEffect, useState } from "react";
import { useSearchQuery } from "../queries/useSearchQuery";
import { SearchType } from "./useSearchPageLogic";

const processSearchResults = (
  searchResults: AppleMusicSearchResult | undefined
) => {
  const allTracks: AppleMusicTrack[] = searchResults?.songs?.data || [];
  const allArtists: AppleMusicArtist[] = searchResults?.artists?.data || [];
  const allAlbums: AppleMusicAlbum[] = searchResults?.albums?.data || [];

  return { allTracks, allArtists, allAlbums };
};

export function useSearchLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");

  // 검색 타입에 따른 Apple Music 타입 변환
  const searchTypes =
    searchType === "artist"
      ? "artists"
      : searchType === "track"
      ? "songs"
      : searchType === "album"
      ? "albums"
      : "songs,albums,artists";

  // Apple Music 검색 쿼리
  const {
    data: searchResults,
    isFetching,
    isError,
    error,
  } = useSearchQuery(debouncedSearchTerm, searchTypes);

  // 결과 처리
  const { allTracks, allArtists, allAlbums } =
    processSearchResults(searchResults);

  // 검색 결과가 있는지 확인
  const hasResults =
    allTracks.length > 0 || allArtists.length > 0 || allAlbums.length > 0;

  // 선택된 유형에 따라 표시할 결과 결정
  const shouldShowArtists = searchType === "all" || searchType === "artist";
  const shouldShowTracks = searchType === "all" || searchType === "track";
  const shouldShowAlbums = searchType === "all" || searchType === "album";

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // 검색어 초기화
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  // 검색 유형 변경 핸들러
  const handleTypeChange = useCallback((type: SearchType) => {
    setSearchType(type);
  }, []);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    // 상태
    searchTerm,
    searchType,
    allTracks,
    allArtists,
    allAlbums,
    isFetching,
    isError,
    error,
    hasResults,

    // 선택 상태
    shouldShowArtists,
    shouldShowTracks,
    shouldShowAlbums,

    // 핸들러
    handleSearchChange,
    clearSearch,
    handleTypeChange,
  };
}
