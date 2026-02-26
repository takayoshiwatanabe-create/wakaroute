export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

export const translations: Record<Language, Record<string, string>> = {
  ja: {
    app_name: "学習ステップ分解アプリ：『ワカル・ルート（Wakaroute）』",
    app_subtitle: "「わからない」を恥にしない。戻ることを前進に変える。",
    // Add more Japanese translations here
  },
  en: {
    app_name: "Learning Step Breakdown App: 'Wakaroute'",
    app_subtitle: "Don't be ashamed of 'not knowing'. Turn going back into moving forward.",
    // Add more English translations here
  },
  zh: {
    app_name: "学习步骤分解应用：《Wakaroute》",
    app_subtitle: "不以“不懂”为耻。将后退变为前进。",
    // Add more Chinese translations here
  },
  ko: {
    app_name: "학습 단계 분해 앱: '와카루트'",
    app_subtitle: "'모르는 것'을 부끄러워하지 마세요. 되돌아가는 것을 앞으로 나아가는 것으로 바꾸세요.",
    // Add more Korean translations here
  },
  es: {
    app_name: "Aplicación de Desglose de Pasos de Aprendizaje: 'Wakaroute'",
    app_subtitle: "No te avergüences de 'no saber'. Convierte el retroceso en avance.",
    // Add more Spanish translations here
  },
  fr: {
    app_name: "Application de Décomposition des Étapes d'Apprentissage : 'Wakaroute'",
    app_subtitle: "Ne soyez pas honteux de 'ne pas savoir'. Transformez le retour en progression.",
    // Add more French translations here
  },
  de: {
    app_name: "Lernschritt-Analyse-App: 'Wakaroute'",
    app_subtitle: "Schäme dich nicht dafür, 'es nicht zu wissen'. Verwandle Rückschritte in Fortschritte.",
    // Add more German translations here
  },
  pt: {
    app_name: "Aplicativo de Desagregação de Etapas de Aprendizagem: 'Wakaroute'",
    app_subtitle: "Não se envergonhe de 'não saber'. Transforme o retrocesso em avanço.",
    // Add more Portuguese translations here
  },
  ar: {
    app_name: "تطبيق تحليل خطوات التعلم: 'واكاروت'",
    app_subtitle: "لا تخجل من 'عدم المعرفة'. حوّل التراجع إلى تقدم.",
    // Add more Arabic translations here
  },
  hi: {
    app_name: "सीखने के चरण विश्लेषण ऐप: 'वाकारूट'",
    app_subtitle: "'न जानने' से शर्मिंदा न हों। पीछे हटने को आगे बढ़ने में बदलें।",
    // Add more Hindi translations here
  },
};
