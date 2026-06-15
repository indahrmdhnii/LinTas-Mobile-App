import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Bus, Train, Truck, ChevronLeft, ChevronRight,
  ArrowRightLeft, Bookmark, Navigation as NavIcon, CalendarDays,
  Plus, Minus, Crosshair, X, CircleDot, Route, Layers,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { TransitBadge } from "../components/TransitBadge";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModaType = "JakLingko" | "TransJakarta" | "KRL" | "MRT" | "LRT" | "Transcity";
type ViewState = "pilih-moda" | "daftar-jalur" | "jalur-aktif" | "cari-halte" | "jak-lingko";

interface MapStop {
  id: string;
  name: string;
  x: number;
  y: number;
  info: string;
}

interface TransitRoute {
  id: string;
  code: string;
  name: string;
  stops: number;
  direction: string;
  points: [number, number][];
  stopPoints: MapStop[];
}

interface JakLingkoZone {
  id: string;
  name: string;
  shelterCount: number;
  routes: string;
  polygon: [number, number][];
  shelters: MapStop[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODA_COLORS: Record<ModaType, string> = {
  JakLingko: "#00923F",
  TransJakarta: "#E2001A",
  KRL: "#FF6600",
  MRT: "#0070C0",
  LRT: "#E4002B",
  Transcity: "#6A5ACD",
};

const MODA_LABELS: Record<ModaType, string> = {
  JakLingko: "Jak Lingko",
  TransJakarta: "Transjakarta",
  KRL: "KRL",
  MRT: "MRT",
  LRT: "LRT",
  Transcity: "Transcity",
};

const MODA_ROUTE_COUNT: Record<ModaType, number> = {
  JakLingko: 4,
  TransJakarta: 48,
  KRL: 8,
  MRT: 2,
  LRT: 3,
  Transcity: 5,
};

const MODA_LIST: ModaType[] = ["JakLingko", "TransJakarta", "KRL", "MRT", "LRT", "Transcity"];

// SVG Transform: x = (lon-106.58)*750, y = (-6.05-lat)*867
// Key coordinates based on real Jabodetabek geography

const ROUTE_DATA: Record<Exclude<ModaType, "JakLingko">, TransitRoute[]> = {
  TransJakarta: [
    {
      id: "tj-1", code: "1", name: "Blok M → Kota", stops: 24, direction: "Kota",
      points: [[164,168],[170,161],[174,153],[178,145],[180,137],[180,131],[181,123],[181,115],[181,108],[173,103],[170,96],[170,88],[173,80],[176,75]],
      stopPoints: [
        { id: "tj1-blokm", name: "Halte Blok M", x: 164, y: 168, info: "Sisi kanan jalan · Arah Kota" },
        { id: "tj1-da", name: "Halte Dukuh Atas", x: 180, y: 131, info: "Sisi kanan jalan · Arah Kota" },
        { id: "tj1-harmoni", name: "Halte Harmoni Central", x: 173, y: 103, info: "Sisi kanan jalan · Arah Kota" },
        { id: "tj1-kota", name: "Halte Kota", x: 176, y: 75, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tj-2a", code: "2A", name: "Pulo Gadung → Rawa Buaya", stops: 32, direction: "Rawa Buaya",
      points: [[226,117],[228,107],[228,97],[228,88],[224,79],[217,71],[207,67],[195,65],[183,67],[176,72],[173,80],[162,85],[148,87],[133,88],[118,90],[110,95],[110,103]],
      stopPoints: [
        { id: "tj2a-pg", name: "Halte Pulo Gadung", x: 226, y: 117, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2a-kg", name: "Halte Kelapa Gading", x: 231, y: 95, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2a-kota", name: "Halte Kota", x: 176, y: 75, info: "Sisi kiri jalan · Arah Rawa Buaya" },
        { id: "tj2a-harmoni", name: "Halte Harmoni", x: 173, y: 103, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2a-jembatan", name: "Halte Jembatan Besi", x: 122, y: 96, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2a-rawab", name: "Halte Rawa Buaya", x: 110, y: 103, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tj-2b", code: "2B", name: "Harmoni → Rawa Buaya", stops: 28, direction: "Rawa Buaya",
      points: [[173,103],[162,103],[148,103],[133,103],[120,103],[110,103]],
      stopPoints: [
        { id: "tj2b-harmoni", name: "Halte Harmoni", x: 173, y: 103, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2b-jembatan", name: "Halte Jembatan Lima", x: 140, y: 103, info: "Sisi kanan jalan · Arah Rawa Buaya" },
        { id: "tj2b-rawab", name: "Halte Rawa Buaya", x: 110, y: 103, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tj-3", code: "3", name: "Kalideres → Pasar Baru", stops: 21, direction: "Pasar Baru",
      points: [[90,91],[105,91],[118,89],[130,90],[143,93],[155,96],[163,99],[168,102],[173,102],[175,93],[176,84],[175,77]],
      stopPoints: [
        { id: "tj3-kal", name: "Halte Kalideres", x: 90, y: 91, info: "Sisi kanan jalan · Arah Pasar Baru" },
        { id: "tj3-harmoni", name: "Halte Harmoni", x: 168, y: 102, info: "Sisi kanan jalan · Arah Pasar Baru" },
        { id: "tj3-pb", name: "Halte Pasar Baru", x: 175, y: 77, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tj-4", code: "4", name: "Pulo Gadung → Dukuh Atas", stops: 18, direction: "Dukuh Atas",
      points: [[226,117],[219,120],[212,124],[206,127],[200,128],[194,129],[188,130],[183,130],[180,131]],
      stopPoints: [
        { id: "tj4-pg", name: "Halte Pulo Gadung", x: 226, y: 117, info: "Sisi kanan jalan · Arah Dukuh Atas" },
        { id: "tj4-da", name: "Halte Dukuh Atas", x: 180, y: 131, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tj-6", code: "6", name: "Ragunan → Dukuh Atas", stops: 20, direction: "Dukuh Atas",
      points: [[181,217],[181,207],[181,198],[181,188],[181,178],[181,168],[181,157],[181,147],[181,138],[180,131]],
      stopPoints: [
        { id: "tj6-rag", name: "Halte Ragunan", x: 181, y: 217, info: "Sisi kanan jalan · Arah Dukuh Atas" },
        { id: "tj6-semanggi", name: "Halte Semanggi", x: 181, y: 168, info: "Sisi kanan jalan · Arah Dukuh Atas" },
        { id: "tj6-da", name: "Halte Dukuh Atas", x: 180, y: 131, info: "Sisi kiri jalan · Terminus" },
      ],
    },
  ],
  KRL: [
    {
      id: "krl-bogor", code: "Bogor Line", name: "Jakarta Kota → Bogor", stops: 40, direction: "Bogor",
      points: [[176,75],[178,83],[180,91],[183,99],[183,107],[183,115],[183,123],[183,132],[185,141],[188,150],[193,159],[197,168],[200,177],[202,186],[203,196],[203,206],[202,217],[200,228],[199,239],[198,250],[197,262],[196,274],[194,288],[192,302],[190,316],[188,330],[186,345],[184,360],[181,375],[178,392],[174,413],[170,435],[166,455],[163,472],[162,482]],
      stopPoints: [
        { id: "krl-kota", name: "Stasiun Jakarta Kota", x: 176, y: 75, info: "Peron 4 · Pintu Selatan" },
        { id: "krl-gambir", name: "Stasiun Gambir", x: 183, y: 107, info: "Peron 2 · Pintu Barat" },
        { id: "krl-manggarai", name: "Stasiun Manggarai", x: 200, y: 177, info: "Peron 3 · Pintu Timur" },
        { id: "krl-depok", name: "Stasiun Depok", x: 190, y: 316, info: "Peron 1 · Pintu Utara" },
        { id: "krl-bogor", name: "Stasiun Bogor", x: 162, y: 482, info: "Peron 3 · Pintu Selatan" },
      ],
    },
    {
      id: "krl-bekasi", code: "Bekasi Line", name: "Jakarta Kota → Bekasi", stops: 28, direction: "Bekasi",
      points: [[176,75],[190,75],[205,77],[218,81],[228,87],[230,96],[230,106],[229,116],[228,126],[228,136],[228,146],[230,155],[235,162],[248,164],[268,164],[292,164],[318,162]],
      stopPoints: [
        { id: "krl-kota2", name: "Stasiun Jakarta Kota", x: 176, y: 75, info: "Peron 4 · Pintu Selatan" },
        { id: "krl-jatinegara", name: "Stasiun Jatinegara", x: 228, y: 136, info: "Peron 2 · Pintu Timur" },
        { id: "krl-bekasi", name: "Stasiun Bekasi", x: 318, y: 162, info: "Peron 1 · Pintu Selatan" },
      ],
    },
    {
      id: "krl-rkb", code: "Rangkasbitung", name: "Tanah Abang → Rangkasbitung", stops: 35, direction: "Rangkasbitung",
      points: [[178,138],[165,143],[150,150],[132,160],[114,172],[96,186],[78,202],[62,220],[48,238],[34,256]],
      stopPoints: [
        { id: "krl-ta", name: "Stasiun Tanah Abang", x: 178, y: 138, info: "Peron 3 · Pintu Utara" },
        { id: "krl-rkb", name: "Stasiun Rangkasbitung", x: 34, y: 256, info: "Peron 1 · Terminus" },
      ],
    },
    {
      id: "krl-priok", code: "Tanjung Priok", name: "Jakarta Kota → Tanjung Priok", stops: 12, direction: "Tanjung Priok",
      points: [[176,75],[186,70],[200,64],[213,58],[222,54]],
      stopPoints: [
        { id: "krl-kota3", name: "Stasiun Jakarta Kota", x: 176, y: 75, info: "Peron 4 · Pintu Selatan" },
        { id: "krl-priok", name: "Stasiun Tanjung Priok", x: 222, y: 54, info: "Peron 2 · Pintu Utara" },
      ],
    },
  ],
  MRT: [
    {
      id: "mrt-ns", code: "North-South", name: "Lebak Bulus → Bundaran HI", stops: 13, direction: "Bundaran HI",
      points: [[147,207],[152,197],[158,187],[162,177],[164,168],[166,161],[168,154],[170,147],[173,140],[175,134],[177,131],[179,129],[182,127]],
      stopPoints: [
        { id: "mrt-lb", name: "Stasiun Lebak Bulus Grab", x: 147, y: 207, info: "Peron 1 · Pintu Utara" },
        { id: "mrt-fatmawati", name: "Stasiun Fatmawati", x: 152, y: 197, info: "Peron 2 · Pintu Selatan" },
        { id: "mrt-blokm", name: "Stasiun Blok M BCA", x: 164, y: 168, info: "Peron 2 · Pintu Selatan" },
        { id: "mrt-senayan", name: "Stasiun Senayan DPR", x: 174, y: 140, info: "Peron 1 · Pintu Barat" },
        { id: "mrt-da", name: "Stasiun Dukuh Atas BNI", x: 179, y: 129, info: "Peron 2 · Pintu Selatan" },
        { id: "mrt-bhi", name: "Stasiun Bundaran HI", x: 182, y: 127, info: "Peron 1 · Pintu Barat" },
      ],
    },
    {
      id: "mrt-ns2", code: "North-South Ext.", name: "Bundaran HI → Kota", stops: 8, direction: "Kota",
      points: [[182,127],[181,120],[180,113],[179,106],[178,99],[177,92],[176,84],[176,75]],
      stopPoints: [
        { id: "mrt-bhi2", name: "Stasiun Bundaran HI", x: 182, y: 127, info: "Peron 1 · Pintu Selatan" },
        { id: "mrt-kota", name: "Stasiun Kota", x: 176, y: 75, info: "Peron 2 · Pintu Utara" },
      ],
    },
  ],
  LRT: [
    {
      id: "lrt-kg", code: "Kelapa Gading", name: "Kelapa Gading → Velodrome", stops: 6, direction: "Velodrome",
      points: [[231,95],[235,107],[239,119],[242,131],[243,142],[244,151],[244,155]],
      stopPoints: [
        { id: "lrt-kg", name: "Stasiun Kelapa Gading", x: 231, y: 95, info: "Peron 1 · Pintu Selatan" },
        { id: "lrt-rawamangun", name: "Stasiun Rawamangun", x: 239, y: 119, info: "Peron 2 · Pintu Barat" },
        { id: "lrt-velo", name: "Stasiun Velodrome", x: 244, y: 155, info: "Peron 2 · Pintu Barat" },
      ],
    },
    {
      id: "lrt-jkt", code: "Jabodebek", name: "Dukuh Atas → Cibubur", stops: 18, direction: "Cibubur",
      points: [[180,131],[191,134],[204,138],[218,143],[232,150],[243,160],[252,173],[259,188],[263,206],[265,224],[265,242],[263,258],[260,268]],
      stopPoints: [
        { id: "lrt-da", name: "Stasiun Dukuh Atas", x: 180, y: 131, info: "Peron 2 · Pintu Barat" },
        { id: "lrt-jatinegara2", name: "Stasiun Jatinegara", x: 232, y: 150, info: "Peron 1 · Pintu Utara" },
        { id: "lrt-halim", name: "Stasiun Halim", x: 263, y: 206, info: "Peron 1 · Pintu Barat" },
        { id: "lrt-cibubur", name: "Stasiun Cibubur", x: 260, y: 268, info: "Peron 1 · Terminus" },
      ],
    },
  ],
  Transcity: [
    {
      id: "tc-01", code: "TC-01", name: "Tangerang → Blok M", stops: 22, direction: "Blok M",
      points: [[43,111],[57,111],[72,111],[88,114],[103,118],[116,126],[126,136],[134,146],[142,157],[152,165],[160,170],[164,168]],
      stopPoints: [
        { id: "tc01-tng", name: "Halte Tangerang Terminal", x: 43, y: 111, info: "Sisi kanan jalan · Arah Blok M" },
        { id: "tc01-kbn", name: "Halte Kebun Nanas", x: 116, y: 126, info: "Sisi kiri jalan · Arah Blok M" },
        { id: "tc01-blokm", name: "Halte Blok M", x: 164, y: 168, info: "Sisi kiri jalan · Terminus" },
      ],
    },
    {
      id: "tc-02", code: "TC-02", name: "Serpong → Lebak Bulus", stops: 18, direction: "Lebak Bulus",
      points: [[64,232],[76,228],[90,224],[104,220],[117,216],[129,212],[139,209],[144,207],[147,207]],
      stopPoints: [
        { id: "tc02-spg", name: "Halte Serpong", x: 64, y: 232, info: "Sisi kanan jalan · Arah Lebak Bulus" },
        { id: "tc02-cs", name: "Halte Ciputat Selatan", x: 117, y: 216, info: "Sisi kiri jalan · Arah Lebak Bulus" },
        { id: "tc02-lb", name: "Halte Lebak Bulus", x: 147, y: 207, info: "Sisi kiri jalan · Terminus" },
      ],
    },
  ],
};

const JAK_LINGKO_ZONES: JakLingkoZone[] = [
  {
    id: "jl-jakut", name: "Jakarta Utara — Penjaringan", shelterCount: 18, routes: "1A, 1B, 2C",
    polygon: [[43,52],[180,50],[222,55],[238,80],[230,98],[210,100],[175,97],[145,88],[110,86],[72,87],[43,75]],
    shelters: [
      { id: "sh-pluit", name: "Shelter Jak Lingko Pluit", x: 148, y: 73, info: "Rute 1A, 1B tersedia di sini" },
      { id: "sh-priok", name: "Shelter Jak Lingko Tanjung Priok", x: 218, y: 80, info: "Rute 2C tersedia di sini" },
      { id: "sh-penjaringan", name: "Shelter Jak Lingko Penjaringan", x: 102, y: 75, info: "Rute 1A tersedia di sini" },
    ],
  },
  {
    id: "jl-jaksel", name: "Jakarta Selatan — Pasar Minggu", shelterCount: 12, routes: "5A, 5B",
    polygon: [[144,168],[183,168],[202,168],[218,177],[222,195],[222,210],[218,228],[205,246],[188,258],[170,262],[152,258],[138,248],[131,232],[131,210],[136,192],[140,178]],
    shelters: [
      { id: "sh-pm", name: "Shelter Jak Lingko Pasar Minggu", x: 200, y: 238, info: "Rute 5A, 5B tersedia di sini" },
      { id: "sh-mampang", name: "Shelter Jak Lingko Mampang", x: 173, y: 232, info: "Rute 5A tersedia di sini" },
    ],
  },
  {
    id: "jl-jakbar", name: "Jakarta Barat — Cengkareng", shelterCount: 15, routes: "3A, 3B",
    polygon: [[32,60],[92,58],[120,66],[132,80],[132,96],[126,116],[110,130],[88,138],[60,140],[36,135],[30,118],[30,78]],
    shelters: [
      { id: "sh-cengkareng", name: "Shelter Jak Lingko Cengkareng", x: 67, y: 100, info: "Rute 3A, 3B tersedia di sini" },
      { id: "sh-kalideres", name: "Shelter Jak Lingko Kalideres", x: 90, y: 112, info: "Rute 3A tersedia di sini" },
    ],
  },
  {
    id: "jl-jaktim", name: "Jakarta Timur — Cakung", shelterCount: 14, routes: "7A, 7B, 8C",
    polygon: [[232,88],[288,86],[330,118],[338,160],[325,182],[300,192],[272,185],[248,165],[244,140],[236,110]],
    shelters: [
      { id: "sh-cakung", name: "Shelter Jak Lingko Cakung", x: 298, y: 145, info: "Rute 7A, 8C tersedia di sini" },
      { id: "sh-cempaka", name: "Shelter Jak Lingko Cempaka Mas", x: 258, y: 140, info: "Rute 3B, 4A, 7C tersedia di sini" },
    ],
  },
];

// Road paths for the map
const ROADS: { points: [number, number][]; width: number }[] = [
  { points: [[176,75],[180,131],[180,155],[175,200],[170,260],[167,330]], width: 2.0 }, // Jl. Sudirman-Thamrin-Abdul Muis
  { points: [[176,75],[185,70],[205,60],[222,54]], width: 1.5 }, // Jl. Gunung Sahari → Priok
  { points: [[32,120],[75,110],[110,104],[155,110],[184,115],[230,120],[278,132],[318,145]], width: 2.0 }, // Tol Dalam Kota E-W
  { points: [[118,145],[160,148],[203,143],[248,157],[285,165]], width: 1.5 }, // Jl. Gatot Subroto
  { points: [[135,210],[180,206],[220,208],[268,218]], width: 1.5 }, // TB Simatupang
  { points: [[188,168],[200,195],[210,228],[220,268],[228,305]], width: 1.5 }, // Tol Jagorawi
  { points: [[188,168],[204,195],[207,235],[207,280],[203,330],[190,380]], width: 1.5 }, // Jl. Raya Bogor
  { points: [[43,111],[68,125],[100,140],[130,155]], width: 1.5 }, // Jl. Daan Mogot
  { points: [[64,232],[90,224],[122,215],[150,208]], width: 1.2 }, // Jl. Serpong-Lebak Bulus
];

const AREA_LABELS = [
  { id: "jakut", name: "JAKARTA UTARA", x: 165, y: 78 },
  { id: "jakpus", name: "JAKARTA PUSAT", x: 195, y: 118 },
  { id: "jaksel", name: "JAKARTA SELATAN", x: 182, y: 200 },
  { id: "jakbar", name: "JAKARTA BARAT", x: 88, y: 140 },
  { id: "jaktim", name: "JAKARTA TIMUR", x: 272, y: 148 },
  { id: "tangerang", name: "TANGERANG", x: 48, y: 102 },
  { id: "bekasi", name: "BEKASI", x: 330, y: 148 },
  { id: "depok", name: "DEPOK", x: 210, y: 292 },
  { id: "bogor", name: "BOGOR", x: 172, y: 460 },
  { id: "serpong", name: "SERPONG", x: 66, y: 222 },
];

const USER_LOCATION = { x: 182, y: 145 };

const MOCK_STOPS = [
  { id: "ms-1", name: "Halte Jembatan Besi", moda: "Transjakarta", routes: "2A, 2B, 3", color: "#E2001A" },
  { id: "ms-2", name: "Halte Jembatan Lima", moda: "Transjakarta", routes: "9", color: "#E2001A" },
  { id: "ms-3", name: "Halte Harmoni Central", moda: "Transjakarta", routes: "1, 2A, 3, 4", color: "#E2001A" },
  { id: "ms-4", name: "Halte Blok M", moda: "Transjakarta", routes: "1, 6, 9", color: "#E2001A" },
  { id: "ms-5", name: "Stasiun Dukuh Atas BNI", moda: "MRT", routes: "North-South", color: "#0070C0" },
  { id: "ms-6", name: "Stasiun Dukuh Atas", moda: "KRL", routes: "Bogor Line, Rangkasbitung", color: "#FF6600" },
  { id: "ms-7", name: "Stasiun Manggarai", moda: "KRL", routes: "Bogor Line, Rangkasbitung", color: "#FF6600" },
  { id: "ms-8", name: "Stasiun Bundaran HI", moda: "MRT", routes: "North-South", color: "#0070C0" },
  { id: "ms-9", name: "Shelter Jak Lingko Cempaka Mas", moda: "Jak Lingko", routes: "3B, 4A, 7C", color: "#00923F" },
  { id: "ms-10", name: "Shelter Jak Lingko Pasar Minggu", moda: "Jak Lingko", routes: "5A, 5B", color: "#00923F" },
  { id: "ms-11", name: "Halte Rawa Buaya", moda: "Transjakarta", routes: "2A, 2B", color: "#E2001A" },
  { id: "ms-12", name: "Stasiun Lebak Bulus Grab", moda: "MRT", routes: "North-South", color: "#0070C0" },
];

const MOCK_ROUTES = [
  { id: "mr-1", code: "2A", name: "Pulo Gadung → Rawa Buaya", moda: "Transjakarta", stops: 32, color: "#E2001A" },
  { id: "mr-2", code: "2B", name: "Harmoni → Rawa Buaya", moda: "Transjakarta", stops: 28, color: "#E2001A" },
  { id: "mr-3", code: "North-South", name: "Lebak Bulus → Bundaran HI", moda: "MRT", stops: 13, color: "#0070C0" },
  { id: "mr-4", code: "Bogor Line", name: "Jakarta Kota → Bogor", moda: "KRL", stops: 40, color: "#FF6600" },
  { id: "mr-5", code: "TC-01", name: "Tangerang → Blok M", moda: "Transcity", stops: 22, color: "#6A5ACD" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModaChip({ moda, active, onClick }: { moda: ModaType; active: boolean; onClick: () => void }) {
  const color = MODA_COLORS[moda];
  const label = MODA_LABELS[moda];
  const IconComp = moda === "JakLingko" || moda === "Transcity" ? Truck : moda === "TransJakarta" ? Bus : Train;
  return (
    <button
      onClick={onClick}
      style={{
        height: 36,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 100,
        border: active ? "none" : "1px solid #EEEEED",
        backgroundColor: active ? color : "#FFFFFF",
        color: active ? "#FFFFFF" : "#3C3C43",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: active ? `0 3px 10px ${color}55` : "0 1px 3px rgba(0,0,0,0.07)",
        fontFamily: "'Poppins', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        transition: "all 0.18s ease",
      }}
    >
      <IconComp size={16} color={active ? "#FFFFFF" : "#8E8E93"} strokeWidth={1.5} />
      {label}
    </button>
  );
}

function RouteCard({ route, color, onClick }: { route: TransitRoute; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "0 16px 0 0",
        display: "flex",
        alignItems: "stretch",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        textAlign: "left",
        overflow: "hidden",
        minHeight: 58,
      }}
    >
      <div style={{ width: 4, backgroundColor: color, borderRadius: "6px 0 0 6px", flexShrink: 0 }} />
      <div style={{ width: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, padding: "12px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1C1E", fontFamily: "'Poppins', sans-serif" }}>{route.code}</div>
        <div style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", fontFamily: "'Poppins', sans-serif", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {route.name} · {route.stops} halte · Arah {route.direction}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
        <ChevronRight size={16} color="#C7C7CC" strokeWidth={1.5} />
      </div>
    </button>
  );
}

function ZoneCard({ zone, onClick }: { zone: JakLingkoZone; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "0 16px 0 0",
        display: "flex",
        alignItems: "stretch",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        textAlign: "left",
        overflow: "hidden",
        minHeight: 58,
      }}
    >
      <div style={{ width: 4, backgroundColor: "#00923F", borderRadius: "6px 0 0 6px", flexShrink: 0 }} />
      <div style={{ width: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, padding: "12px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1C1E", fontFamily: "'Poppins', sans-serif" }}>{zone.name}</div>
        <div style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>
          {zone.shelterCount} shelter · Rute {zone.routes}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
        <ChevronRight size={16} color="#C7C7CC" strokeWidth={1.5} />
      </div>
    </button>
  );
}

// ─── Map SVG ──────────────────────────────────────────────────────────────────

function TransitMapSVG({
  viewState,
  selectedModa,
  selectedRoute,
  selectedStop,
  onStopSelect,
}: {
  viewState: ViewState;
  selectedModa: ModaType | null;
  selectedRoute: TransitRoute | null;
  selectedStop: MapStop | null;
  onStopSelect: (stop: MapStop) => void;
}) {
  const color = selectedModa ? MODA_COLORS[selectedModa] : "#1A6FBF";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 390 520"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      {/* Background */}
      <rect width="390" height="520" fill="#EEE9E0" />

      {/* Teluk Jakarta (bay) */}
      <path
        d="M 0,0 L 390,0 L 390,48 Q 310,44 260,50 Q 230,54 200,58 Q 170,62 145,60 Q 110,56 75,62 Q 48,66 20,70 Q 10,71 0,72 Z"
        fill="#C8DCE9"
        opacity="0.7"
      />

      {/* Roads */}
      {ROADS.map((road, i) => (
        <polyline
          key={i}
          points={road.points.map((p) => p.join(",")).join(" ")}
          stroke="#D5D1CB"
          strokeWidth={road.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Area labels */}
      {AREA_LABELS.map((label) => (
        <text
          key={label.id}
          x={label.x}
          y={label.y}
          fill="#B0AB9E"
          fontSize={8}
          fontFamily="'Poppins', sans-serif"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          {label.name}
        </text>
      ))}

      {/* Jak Lingko zones */}
      {viewState === "jak-lingko" &&
        JAK_LINGKO_ZONES.map((zone) => (
          <g key={zone.id}>
            <polygon
              points={zone.polygon.map((p) => p.join(",")).join(" ")}
              fill="#00923F"
              fillOpacity={0.10}
              stroke="#00923F"
              strokeOpacity={0.30}
              strokeWidth={1}
            />
          </g>
        ))}

      {/* Transit route polyline */}
      {selectedRoute && (
        <>
          {/* Glow/shadow */}
          <polyline
            points={selectedRoute.points.map((p) => p.join(",")).join(" ")}
            stroke={color}
            strokeWidth={10}
            strokeOpacity={0.15}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main line */}
          <polyline
            points={selectedRoute.points.map((p) => p.join(",")).join(" ")}
            stroke={color}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Stop markers */}
      {selectedRoute &&
        selectedRoute.stopPoints.map((stop) => {
          const isSelected = selectedStop?.id === stop.id;
          return (
            <g key={stop.id} onClick={() => onStopSelect(stop)} style={{ cursor: "pointer" }}>
              {isSelected ? (
                <>
                  <circle cx={stop.x} cy={stop.y} r={16} fill={color} fillOpacity={0.15} />
                  <circle cx={stop.x} cy={stop.y} r={8} fill={color} stroke="#FFFFFF" strokeWidth={2.5} />
                </>
              ) : (
                <circle cx={stop.x} cy={stop.y} r={5} fill="#FFFFFF" stroke={color} strokeWidth={2} />
              )}
            </g>
          );
        })}

      {/* Jak Lingko shelters */}
      {viewState === "jak-lingko" &&
        JAK_LINGKO_ZONES.map((zone) =>
          zone.shelters.map((shelter) => (
            <g key={shelter.id} onClick={() => onStopSelect(shelter)} style={{ cursor: "pointer" }}>
              <rect
                x={shelter.x - 7}
                y={shelter.y - 7}
                width={14}
                height={14}
                rx={4}
                fill="#00923F"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </g>
          ))
        )}

      {/* User location pulse */}
      <g>
        <circle cx={USER_LOCATION.x} cy={USER_LOCATION.y} r={12} fill="#1A6FBF" fillOpacity={0.0}>
          <animate attributeName="r" values="8;18;8" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.25;0;0.25" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={USER_LOCATION.x} cy={USER_LOCATION.y} r={6} fill="#1A6FBF" stroke="#FFFFFF" strokeWidth={2.5} />
      </g>
    </svg>
  );
}

// ─── Stop Popup ───────────────────────────────────────────────────────────────

function StopPopup({
  stop,
  moda,
  isJakLingko,
  onClose,
  onRute,
  onSimpan,
}: {
  stop: MapStop;
  moda: ModaType | null;
  isJakLingko: boolean;
  onClose: () => void;
  onRute: () => void;
  onSimpan: () => void;
}) {
  const badgeType = moda as "MRT" | "LRT" | "KRL" | "TransJakarta" | "JakLingko" | "Transcity";
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      style={{
        position: "absolute",
        bottom: 72,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: "20px 20px 0 0",
        padding: "16px 20px 14px",
        boxShadow: "0 -6px 28px rgba(0,0,0,0.13)",
        zIndex: 55,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Handle */}
      <div style={{ width: 40, height: 4, backgroundColor: "#EEEEED", borderRadius: 100, margin: "0 auto 14px" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
          {moda && <TransitBadge type={badgeType} />}
          <span style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E" }}>{stop.name}</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, marginLeft: 8 }}
        >
          <X size={20} color="#8E8E93" strokeWidth={1.5} />
        </button>
      </div>

      {/* Info */}
      <p style={{ fontSize: 13, color: "#3C3C43", margin: "0 0 14px", lineHeight: 1.5 }}>{stop.info}</p>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#EEEEED", marginBottom: 12 }} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <button
          style={{
            flex: 1, height: 44, borderRadius: 12, border: "1.5px solid #E5E5EA",
            backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500, color: "#1C1C1E",
          }}
        >
          <CalendarDays size={16} color="#3C3C43" strokeWidth={1.5} />
          Jadwal
        </button>
        <button
          onClick={onRute}
          style={{
            flex: 1, height: 44, borderRadius: 12, border: "none",
            backgroundColor: "#1A6FBF", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#FFFFFF",
          }}
        >
          <NavIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
          Rute ke sini
        </button>
      </div>

      {/* Ghost button */}
      <button
        onClick={onSimpan}
        style={{
          width: "100%", height: 40, borderRadius: 12, border: "none", backgroundColor: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500, color: "#1A6FBF",
        }}
      >
        <Bookmark size={16} color="#1A6FBF" strokeWidth={1.5} />
        {isJakLingko ? "Simpan shelter ini" : "Simpan halte ini"}
      </button>
    </motion.div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function PetaJalurScreen() {
  const navigate = useNavigate();

  const [viewState, setViewState] = useState<ViewState>("pilih-moda");
  const [selectedModa, setSelectedModa] = useState<ModaType | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null);
  const [searchText, setSearchText] = useState("");
  const [routeSearchText, setRouteSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isJakLingko = viewState === "jak-lingko";
  const modaColor = selectedModa ? MODA_COLORS[selectedModa] : "#1A6FBF";
  const modaLabel = selectedModa ? MODA_LABELS[selectedModa] : "";

  const handleModaSelect = (moda: ModaType) => {
    setSelectedModa(moda);
    setSelectedRoute(null);
    setSelectedStop(null);
    setRouteSearchText("");
    if (moda === "JakLingko") {
      setViewState("jak-lingko");
    } else {
      setViewState("daftar-jalur");
    }
  };

  const handleRouteSelect = (route: TransitRoute) => {
    setSelectedRoute(route);
    setSelectedStop(null);
    setViewState("jalur-aktif");
  };

  const handleBackFromJalurAktif = () => {
    setSelectedRoute(null);
    setSelectedStop(null);
    setViewState("daftar-jalur");
  };

  const handleBackToPilihModa = () => {
    setSelectedModa(null);
    setSelectedRoute(null);
    setSelectedStop(null);
    setViewState("pilih-moda");
  };

  const handleOpenSearch = () => {
    setViewState("cari-halte");
    setSearchText("");
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleCloseSearch = () => {
    if (selectedRoute) setViewState("jalur-aktif");
    else if (selectedModa) setViewState(selectedModa === "JakLingko" ? "jak-lingko" : "daftar-jalur");
    else setViewState("pilih-moda");
    setSearchText("");
  };

  const routes = selectedModa && selectedModa !== "JakLingko"
    ? (ROUTE_DATA[selectedModa as Exclude<ModaType, "JakLingko">] || [])
    : [];

  const filteredRoutes = routes.filter((r) =>
    routeSearchText === "" ||
    r.code.toLowerCase().includes(routeSearchText.toLowerCase()) ||
    r.name.toLowerCase().includes(routeSearchText.toLowerCase())
  );

  const searchStops = MOCK_STOPS.filter((s) =>
    searchText.length > 0 && s.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const searchRoutes = MOCK_ROUTES.filter((r) =>
    searchText.length > 0 &&
    (r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.code.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#FFFFFF",
        position: "relative",
      }}
    >
      {/* ── Header / Active Route Strip ── */}
      <AnimatePresence mode="wait">
        {viewState === "cari-halte" ? (
          // Search header
          <motion.div
            key="search-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              height: 56,
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #EEEEED",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 16px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleCloseSearch}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
            >
              <ChevronLeft size={22} color="#3C3C43" strokeWidth={1.5} />
            </button>
            <div
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#F7F7F5",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 12px",
              }}
            >
              <Search size={16} color="#8E8E93" strokeWidth={1.5} />
              <input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cari halte atau nama jalur"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 14,
                  color: "#1C1C1E",
                }}
              />
              {searchText.length > 0 && (
                <button
                  onClick={() => setSearchText("")}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                >
                  <X size={16} color="#8E8E93" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </motion.div>
        ) : viewState === "jalur-aktif" && selectedRoute ? (
          // Active route strip
          <motion.div
            key="route-strip"
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -56, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              height: 52,
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #EEEEED",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <button
                onClick={handleBackFromJalurAktif}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
              >
                <ChevronLeft size={20} color="#3C3C43" strokeWidth={1.5} />
              </button>
              <TransitBadge
                type={selectedModa as "MRT" | "LRT" | "KRL" | "TransJakarta" | "JakLingko" | "Transcity"}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedRoute.code} — {selectedRoute.name}
              </span>
              <span style={{ fontSize: 13, color: "#8E8E93", flexShrink: 0 }}>· {selectedRoute.stops} halte</span>
            </div>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 6, background: "none",
                border: "none", cursor: "pointer", flexShrink: 0, padding: "4px 8px",
              }}
            >
              <ArrowRightLeft size={15} color="#8E8E93" strokeWidth={1.5} />
              <span style={{ fontSize: 12, color: "#3C3C43", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                Ganti arah
              </span>
            </button>
          </motion.div>
        ) : (
          // Default header
          <motion.div
            key="default-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              height: 56,
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #EEEEED",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 600, color: "#1C1C1E" }}>Peta Jalur</span>
            <button
              onClick={handleOpenSearch}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
            >
              <Search size={20} color="#3C3C43" strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chip Row (hidden in cari-halte) ── */}
      {viewState !== "cari-halte" && (
        <div
          style={{
            height: 60,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #EEEEED",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 20px",
            overflowX: "auto",
            flexShrink: 0,
            scrollbarWidth: "none",
          }}
        >
          {MODA_LIST.map((moda) => (
            <ModaChip
              key={moda}
              moda={moda}
              active={selectedModa === moda}
              onClick={() => handleModaSelect(moda)}
            />
          ))}
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", backgroundColor: "#EEE9E0" }}>
        {viewState === "cari-halte" ? (
          /* Search results */
          <div style={{ height: "100%", backgroundColor: "#FFFFFF", overflowY: "auto", paddingBottom: 72 }}>
            {searchText.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#8E8E93" }}>
                <Search size={40} strokeWidth={1} color="#C7C7CC" />
                <span style={{ fontSize: 14, color: "#8E8E93" }}>Ketik nama halte atau jalur</span>
              </div>
            ) : (
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Stop results */}
                {searchStops.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#8E8E93", letterSpacing: "0.8px", marginBottom: 10 }}>
                      HALTE & STASIUN
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {searchStops.map((stop) => (
                        <button
                          key={stop.id}
                          onClick={handleCloseSearch}
                          style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
                            background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                            borderBottom: "1px solid #F2F2F2",
                          }}
                        >
                          <CircleDot size={20} color={stop.color} strokeWidth={1.5} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E", fontFamily: "'Poppins', sans-serif" }}>{stop.name}</div>
                            <div style={{ fontSize: 11, color: "#8E8E93", fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>
                              {stop.moda} · {stop.routes}
                            </div>
                          </div>
                          <ChevronRight size={16} color="#C7C7CC" strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Route results */}
                {searchRoutes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#8E8E93", letterSpacing: "0.8px", marginBottom: 10 }}>
                      JALUR
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {searchRoutes.map((route) => (
                        <button
                          key={route.id}
                          onClick={handleCloseSearch}
                          style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
                            background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                            borderBottom: "1px solid #F2F2F2",
                          }}
                        >
                          <Route size={20} color={route.color} strokeWidth={1.5} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E", fontFamily: "'Poppins', sans-serif" }}>
                              {route.code} — {route.name}
                            </div>
                            <div style={{ fontSize: 11, color: "#8E8E93", fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>
                              {route.moda} · {route.stops} halte
                            </div>
                          </div>
                          <ChevronRight size={16} color="#C7C7CC" strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {searchStops.length === 0 && searchRoutes.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 10 }}>
                    <CircleDot size={40} strokeWidth={1} color="#C7C7CC" />
                    <span style={{ fontSize: 14, color: "#8E8E93" }}>Tidak ditemukan untuk "{searchText}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── Map SVG ── */}
            <TransitMapSVG
              viewState={viewState}
              selectedModa={selectedModa}
              selectedRoute={selectedRoute}
              selectedStop={selectedStop}
              onStopSelect={setSelectedStop}
            />

            {/* ── Pilih Moda Overlay ── */}
            <AnimatePresence>
              {viewState === "pilih-moda" && (
                <motion.div
                  key="pilih-overlay"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: "20px 24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "center",
                    maxWidth: 280,
                    zIndex: 10,
                  }}
                >
                  <Layers size={28} color="#8E8E93" strokeWidth={1.5} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#3C3C43", margin: 0, lineHeight: 1.5 }}>
                      Pilih moda transportasi di atas
                    </p>
                    <p style={{ fontSize: 13, color: "#8E8E93", margin: "4px 0 0", lineHeight: 1.5 }}>
                      untuk melihat jalur dan pemberhentiannya
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Map Controls (jalur-aktif) ── */}
            {viewState === "jalur-aktif" && (
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 140,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  zIndex: 15,
                }}
              >
                {[
                  { icon: Plus, bg: "#FFFFFF", color: "#1C1C1E" },
                  { icon: Minus, bg: "#FFFFFF", color: "#1C1C1E" },
                  { icon: Crosshair, bg: "#1A6FBF", color: "#FFFFFF" },
                ].map(({ icon: Icon, bg, color }, i) => (
                  <button
                    key={i}
                    style={{
                      width: 40, height: 40, borderRadius: "50%", border: "none",
                      backgroundColor: bg, cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon size={20} color={color} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            )}

            {/* ── Daftar Jalur Bottom Sheet ── */}
            <AnimatePresence>
              {viewState === "daftar-jalur" && selectedModa && (
                <motion.div
                  key="daftar-sheet"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  style={{
                    position: "absolute",
                    bottom: 72,
                    left: 0,
                    right: 0,
                    height: 340,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px 20px 0 0",
                    boxShadow: "0 -6px 28px rgba(0,0,0,0.10)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Handle */}
                  <div style={{ flexShrink: 0, padding: "14px 20px 0" }}>
                    <div style={{ width: 40, height: 4, backgroundColor: "#EEEEED", borderRadius: 100, margin: "0 auto 14px" }} />
                    {/* Sheet header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E" }}>
                        Pilih Jalur {modaLabel}
                      </span>
                      <span style={{ fontSize: 12, color: "#8E8E93", fontWeight: 400 }}>
                        {MODA_ROUTE_COUNT[selectedModa]} jalur
                      </span>
                    </div>
                    {/* Search input */}
                    <div
                      style={{
                        height: 40, backgroundColor: "#F7F7F5", borderRadius: 12,
                        display: "flex", alignItems: "center", gap: 8, padding: "0 12px",
                        marginBottom: 12,
                      }}
                    >
                      <Search size={16} color="#8E8E93" strokeWidth={1.5} />
                      <input
                        value={routeSearchText}
                        onChange={(e) => setRouteSearchText(e.target.value)}
                        placeholder="Cari nomor atau nama jalur"
                        style={{
                          flex: 1, border: "none", outline: "none", backgroundColor: "transparent",
                          fontFamily: "'Poppins', sans-serif", fontSize: 13, color: "#1C1C1E",
                        }}
                      />
                    </div>
                  </div>
                  {/* Route list */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {filteredRoutes.length === 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80, color: "#8E8E93", fontSize: 13 }}>
                        Tidak ada jalur ditemukan
                      </div>
                    ) : (
                      filteredRoutes.map((route) => (
                        <RouteCard
                          key={route.id}
                          route={route}
                          color={modaColor}
                          onClick={() => handleRouteSelect(route)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Jak Lingko Zone Sheet ── */}
            <AnimatePresence>
              {viewState === "jak-lingko" && (
                <motion.div
                  key="jaklingko-sheet"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  style={{
                    position: "absolute",
                    bottom: 72,
                    left: 0,
                    right: 0,
                    height: 320,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px 20px 0 0",
                    boxShadow: "0 -6px 28px rgba(0,0,0,0.10)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ flexShrink: 0, padding: "14px 20px 0" }}>
                    <div style={{ width: 40, height: 4, backgroundColor: "#EEEEED", borderRadius: 100, margin: "0 auto 14px" }} />
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E" }}>Pilih Area Layanan Jak Lingko</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#8E8E93", margin: "0 0 14px" }}>
                      Ketuk zona di peta atau pilih dari daftar
                    </p>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {JAK_LINGKO_ZONES.map((zone) => (
                      <ZoneCard key={zone.id} zone={zone} onClick={() => {}} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Collapsed Route Strip (jalur-aktif, no popup) ── */}
            <AnimatePresence>
              {viewState === "jalur-aktif" && selectedRoute && !selectedStop && (
                <motion.div
                  key="collapsed-strip"
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  exit={{ y: 60 }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  style={{
                    position: "absolute",
                    bottom: 72,
                    left: 0,
                    right: 0,
                    height: 52,
                    backgroundColor: "#FFFFFF",
                    borderTop: "1px solid #EEEEED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    zIndex: 20,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#3C3C43", fontFamily: "'Poppins', sans-serif" }}>
                    Semua jalur {modaLabel}
                  </span>
                  <button
                    onClick={handleBackFromJalurAktif}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 13, color: "#1A6FBF", fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                    }}
                  >
                    Ganti jalur
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Stop Popup ── */}
            <AnimatePresence>
              {selectedStop && viewState === "jalur-aktif" && (
                <StopPopup
                  key={selectedStop.id}
                  stop={selectedStop}
                  moda={selectedModa}
                  isJakLingko={false}
                  onClose={() => setSelectedStop(null)}
                  onRute={() => navigate("/route-search")}
                  onSimpan={() => setSelectedStop(null)}
                />
              )}
              {selectedStop && viewState === "jak-lingko" && (
                <StopPopup
                  key={selectedStop.id}
                  stop={selectedStop}
                  moda={selectedModa}
                  isJakLingko={true}
                  onClose={() => setSelectedStop(null)}
                  onRute={() => navigate("/route-search")}
                  onSimpan={() => setSelectedStop(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}
