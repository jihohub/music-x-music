/**
 * Apple Music API 관련 상수
 */

export const APPLE_MUSIC_API_BASE = "https://api.music.apple.com/v1";

/**
 * 메인 페이지에 표시될 추천 아티스트 ID 목록 (Apple Music ID)
 */
export const FEATURED_ARTIST_IDS = [
  "925734064", // James Hype
  "605800394", // SZA
  "1387587503", // John Summit
  "1455262408", // Fred again..
  "432942256", // Charli XCX
  "1446365464", // Tate McRae
];

/**
 * 메인 페이지에 표시될 추천 트랙 ID 목록 (Apple Music ID)
 */
export const RECOMMENDED_TRACK_IDS = [
  "1791736475", // Don't Wake Me Up - James Hype
  "1657869492", // Snooze - SZA
  "1789854625", // Focus (feat. CLOVES) - John Summit
  "1640463909", // Kammy (like i do) - Fred again..
  "1513162746", // party 4 u - Charli xcx
  "1779319626", // Revolving door - Tate McRae
];

/**
 * 트렌드 페이지에 표시될 아티스트 ID 목록 (Apple Music ID)
 */
export const TREND_ARTIST_IDS = [
  "159260351", // Taylor Swift
  "278873078", // Bruno Mars
  "479756766", // The Weeknd
  "1065981054", // Billie Eilish
  "412778295", // Ariana Grande
  "368183298", // Kendrick Lamar
  "982372505", // Playboi Carti
  "390647681", // Sabrina Carpenter
  "1126808565", // Bad Bunny
  "277293880", // Lady Gaga
  "442122051", // Frank Ocean
  "830588310", // Doja Cat
  "966309175", // Post Malone
  "1446365464", // Tate McRae
  "183313439", // Ed Sheeran
  "605800394", // SZA
  "979458609", // Olivia Rodrigo
  "1435848034", // The Kid LAROI
  "549236696", // Travis Scott
  "271256", // Drake
];

/**
 * 트렌드 페이지에 표시될 트랙 ID 목록 (Apple Music ID)
 */
export const TREND_TRACK_IDS = [
  "1781270323", // luther - Kendrick Lamar & SZA
  "1744776167", // Not Like Us - Kendrick Lamar
  "1762656732", // Die With A Smile - Lady Gaga & Bruno Mars
  "1739659142", // BIRDS OF A FEATHER - Billie Eilish
  "1757650207", // we can't be friends - Ariana Grande
  "1770393194", // Timeless - The Weeknd & Playboi Carti
  "1773474483", // That's So True - Gracie Abrams
  "1793663645", // Ordinary - Alex Warren
  "1787023936", // DtMF - Bad Bunny
  "1802175276", // EVIL J0RDAN - Playboi Carti
  "1776914757", // São Paulo - The Weeknd & Anitta
  "1802084938", // undressed - sombr
  "1795979745", // like JENNIE - JENNIE
  "1740212434", // Espresso - Sabrina Carpenter
  "1559318719", // MONTERO (Call Me By Your Name) - Lil Nas X
  "1689239800", // What Was I Made For? - Billie Eilish
  "1709723310", // Wild Ones - Jessie Murph & Jelly Roll
  "1793654358", // Open Hearts - The Weeknd
  "1708309430", // Is It Over Now? (Taylor's Version) - Taylor Swift
  "1715920580", // Lovin On Me - Jack Harlow
];

/**
 * 트렌드 페이지에 표시될 앨범 ID 목록 (Apple Music ID)
 */
export const TREND_ALBUM_IDS = [
  "1781270319", // GNX - Kendrick Lamar
  "1802175271", // MUSIC - Playboi Carti
  "1794644675", // SOS Deluxe: LANA - SZA
  "1739659134", // HIT ME HARD AND SOFT - Billie Eilish
  "1800579610", // eternal sunshine deluxe - Ariana Grande
  "1793654348", // Hurry Up Tomorrow - The Weeknd
  "1797590677", // So Close To What - Tate McRae
  "1796127242", // $ome $exy $ongs 4 U - PARTYNEXTDOOR & Drake
  "1787022393", // DeBÍ TiRAR MáS FOToS - Bad Bunny
  "1792666546", // MAYHEM - Lady Gaga
  "1750307020", // Short n' Sweet - Sabrina Carpenter
  "1738363766", // COWBOY CARTER - Beyoncé
  "1767658574", // EUSEXUA - FKA twigs
  "1803412491", // Azizam - Ed Sheeran
  "1440933512", // 1989 (Deluxe Edition) - Taylor Swift
  "1736994915", // GUTS (spilled) - Olivia Rodrigo
  "1800532611", // Even In Arcadia - Sleep Token
  "1771105914", // rosie - ROSÉ
  "1795979743", // Ruby - JENNIE
  "1796483834", // Skeletá - Ghost
];

/**
 * Apple Music 지원 국가 코드 (기본값: US)
 */
export const DEFAULT_STOREFRONT = "us";

/**
 * Apple Music API 요청 제한
 */
export const API_LIMITS = {
  SEARCH: 25,
  TRACKS: 25,
  ALBUMS: 25,
  ARTISTS: 25,
  CHARTS: 20,
};
