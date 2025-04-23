export const ADDICTION_TYPES = [
  {
    id: "sigara",
    name: "Sigara",
    description: "Sigarayı bırakmak için",
    dailyAmount: 20,
    unit: "adet",
    healthBenefits: [
      { day: 1, benefit: "Kan basıncın normale dönmeye başladı" },
      { day: 2, benefit: "Tat ve koku duyuların iyileşmeye başladı" },
      { day: 3, benefit: "Akciğerlerin temizlenmeye başladı" },
      { day: 7, benefit: "Solunum yolların rahatlamaya başladı" },
      { day: 14, benefit: "Dolaşımın iyileşti, daha kolay nefes alıyorsun" },
      { day: 30, benefit: "Öksürük ve yorgunluk azaldı" },
      { day: 90, benefit: "Akciğer fonksiyonların %30 arttı" },
      { day: 365, benefit: "Kalp krizi riskin %50 azaldı" },
    ]
  },
  {
    id: "alkol",
    name: "Alkol",
    description: "Alkolü bırakmak için",
    dailyAmount: 3,
    unit: "içki",
    healthBenefits: [
      { day: 1, benefit: "Vücudun alkolü atmaya başladı" },
      { day: 3, benefit: "Uyku kalitenin artmaya başladı" },
      { day: 7, benefit: "Daha iyi odaklanabiliyorsun" },
      { day: 14, benefit: "Karaciğerin iyileşmeye başladı" },
      { day: 30, benefit: "Cilt tonun iyileşti, daha enerjiksin" },
      { day: 90, benefit: "Karaciğer fonksiyonların normale döndü" },
      { day: 180, benefit: "Bağışıklık sistemin güçlendi" },
      { day: 365, benefit: "Karaciğer hasarı riskin önemli ölçüde azaldı" },
    ]
  },
  {
    id: "kumar",
    name: "Kumar",
    description: "Kumar bağımlılığını yenmek için",
    dailyAmount: 1,
    unit: "oturum",
    healthBenefits: [
      { day: 1, benefit: "Finansal kayıpları durdurdun" },
      { day: 7, benefit: "Stres seviyen düşmeye başladı" },
      { day: 14, benefit: "Aile ilişkilerin iyileşmeye başladı" },
      { day: 30, benefit: "Finansal durumun iyileşmeye başladı" },
      { day: 90, benefit: "Daha sağlıklı düşünce kalıpları geliştirdin" },
      { day: 180, benefit: "Kendine olan güvenin arttı" },
      { day: 365, benefit: "Finansal özgürlüğe doğru ilerliyorsun" },
    ]
  },
  {
    id: "kafein",
    name: "Kafein",
    description: "Kafein tüketimini azaltmak için",
    dailyAmount: 4,
    unit: "içecek",
    healthBenefits: [
      { day: 1, benefit: "Yoksunluk belirtileri başladı (geçici)" },
      { day: 3, benefit: "Baş ağrıların azalmaya başladı" },
      { day: 7, benefit: "Uyku kalitenin artmaya başladı" },
      { day: 14, benefit: "Anksiyete seviyen düştü" },
      { day: 30, benefit: "Kan basıncın düşmeye başladı" },
      { day: 90, benefit: "Daha dengeli enerji seviyelerine sahipsin" },
    ]
  },
  {
    id: "seker",
    name: "Şeker",
    description: "Şeker tüketimini azaltmak için",
    dailyAmount: 5,
    unit: "porsiyon",
    healthBenefits: [
      { day: 3, benefit: "Şeker isteğin azalmaya başladı" },
      { day: 7, benefit: "Enerji seviyen daha dengeli" },
      { day: 14, benefit: "Cilt durumun iyileşmeye başladı" },
      { day: 30, benefit: "Kilo vermeye başladın" },
      { day: 90, benefit: "Kan şekerin dengelendi" },
    ]
  },
  {
    id: "diger",
    name: "Diğer",
    description: "Başka bir bağımlılık için",
    dailyAmount: 1,
    unit: "kez",
    healthBenefits: [
      { day: 1, benefit: "İlk adımı attın!" },
      { day: 7, benefit: "Bir haftayı başarıyla tamamladın" },
      { day: 30, benefit: "Bir ayı geride bıraktın" },
      { day: 90, benefit: "Üç ay temiz kaldın" },
      { day: 180, benefit: "Altı ay oldu, harika gidiyorsun!" },
      { day: 365, benefit: "Bir yılı tamamladın, inanılmazsın!" },
    ]
  },
];