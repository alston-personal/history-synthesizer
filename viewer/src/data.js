export const mockData = {
  vivotek: [
    {
      date: "2000-02-08",
      event: "VIVOTEK Inc. is founded in Taiwan, launching its quest to become a premier global brand in high-fidelity IP surveillance systems.",
      confidence: 0.95,
      entities: {
        who: ["VIVOTEK", "Taiwan Stock Exchange"],
        what: ["IP surveillance", "Visual Security"],
        where: ["Taiwan"],
        when: "2000-02-08",
        why: "To establish a leading Taiwanese brand in the digital surveillance market."
      },
      sources: [
        { url: "https://www.vivotek.com/about/company-profile", authority: "Official Brand Site", trust: 0.95 }
      ]
    },
    {
      date: "2006-03-01",
      event: "VIVOTEK lists publicly on the Taiwan Stock Exchange (TWSE: 3454), demonstrating solid corporate governance and rapid market expansion.",
      confidence: 0.98,
      entities: {
        who: ["VIVOTEK", "Taiwan Stock Exchange"],
        what: ["IPO", "TWSE: 3454"],
        where: ["Taiwan"],
        when: "2006-03",
        why: "To secure funding for global expansion and research & development."
      },
      sources: [
        { url: "https://www.vivotek.com/about/investor-relations", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/Taiwan_Stock_Exchange", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "2013-05-15",
      event: "Launches revolutionary H.265 compression technology cameras, cutting bandwidth and video storage requirements in half.",
      confidence: 0.95,
      entities: {
        who: ["VIVOTEK"],
        what: ["H.265", "IP Cameras", "Video Compression"],
        where: ["Global"],
        when: "2013-05",
        why: "To solve massive storage costs for enterprise multi-camera systems."
      },
      sources: [
        { url: "https://www.vivotek.com/news/press-releases", authority: "Official Press", trust: 0.95 }
      ]
    },
    {
      date: "2017-09-20",
      event: "Delta Electronics acquires a majority stake in VIVOTEK, integrating smart visual security into Delta's global building automation and green energy grid ecosystem. Notably, Delta is also the primary high-end power supply provider for NVIDIA's AI GPU supercomputers.",
      confidence: 0.99,
      entities: {
        who: ["Delta Electronics", "VIVOTEK", "NVIDIA"],
        what: ["Acquisition", "Smart Buildings", "AI Server Power Supply"],
        where: ["Taiwan", "Global"],
        when: "2017-09",
        why: "To form a powerhouse building automation ecosystem combining smart grids, power control, and visual surveillance."
      },
      sources: [
        { url: "https://www.vivotek.com/news/press-releases", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.bloomberg.com", authority: "Premium Press", trust: 0.80 }
      ]
    },
    {
      date: "2021-10-12",
      event: "Establishes a state-of-the-art automated smart manufacturing center in Taiwan, incorporating advanced robotics and quality assurance pipelines.",
      confidence: 0.95,
      entities: {
        who: ["VIVOTEK"],
        what: ["Smart Manufacturing", "Automation", "Robotics"],
        where: ["Taiwan"],
        when: "2021-10",
        why: "To optimize production supply chains and ensure highest visual security hardware quality."
      },
      sources: [
        { url: "https://www.vivotek.com/about", authority: "Official Brand Site", trust: 0.95 }
      ]
    },
    {
      date: "2024-03-05",
      event: "Launches VORTEX, an advanced Cloud-based Video Surveillance as a Service (VSaaS), integrating deep learning and AI-powered metadata search capabilities.",
      confidence: 0.98,
      entities: {
        who: ["VIVOTEK", "VORTEX"],
        what: ["VORTEX", "Cloud VSaaS", "Deep Learning", "AI Search", "AI"],
        where: ["Global"],
        when: "2024-03",
        why: "To enable seamless cloud surveillance management with hyper-fast attribute search."
      },
      sources: [
        { url: "https://www.vivotek.com/solutions/cloud-vortex", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "Tech Media", trust: 0.70 }
      ]
    }
  ],
  nvidia: [
    {
      date: "1993-04-05",
      event: "NVIDIA is founded by Jensen Huang, Chris Malachowsky, and Curtis Priem with a vision to bring 3D graphics acceleration to the gaming and consumer markets.",
      confidence: 0.95,
      entities: {
        who: ["NVIDIA", "Jensen Huang", "Chris Malachowsky", "Curtis Priem"],
        what: ["3D Graphics", "Gaming"],
        where: ["San Jose"],
        when: "1993-04-05",
        why: "Belief that PC gaming would become a massive industry requiring dedicated graphics compute."
      },
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "Official Brand Site", trust: 0.95 }
      ]
    },
    {
      date: "1999-08-31",
      event: "NVIDIA invents the modern GPU with the GeForce 256, the world's first single-chip processor integrating transform and lighting engines.",
      confidence: 0.99,
      entities: {
        who: ["NVIDIA"],
        what: ["GPU", "GeForce 256", "3D Graphics"],
        where: ["Global"],
        when: "1999-08-31",
        why: "To redefine computer graphics architectures and offload rendering tasks from CPUs."
      },
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/GeForce_256", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "2006-11-01",
      event: "NVIDIA introduces CUDA, a parallel computing platform and programming model that unleashes GPUs for general-purpose high-performance scientific compute.",
      confidence: 0.98,
      entities: {
        who: ["NVIDIA"],
        what: ["CUDA", "GPU", "Parallel Computing"],
        where: ["Global"],
        when: "2006-11-01",
        why: "To transform the GPU into a highly flexible processor for complex mathematical modeling."
      },
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.britannica.com", authority: "Premium Press", trust: 0.80 }
      ]
    },
    {
      date: "2012-09-30",
      event: "The modern Deep Learning AI Revolution kicks off as the AlexNet convolutional neural network uses NVIDIA GPUs to dominate the ImageNet computer vision competition.",
      confidence: 0.97,
      entities: {
        who: ["NVIDIA", "AlexNet"],
        what: ["Deep Learning", "ImageNet", "Computer Vision", "AI"],
        where: ["Toronto", "Global"],
        when: "2012-09-30",
        why: "GPUs provided the massive parallel compute required to train multi-layered deep neural networks."
      },
      sources: [
        { url: "https://www.nytimes.com", authority: "Premium Press", trust: 0.80 },
        { url: "https://techcrunch.com", authority: "Tech Media", trust: 0.70 }
      ]
    },
    {
      date: "2023-05-30",
      event: "NVIDIA breaches a historic $1 trillion market cap, fueled by an explosive global surge in Generative AI infrastructure and H100 GPU data center demands.",
      confidence: 0.99,
      entities: {
        who: ["NVIDIA", "Delta Electronics"],
        what: ["Generative AI", "H100 GPUs", "Market Cap", "AI Server Power Supply", "AI"],
        where: ["Global"],
        when: "2023-05-30",
        why: "Worldwide explosion in LLM training demand, relying extensively on Delta power supplies and NVIDIA Silicon."
      },
      sources: [
        { url: "https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.reuters.com", authority: "Premium Press", trust: 0.80 }
      ]
    },
    {
      date: "2025-07-01",
      event: "NVIDIA hits a historic $4 trillion market capitalization, becoming the world's most valuable public company, driven by its absolute dominance in AI computing architectures.",
      confidence: 0.99,
      entities: {
        who: ["NVIDIA"],
        what: ["Market Cap", "AI Computing", "AI"],
        where: ["Global"],
        when: "2025-07-01",
        why: "Undisputed positioning as the absolute foundation of the global artificial intelligence economy."
      },
      sources: [
        { url: "https://www.bloomberg.com", authority: "Premium Press", trust: 0.80 },
        { url: "https://www.wsj.com", authority: "Premium Press", trust: 0.80 }
      ]
    }
  ],
  openai: [
    {
      date: "2015-12-11",
      event: "OpenAI is established in San Francisco as a non-profit AI research lab by Elon Musk, Sam Altman, Ilya Sutskever, and others, with $1 billion in funding commitments.",
      confidence: 0.98,
      entities: {
        who: ["OpenAI", "Elon Musk", "Sam Altman", "Ilya Sutskever"],
        what: ["AI Research Lab", "Non-Profit", "AI"],
        where: ["San Francisco"],
        when: "2015-12-11",
        why: "To ensure that artificial general intelligence benefits all of humanity, free from commercial constraints."
      },
      sources: [
        { url: "https://openai.com/about/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/OpenAI", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "2018-06-11",
      event: "Introduces GPT-1, showcasing the power of the Generative Pre-trained Transformer architecture to comprehend and generate human-like text.",
      confidence: 0.95,
      entities: {
        who: ["OpenAI"],
        what: ["GPT-1", "Transformer", "LLM"],
        where: ["Global"],
        when: "2018-06-11",
        why: "Demonstrating that unsupervised language pre-training on diverse text corpora yields huge gains."
      },
      sources: [
        { url: "https://openai.com/research/", authority: "Official Brand Site", trust: 0.95 }
      ]
    },
    {
      date: "2019-03-11",
      event: "Transitions to a 'capped-profit' commercial model to attract venture funding and purchase massive supercomputing grids from Microsoft and NVIDIA GPUs.",
      confidence: 0.97,
      entities: {
        who: ["OpenAI", "Microsoft", "NVIDIA"],
        what: ["Restructuring", "Venture Capital", "Supercomputing", "GPU"],
        where: ["San Francisco"],
        when: "2019-03-11",
        why: "Non-profit structure could not secure the billions in computing power required to train frontier models."
      },
      sources: [
        { url: "https://openai.com/blog/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "Tech Media", trust: 0.70 }
      ]
    },
    {
      date: "2020-06-11",
      event: "Releases GPT-3, a massive 175-billion parameter LLM displaying extraordinary writing, coding, and logical prompt reasoning capacities.",
      confidence: 0.95,
      entities: {
        who: ["OpenAI"],
        what: ["GPT-3", "LLM", "AI"],
        where: ["Global"],
        when: "2020-06-11",
        why: "Proving the Scaling Hypothesis—that larger models yield dramatically better cognitive capabilities."
      },
      sources: [
        { url: "https://openai.com/research/", authority: "Official Brand Site", trust: 0.95 }
      ]
    },
    {
      date: "2022-11-30",
      event: "Launches ChatGPT, kicking off the global Generative AI era by acquiring an unprecedented 100 million active users within its first two months.",
      confidence: 0.99,
      entities: {
        who: ["OpenAI", "ChatGPT"],
        what: ["ChatGPT", "Generative AI", "Consumer Web App", "AI"],
        where: ["Global"],
        when: "2022-11-30",
        why: "Bringing an intuitive conversational interface to LLMs, exposing the general public to advanced AI capabilities."
      },
      sources: [
        { url: "https://openai.com/blog/chatgpt", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://nytimes.com", authority: "Premium Press", trust: 0.80 },
        { url: "https://en.wikipedia.org/wiki/ChatGPT", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "2024-09-12",
      event: "Unveils OpenAI o1, introducing deep multi-step reinforcement learning reasoning chains that allow AI to think before responding to complex scientific tasks.",
      confidence: 0.98,
      entities: {
        who: ["OpenAI"],
        what: ["OpenAI o1", "Reinforcement Learning", "AI Reasoning", "AI"],
        where: ["San Francisco", "Global"],
        when: "2024-09-12",
        why: "Pushing AI limits from rapid pattern matching to slow, deliberative reasoning for mathematics and coding."
      },
      sources: [
        { url: "https://openai.com/blog/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://venturebeat.com", authority: "Tech Media", trust: 0.70 }
      ]
    }
  ],
  apple: [
    {
      date: "1976-04-01",
      event: "Apple Computer Company is founded in a garage by Steve Jobs, Steve Wozniak, and Ronald Wayne to assemble and sell the Apple I personal computer kit.",
      confidence: 0.99,
      entities: {
        who: ["Apple", "Steve Jobs", "Steve Wozniak", "Ronald Wayne"],
        what: ["Apple I", "Personal Computer"],
        where: ["Silicon Valley"],
        when: "1976-04-01",
        why: "To democratize computing, transitioning computers from industrial mainframes into consumer home devices."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/Apple_Inc.", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "1984-01-24",
      event: "Steve Jobs unveils the Macintosh, the first commercial personal computer featuring an intuitive Graphical User Interface (GUI) and a desktop mouse.",
      confidence: 0.98,
      entities: {
        who: ["Apple", "Steve Jobs"],
        what: ["Macintosh", "GUI", "Mouse"],
        where: ["Cupertino"],
        when: "1984-01-24",
        why: "To replace complex CLI text commands with friendly visual file systems and windows."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.britannica.com", authority: "Premium Press", trust: 0.80 }
      ]
    },
    {
      date: "1997-09-16",
      event: "Steve Jobs returns as interim CEO, executing one of the most legendary turnaround operations in business history, backed by an elegant 'Think Different' brand ethos.",
      confidence: 0.99,
      entities: {
        who: ["Apple", "Steve Jobs"],
        what: ["Corporate Turnaround", "Think Different"],
        where: ["Cupertino"],
        when: "1997-09-16",
        why: "Saving a near-bankrupt Apple by slashing bloated product lines and refocusing on stellar product design."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.nytimes.com", authority: "Premium Press", trust: 0.80 }
      ]
    },
    {
      date: "2001-10-23",
      event: "Launches the iPod portable music player, revolutionizing the entertainment sector and digitizing music media via the iTunes Store.",
      confidence: 0.97,
      entities: {
        who: ["Apple"],
        what: ["iPod", "iTunes", "Digital Music"],
        where: ["Global"],
        when: "2001-10-23",
        why: "Giving consumers '1,000 songs in your pocket' with a legal, seamless music purchasing network."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://techcrunch.com", authority: "Tech Media", trust: 0.70 }
      ]
    },
    {
      date: "2007-01-09",
      event: "Steve Jobs introduces the iPhone—combining a widescreen iPod, a revolutionary internet communicator, and a cellular phone, establishing the modern smartphone industry.",
      confidence: 0.99,
      entities: {
        who: ["Apple", "Steve Jobs"],
        what: ["iPhone", "Smartphone", "Multi-touch"],
        where: ["San Francisco", "Global"],
        when: "2007-01-09",
        why: "To permanently disrupt mobile phones by replacing physical keypads with an elegant multi-touch glass canvas."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://en.wikipedia.org/wiki/IPhone", authority: "Crowdsourced Reference", trust: 0.85 }
      ]
    },
    {
      date: "2018-08-02",
      event: "Apple becomes the first public U.S. company to cross a $1 trillion market cap, powered by a mature hardware ecosystem and high-margin services.",
      confidence: 0.99,
      entities: {
        who: ["Apple"],
        what: ["Market Cap", "Ecosystem", "Services"],
        where: ["Global"],
        when: "2018-08-02",
        why: "Durable recurring revenues from an integrated ecosystem of hardware, software, and services."
      },
      sources: [
        { url: "https://www.apple.com/newsroom/", authority: "Official Brand Site", trust: 0.95 },
        { url: "https://www.bloomberg.com", authority: "Premium Press", trust: 0.80 }
      ]
    }
  ]
};
