import type { FakeUser } from "./fakeUsers";
import { fakeUsers } from "./fakeUsers";

export type SocialNotifKind =
  | "like"
  | "save"
  | "comment"
  | "follow"
  | "popular"
  | "react"
  | "mention";

export type SocialNotification = {
  id: string;
  kind: SocialNotifKind;
  user: FakeUser;
  /** Optional secondary user when "x and 3 others did Y" */
  othersCount?: number;
  memorySnippet?: string;
  commentText?: string;
  timeAgo: string;
  unread?: boolean;
};

const u = (name: string) => fakeUsers.find((f) => f.username === name)!;

export const socialNotifications: SocialNotification[] = [
  {
    id: "s1",
    kind: "like",
    user: u("ayse.k"),
    memorySnippet: "Bu sokak gece daha güzel.",
    timeAgo: "2 dakika önce",
    unread: true,
  },
  {
    id: "s2",
    kind: "save",
    user: u("mehmet_g"),
    memorySnippet: "Burada bekledim, gelmedi.",
    timeAgo: "12 dakika önce",
    unread: true,
  },
  {
    id: "s3",
    kind: "comment",
    user: u("elif.dem"),
    commentText: "Bu hissi çok iyi biliyorum.",
    memorySnippet: "Bir kahvenin ardından unutulmamış bir cümle.",
    timeAgo: "27 dakika önce",
    unread: true,
  },
  {
    id: "s4",
    kind: "follow",
    user: u("can_y"),
    timeAgo: "1 saat önce",
    unread: true,
  },
  {
    id: "s5",
    kind: "popular",
    user: u("ayse.k"),
    memorySnippet: "İlk öpücüğümüz buradaydı.",
    timeAgo: "2 saat önce",
    othersCount: 156,
  },
  {
    id: "s6",
    kind: "react",
    user: u("ahmet.k"),
    othersCount: 3,
    memorySnippet: "Çocukluğumun parkı, kimse yok artık.",
    timeAgo: "4 saat önce",
  },
  {
    id: "s7",
    kind: "save",
    user: u("ece.sezgin"),
    memorySnippet: "Vapur kornası — şehrin nefesi.",
    timeAgo: "6 saat önce",
  },
  {
    id: "s8",
    kind: "like",
    user: u("mert.az"),
    othersCount: 4,
    memorySnippet: "Buradan İstanbul'a baktım, susmuştu.",
    timeAgo: "8 saat önce",
  },
  {
    id: "s9",
    kind: "comment",
    user: u("naz.ozkan"),
    commentText: "Burayı her zaman özlüyorum.",
    memorySnippet: "Sahil bandında yürürken kalbimi unuttum.",
    timeAgo: "dün",
  },
  {
    id: "s10",
    kind: "follow",
    user: u("deniz_b"),
    timeAgo: "dün",
  },
  {
    id: "s11",
    kind: "popular",
    user: u("ayse.k"),
    memorySnippet: "Sokak müzisyeni Cem Karaca çaldı.",
    timeAgo: "2 gün önce",
    othersCount: 73,
  },
  {
    id: "s12",
    kind: "like",
    user: u("selin.a"),
    othersCount: 11,
    memorySnippet: "Burada uzun zaman sustum.",
    timeAgo: "3 gün önce",
  },
  {
    id: "s13",
    kind: "follow",
    user: u("kerem.t"),
    timeAgo: "4 gün önce",
  },
  {
    id: "s14",
    kind: "react",
    user: u("berke.y"),
    othersCount: 6,
    memorySnippet: "Eski bir camın ardındaki ışık.",
    timeAgo: "1 hafta önce",
  },
];

export function socialNotifVerb(kind: SocialNotifKind): string {
  switch (kind) {
    case "like":    return "anına beğeni bıraktı";
    case "save":    return "anını sakladı";
    case "comment": return "anına yorum yaptı";
    case "follow":  return "seni takip etmeye başladı";
    case "popular": return "anın yayılıyor";
    case "react":   return "anına tepki verdi";
    case "mention": return "seni bir anıda bahsetti";
  }
}
