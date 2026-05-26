export const mockData = {
  vivotek: [
    {
      date: "2000-02-08",
      event: "陳文昌（Albert Chen）與多位共同創辦人解創富、駱修賢等共同在台灣創立晶睿通訊（VIVOTEK），立志打造高畫質網路安全監控系統的全球第一品牌。",
      confidence: 0.95,
      entities: {
        who: ["陳文昌", "晶睿通訊"],
        what: ["網路監控", "高畫質安全防護"],
        where: ["台灣"],
        when: "2000-02-08",
        why: "旨在打破傳統類比監控限制，建立台灣自主的全球智慧監控品牌。"
      },
      relationships: [
        { source: "陳文昌", target: "晶睿通訊", label: "創辦人兼董事長" }
      ],
      sources: [
        { url: "https://www.vivotek.com/about/company-profile", authority: "官方公司簡介", trust: 0.95 }
      ]
    },
    {
      date: "2006-03-01",
      event: "晶睿通訊在總經理陳文昌的帶領下，順利於台灣證券交易所公開掛牌上市（股票代號：3454），展現了卓越的公司治理與快速的市場擴張。",
      confidence: 0.98,
      entities: {
        who: ["陳文昌", "晶睿通訊"],
        what: ["公開掛牌上市", "股票代號: 3454"],
        where: ["台灣證券交易所"],
        when: "2006-03-01",
        why: "藉由公開資本市場募集全球擴張與新技術研發所需資金。"
      },
      relationships: [
        { source: "陳文昌", target: "晶睿通訊", label: "推動掛牌上市" }
      ],
      sources: [
        { url: "https://www.vivotek.com/about/investor-relations", authority: "官方投資人關係", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/Taiwan_Stock_Exchange", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "2013-05-15",
      event: "晶睿通訊發表革命性 H.265 影像壓縮技術攝影機，能將網路監控傳輸頻寬與儲存空間減半，奠定智慧安防霸主地位。",
      confidence: 0.95,
      entities: {
        who: ["晶睿通訊"],
        what: ["H.265 壓縮技術", "智慧型網路攝影機"],
        where: ["全球市場"],
        when: "2013-05-15",
        why: "解決企業大規模安防攝影機帶來的高昂頻寬與儲存成本痛點。"
      },
      sources: [
        { url: "https://www.vivotek.com/news/press-releases", authority: "官方新聞稿", trust: 0.95 }
      ]
    },
    {
      date: "2017-09-20",
      event: "台達電子宣佈收購晶睿通訊多數股權，將智慧影像監控無縫整合至台達電創辦人鄭崇華（Bruce Cheng）倡導的智慧綠建築自動化與節能生態系中。",
      confidence: 0.99,
      entities: {
        who: ["鄭崇華", "台達電子", "晶睿通訊"],
        what: ["智慧綠建築", "自動化節能生態系", "多數股權收購"],
        where: ["台灣", "全球市場"],
        when: "2017-09-20",
        why: "結合晶睿通訊的AI監控與台達電的智慧電網控制，打造全方位智慧綠建築平台。"
      },
      relationships: [
        { source: "鄭崇華", target: "台達電子", label: "創辦人" },
        { source: "台達電子", target: "晶睿通訊", label: "策略控股收購" }
      ],
      sources: [
        { url: "https://www.vivotek.com/news/press-releases", authority: "官方新聞稿", trust: 0.95 },
        { url: "https://www.bloomberg.com", authority: "彭博社", trust: 0.80 }
      ]
    },
    {
      date: "2021-10-12",
      event: "晶睿通訊在台灣建立了最先進的自動化智慧製造中心，透過精密機械手臂與AI品管管線，大幅提升監控硬體的組裝效能。",
      confidence: 0.95,
      entities: {
        who: ["晶睿通訊"],
        what: ["自動化智慧製造", "AI視覺品管", "工業機器人"],
        where: ["台灣"],
        when: "2021-10-12",
        why: "在全球供應鏈短缺的背景下，透過台灣本土自動化製造確保高品質硬件供應。"
      },
      sources: [
        { url: "https://www.vivotek.com/about", authority: "官方網站", trust: 0.95 }
      ]
    },
    {
      date: "2024-03-05",
      event: "推出 VORTEX 雲端智慧安全監控服務（VSaaS），深度整合深度學習演算法與AI大數據屬性搜尋，實現秒級車牌與特徵搜尋。",
      confidence: 0.98,
      entities: {
        who: ["晶睿通訊"],
        what: ["VORTEX VSaaS", "深度學習特徵搜尋", "雲端安全監控"],
        where: ["全球市場"],
        when: "2024-03-05",
        why: "因應AI雲端化趨勢，讓用戶無須購買高昂主機即可享受大數據監控搜尋。"
      },
      sources: [
        { url: "https://www.vivotek.com/solutions/cloud-vortex", authority: "官方網站", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "TechCrunch 科技媒體", trust: 0.70 }
      ]
    }
  ],
  nvidia: [
    {
      date: "1993-04-05",
      event: "黃仁勳（Jensen Huang）、川崎克三（Chris Malachowsky）與普里姆（Curtis Priem）共同在矽谷創立輝達（NVIDIA），立志為消費娛樂市場引進強大的 3D 圖形加速技術。",
      confidence: 0.95,
      entities: {
        who: ["黃仁勳", "川崎克三", "普里姆", "輝達"],
        what: ["3D圖形加速", "消費娛樂市場"],
        where: ["聖荷西"],
        when: "1993-04-05",
        why: "他們堅信PC遊戲將成為巨大產業，需要專屬的圖形計算晶片。"
      },
      relationships: [
        { source: "黃仁勳", target: "輝達", label: "創辦人兼執行長" },
        { source: "川崎克三", target: "輝達", label: "共同創辦人" },
        { source: "普里姆", target: "輝達", label: "共同創辦人" }
      ],
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "官方歷史時間軸", trust: 0.95 }
      ]
    },
    {
      date: "1999-08-31",
      event: "輝達發表 GeForce 256，將原本繁雜的幾何轉換與光影引擎整合至單一晶片，發明了現代 GPU（圖形處理器）的概念。",
      confidence: 0.99,
      entities: {
        who: ["輝達"],
        what: ["GeForce 256", "現代GPU處理器"],
        where: ["全球市場"],
        when: "1999-08-31",
        why: "重新定義電腦顯示卡架構，大幅釋放 CPU 負載並帶來逼真的3D效果。"
      },
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "官方歷史時間軸", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/GeForce_256", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "2006-11-01",
      event: "輝達在黃仁勳力排眾議下推出 CUDA 平行運算架構與程式編寫模型，成功將 GPU 解放為通用的高效能數學運算大腦。",
      confidence: 0.98,
      entities: {
        who: ["黃仁勳", "輝達"],
        what: ["CUDA運算平台", "GPU平行運算"],
        where: ["全球市場"],
        when: "2006-11-01",
        why: "為將來的超級運算、氣象預測以及人工智慧訓練奠定算力基礎。"
      },
      relationships: [
        { source: "黃仁勳", target: "輝達", label: "推動CUDA平台" }
      ],
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "官方歷史時間軸", trust: 0.95 },
        { url: "https://www.britannica.com", authority: "大英百科全書", trust: 0.80 }
      ]
    },
    {
      date: "2012-09-30",
      event: "深度學習學者克里熱夫斯基（Alex Krizhevsky）帶領的研究團隊，使用輝達 GPU 訓練 AlexNet 神經網路，在 ImageNet 大賽中以壓倒性優勢奪冠，引爆現代 AI 革命。",
      confidence: 0.97,
      entities: {
        who: ["克里熱夫斯基", "輝達"],
        what: ["AlexNet卷積神經網路", "深度學習革命", "ImageNet大賽"],
        where: ["多倫多", "全球市場"],
        when: "2012-09-30",
        why: "輝達 GPU 的平行運算晶片，提供了訓練大規模神經網路不可或缺的龐大算力。"
      },
      relationships: [
        { source: "克里熱夫斯基", target: "輝達", label: "使用GPU加速訓練" }
      ],
      sources: [
        { url: "https://www.nytimes.com", authority: "紐約時報", trust: 0.80 },
        { url: "https://techcrunch.com", authority: "TechCrunch", trust: 0.70 }
      ]
    },
    {
      date: "2023-05-30",
      event: "輝達市值突破歷史性的 1 兆美元。台達電子創辦人鄭崇華宣佈，台達電全力支援輝達 AI 伺服器，為 H100 等 GPU 超級電腦提供高瓦特數核心電源供應器。",
      confidence: 0.99,
      entities: {
        who: ["黃仁勳", "鄭崇華", "輝達", "台達電子"],
        what: ["1兆美元市值", "AI伺服器高瓦特電源", "H100 GPU"],
        where: ["全球市場"],
        when: "2023-05-30",
        why: "全球生成式AI爆發，輝達晶片供不應求，需要台達電頂級電源技術穩定提供極限能效。"
      },
      relationships: [
        { source: "鄭崇華", target: "台達電子", label: "創辦人" },
        { source: "台達電子", target: "輝達", label: "供應伺服器電源" },
        { source: "黃仁勳", target: "輝達", label: "引領市值突破" }
      ],
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "官方網站", trust: 0.95 },
        { url: "https://www.reuters.com", authority: "路透社", trust: 0.80 }
      ]
    },
    {
      date: "2025-07-01",
      event: "輝達市值達到史無前例的 4 兆美元，超越蘋果成為全球最具價值的上市企業，徹底確立其在人工智慧硬體架構的絕對統治權。",
      confidence: 0.99,
      entities: {
        who: ["黃仁勳", "輝達"],
        what: ["4兆美元市值", "AI晶片生態系"],
        where: ["全球市場"],
        when: "2025-07-01",
        why: "輝達憑藉 CUDA 與頂級伺服器架構，築起極難跨越的技術護城河。"
      },
      relationships: [
        { source: "黃仁勳", target: "輝達", label: "帶領稱霸全球市值" }
      ],
      sources: [
        { url: "https://www.bloomberg.com", authority: "彭博社", trust: 0.80 },
        { url: "https://www.wsj.com", authority: "華爾街日報", trust: 0.80 }
      ]
    }
  ],
  openai: [
    {
      date: "2015-12-11",
      event: "山姆·奧特曼（Sam Altman）、伊隆·馬斯克（Elon Musk）與伊利亞·蘇茨克維（Ilya Sutskever）在舊金山共同成立非營利組織 OpenAI，致力於推動通用人工智慧（AGI）造福全人類。",
      confidence: 0.98,
      entities: {
        who: ["奧特曼", "馬斯克", "蘇茨克維", "OpenAI"],
        what: ["非營利AI實驗室", "AGI造福全人類"],
        where: ["舊金山"],
        when: "2015-12-11",
        why: "為了防止人工智慧技術被大型私有企業壟斷，確保AI發展方向與人類福祉保持一致。"
      },
      relationships: [
        { source: "奧特曼", target: "OpenAI", label: "共同創辦人兼CEO" },
        { source: "馬斯克", target: "OpenAI", label: "創始投資人" },
        { source: "蘇茨克維", target: "OpenAI", label: "聯合創辦人兼首席科學家" }
      ],
      sources: [
        { url: "https://openai.com/about/", authority: "官方簡介", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/OpenAI", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "2018-06-11",
      event: "OpenAI 發表第一代生成式預訓練 Transformer 模型 GPT-1，展示了透過無監督預訓練讓機器理解並生成自然語言的巨大潛力。",
      confidence: 0.95,
      entities: {
        who: ["OpenAI"],
        what: ["GPT-1 模型", "Transformer 架構", "自然語言處理"],
        where: ["全球市場"],
        when: "2018-06-11",
        why: "證明採用自回歸語意建模，可以在無需大量人工標註的情況下產生高水準認知。"
      },
      sources: [
        { url: "https://openai.com/research/", authority: "官方研究", trust: 0.95 }
      ]
    },
    {
      date: "2019-03-11",
      event: "在執行長奧特曼的主導下，OpenAI 轉型為「限制利潤」商業公司，隨後成功爭取微軟（Microsoft）的戰略投資，並向輝達（NVIDIA）大量採購 GPU 運算晶片。",
      confidence: 0.97,
      entities: {
        who: ["奧特曼", "微軟", "輝達", "OpenAI"],
        what: ["商業公司轉型", "戰略投資合作", "GPU 算力採購"],
        where: ["舊金山"],
        when: "2019-03-11",
        why: "原先非營利組織結構，無法負擔訓練前沿大語言模型高達數十億美元的算力成本。"
      },
      relationships: [
        { source: "奧特曼", target: "OpenAI", label: "主導商業化轉型" },
        { source: "微軟", target: "OpenAI", label: "策略性戰略投資" },
        { source: "輝達", target: "OpenAI", label: "算力晶片供應商" }
      ],
      sources: [
        { url: "https://openai.com/blog/", authority: "官方部落格", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "TechCrunch", trust: 0.70 }
      ]
    },
    {
      date: "2020-06-11",
      event: "OpenAI 推出擁有 1,750 億參數的超大型語言模型 GPT-3，展現出驚人的代碼寫作、詩歌創作與邏輯推理能力。",
      confidence: 0.95,
      entities: {
        who: ["OpenAI"],
        what: ["GPT-3 語言模型", "大語言模型推理"],
        where: ["全球市場"],
        when: "2020-06-11",
        why: "證明「尺度定律（Scaling Hypothesis）」的正確性：模型規模越大，湧現的智慧越強。"
      },
      sources: [
        { url: "https://openai.com/research/", authority: "官方研究", trust: 0.95 }
      ]
    },
    {
      date: "2022-11-30",
      event: "由執行長奧特曼與團隊推出 ChatGPT 聊天機器人，引爆全球生成式 AI 狂潮，並在短短兩個月內累積了史無前例的 1 億名活躍用戶。",
      confidence: 0.99,
      entities: {
        who: ["奧特曼", "OpenAI"],
        what: ["ChatGPT 智慧交談", "生成式AI熱潮"],
        where: ["全球市場"],
        when: "2022-11-30",
        why: "提供簡單易用的聊天介面，使大語言模型的極限能力能直接與公眾零距離接觸。"
      },
      relationships: [
        { source: "奧特曼", target: "OpenAI", label: "主導推動發布" }
      ],
      sources: [
        { url: "https://openai.com/blog/chatgpt", authority: "官方發布資訊", trust: 0.95 },
        { url: "https://nytimes.com", authority: "紐約時報", trust: 0.80 },
        { url: "https://en.wikipedia.org/wiki/ChatGPT", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "2024-09-12",
      event: "OpenAI 發表全新強化學習推理模型 OpenAI o1，能在回答複雜科學、數學與寫作任務前進行深度「思維鏈」自我修正推理。",
      confidence: 0.98,
      entities: {
        who: ["奧特曼", "OpenAI"],
        what: ["OpenAI o1 推理大腦", "自我修正強化學習"],
        where: ["舊金山", "全球市場"],
        when: "2024-09-12",
        why: "引領人工智慧技術從快速的直覺模式匹配，跨入慢速、嚴謹的自主思維推理階段。"
      },
      relationships: [
        { source: "奧特曼", target: "OpenAI", label: "帶領推出推理模型" }
      ],
      sources: [
        { url: "https://openai.com/blog/", authority: "官方部落格", trust: 0.95 },
        { url: "https://venturebeat.com", authority: "VentureBeat", trust: 0.70 }
      ]
    }
  ],
  apple: [
    {
      date: "1976-04-01",
      event: "史蒂夫·賈伯斯（Steve Jobs）、史蒂夫·沃茲尼克（Steve Wozniak）與羅納德·韋恩（Ronald Wayne）共同在車庫成立蘋果電腦（Apple Computer），手工組裝並銷售首款 Apple I 個人電腦套件。",
      confidence: 0.99,
      entities: {
        who: ["賈伯斯", "沃茲尼克", "韋恩", "蘋果電腦"],
        what: ["Apple I 個人電腦", "車庫手工組裝"],
        where: ["矽谷"],
        when: "1976-04-01",
        why: "推廣個人電腦平民化，將原屬於軍工廠或大企業的計算機引進家庭生活。"
      },
      relationships: [
        { source: "賈伯斯", target: "蘋果電腦", label: "創辦人兼執行長" },
        { source: "沃茲尼克", target: "蘋果電腦", label: "共同創辦人兼天才工程師" },
        { source: "韋恩", target: "蘋果電腦", label: "共同創辦人" }
      ],
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/Apple_Inc.", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "1984-01-24",
      event: "執行長賈伯斯大膽發表初代麥金塔（Macintosh）電腦，成為全球首款具備親切圖形使用者介面（GUI）與滑鼠的劃時代商用個人電腦。",
      confidence: 0.98,
      entities: {
        who: ["賈伯斯", "蘋果電腦"],
        what: ["Macintosh 圖形電腦", "滑鼠操作與GUI"],
        where: ["庫比蒂諾"],
        when: "1984-01-24",
        why: "以親切的圖形視窗和滑鼠，徹底取代難懂複雜的命令行指令介面。"
      },
      relationships: [
        { source: "賈伯斯", target: "蘋果電腦", label: "親自發布麥金塔" }
      ],
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://www.britannica.com", authority: "大英百科全書", trust: 0.80 }
      ]
    },
    {
      date: "1997-09-16",
      event: "賈伯斯在蘋果瀕臨破產時重掌大權擔任臨時 CEO，力主精簡 bloated 的產品線，並以著名的「Think Different（不同凡想）」全新品牌廣告重塑蘋果靈魂。",
      confidence: 0.99,
      entities: {
        who: ["賈伯斯", "蘋果電腦"],
        what: ["破產危機重整", "Think Different 精神"],
        where: ["庫比蒂諾"],
        when: "1997-09-16",
        why: "砍掉無利可圖的冗餘產品，專注於極致美學與極簡的頂級硬體設計。"
      },
      relationships: [
        { source: "賈伯斯", target: "蘋果電腦", label: "傳奇回歸拯救破產" }
      ],
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://www.nytimes.com", authority: "紐約時報", trust: 0.80 }
      ]
    },
    {
      date: "2001-10-23",
      event: "蘋果推出 iPod 隨身聽，並透過 iTunes 數位音樂商店整合，徹底顛覆全球傳統唱片娛樂與音樂發行生態系。",
      confidence: 0.97,
      entities: {
        who: ["蘋果電腦"],
        what: ["iPod 隨身聽", "iTunes 數位商店", "數位音樂革命"],
        where: ["全球市場"],
        when: "2001-10-23",
        why: "實現「把 1,000 首歌裝進你的口袋」，建立線上合法購買單曲的音樂生態系。"
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "TechCrunch", trust: 0.70 }
      ]
    },
    {
      date: "2007-01-09",
      event: "賈伯斯親自發表第一代 iPhone，完美將大螢幕觸控 iPod、網頁瀏覽器與行動電話合而為一，徹底拉開現代智慧型手機時代的序幕。",
      confidence: 0.99,
      entities: {
        who: ["賈伯斯", "蘋果電腦"],
        what: ["第一代 iPhone", "多點觸控螢幕", "行動軟體生態系"],
        where: ["舊金山", "全球市場"],
        when: "2007-01-09",
        why: "大膽取消實體鍵盤，用一整塊多點觸控玻璃讓使用者手指直接操控螢幕。"
      },
      relationships: [
        { source: "賈伯斯", target: "蘋果電腦", label: "發布第一代iPhone" }
      ],
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/IPhone", authority: "維基百科", trust: 0.85 }
      ]
    },
    {
      date: "2018-08-02",
      event: "蘋果成為全美首家市值突破 1 兆美元的上市公司，高毛利的軟體服務生態系配合成熟的硬件硬實力，創下商業史最高紀錄。",
      confidence: 0.99,
      entities: {
        who: ["蘋果電腦"],
        what: ["1兆美元市值", "高毛利服務生態系"],
        where: ["全球市場"],
        when: "2018-08-02",
        why: "硬體出貨穩定，Apple Music, iCloud, App Store 等服務帶來持久重複性收入。"
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "官方新聞中心", trust: 0.95 },
        { url: "https://www.bloomberg.com", authority: "彭博社", trust: 0.80 }
      ]
    }
  ]
};
