/**
 * Multilingual dictionary + language switcher
 * Languages: en | zh | zh-Hant | ja
 */
(function () {
  "use strict";

  const STORAGE_KEY = "hf-lang";
  const SUPPORTED = ["en", "zh", "zh-Hant", "ja"];

  const dict = {
    en: {
      skip: "Skip to content",
      brand: "Haowei Fan",
      brandZh: "Haowei Fan",
      "nav.about": "About",
      "nav.updates": "Updates",
      "nav.aiViews": "AI Views",
      "nav.writing": "Essays",
      "nav.notes": "Notes",
      "nav.experience": "Experience",
      "nav.education": "Education",
      "nav.publications": "Publications",
      "nav.projects": "Projects",
      "nav.skills": "Skills",
      "nav.achievements": "Achievements",
      "nav.contact": "Contact",
      menuToggle: "Open menu",
      themeToggle: "Toggle light / dark theme",

      "aiViews.label": "AI",
      "aiViews.title": "AI-Assisted Insights",
      "aiViews.desc":
        "AI-assisted observations on industries and the world.",
      "aiViews.descHome":
        "Latest AI-assisted insights. Open any card for the full piece.",
      "aiViews.viewAll": "View all",
      "aiViews.readMore": "Read more →",
      "aiViews.empty": "No posts yet.",
      "aiViews.loading": "Loading…",
      "aiViews.error": "Could not load content. Try again later.",
      "aiViews.backHome": "← Back to home",
      "aiViews.backList": "← All AI views",
      "aiViews.missingSlug": "No article selected.",
      "aiViews.notFound": "Article not found.",
      documentTitleAiViews: "AI Views · Haowei Fan",

      "writing.label": "Essays",
      "writing.title": "Essays",
      "writing.desc": "Personal essays and short pieces.",
      "writing.descHome":
        "Latest personal essays. Open any card for the full piece.",
      "writing.viewAll": "View all essays",
      "writing.readMore": "Read more →",
      "writing.empty": "No essays yet.",
      "writing.loading": "Loading…",
      "writing.error": "Could not load essays. Try again later.",
      "writing.backHome": "← Back to home",
      "writing.backList": "← All essays",
      "writing.missingSlug": "No article selected.",
      "writing.notFound": "Article not found.",
      documentTitleWriting: "Essays · Haowei Fan",

      "notes.label": "Notes",
      "notes.title": "Notes",
      "notes.desc": "Study notes and learning logs.",
      "notes.descHome":
        "Latest study notes. Open any card for the full piece.",
      "notes.viewAll": "View all notes",
      "notes.readMore": "Read more →",
      "notes.empty": "No notes yet.",
      "notes.loading": "Loading…",
      "notes.error": "Could not load notes. Try again later.",
      "notes.backHome": "← Back to home",
      "notes.backList": "← All notes",
      "notes.missingSlug": "No article selected.",
      "notes.notFound": "Article not found.",
      documentTitleNotes: "Notes · Haowei Fan",

      "updates.label": "News",
      "updates.title": "Updates",
      "updates.desc": "Personal activities and recent notes.",
      "updates.viewAll": "View all updates",
      "updates.empty": "No updates yet.",
      "updates.loading": "Loading…",
      "updates.error": "Could not load updates. Try again later.",
      "updates.backHome": "← Back to home",
      documentTitleUpdates: "Updates · Haowei Fan",

      "hero.eyebrow": "PhD Candidate · Theoretical Physics",
      "hero.name": "Haowei Fan",
      "hero.subtitle":
        "From quantum physics to the real world",
      "hero.lead":
        "PhD student in Theoretical Physics. I hope to use knowledge and cognition as leverage in financial markets — expanding personal boundaries and breaking through in value creation.",
      "hero.ctaProjects": "View Projects",
      "hero.ctaContact": "Get in Touch",

      "about.label": "About",
      "about.title": "Profile",
      "about.body":
        "I am a PhD candidate in Theoretical Physics. My research spans quantum theory, low-dimensional systems, stochastic processes, high-performance scientific computing, and large-scale Python/MATLAB modeling. That training — structured analysis, breaking down complex problems, and turning data and models into clear conclusions — is what I now bring to industry research, financial markets, and other real-world questions.",

      "experience.label": "Career",
      "experience.title": "Experience",
      "exp.yunrui.date": "July 2026 – October 2026",
      "exp.yunrui.role": "Investment Research Intern",
      "exp.yunrui.org": "Yunrui Capital, Shenzhen",
      "exp.yunrui.b1":
        "Built ABS cash-flow waterfall models and ran IRR, sensitivity, and scenario analysis for investment review.",
      "exp.yunrui.b2":
        "Explored generative-AI applications in research workflows and built an internal news-push tool.",
      "exp.yunrui.b3":
        "Worked on post-Pre-A due diligence: comparable-company analysis, multiples-based valuation with revenue forecasts, on-site interviews, and a full DD report.",
      "exp.ngi.date": "June 2025 – November 2025",
      "exp.ngi.role": "Visiting Scholar",
      "exp.ngi.org": "National Graphene Institute, UK",
      "exp.ngi.b1":
        "Investigated the relation and distinction between quantum and classical chaos in a periodically driven dissipative spin model.",
      "exp.ngi.b2":
        "Built computational models for tetralayer graphene incorporating self-consistent Hartree potentials.",
      "exp.ngi.b3":
        "Studied different Hartree corrections for two-dimensional systems theoretically.",
      "exp.pwc.date": "August 2021 – July 2022",
      "exp.pwc.role": "Financial Audit",
      "exp.pwc.org": "PwC Shanghai",
      "exp.pwc.b1":
        "Performed company and fund audits for public and private fund clients, including capital verification for newly raised funds.",
      "exp.pwc.b2":
        "Worked on year-end audits and fund reports for large engagements including Penghua Fund, Morgan Stanley Huaxin Fund, and Haitong Securities.",
      "exp.pwc.b3":
        "Evaluated risk-control and compliance frameworks, gaining exposure to financial reporting and regulatory processes.",
      "exp.orient.date": "October 2018 – February 2019",
      "exp.orient.role": "Assistant Intern, Custody Department",
      "exp.orient.org": "Orient Securities, Shanghai",
      "exp.orient.b1":
        "Archived fund custody documents — account-opening receipts, fundraising records, and account-closure receipts — and processed custody account opening and closure.",

      "education.label": "Academic",
      "education.title": "Education",
      "edu.phd.degree": "PhD in Theoretical Physics",
      "edu.phd.school": "City University of Hong Kong",
      "edu.msc.degree": "MSc in Applied Physics (Distinction)",
      "edu.msc.school": "City University of Hong Kong",
      "edu.bsc.degree": "BSc in Applied Chemistry (First Class)",
      "edu.bsc.school": "Tongji University",

      "publications.label": "Research",
      "publications.title": "Publications",
      "publications.view": "View on arXiv →",

      "projects.label": "Selected Work",
      "projects.title": "Projects",
      "proj.multiposition.title":
        "MultiPosition — Multi-Target Co-occurrence Regions",
      "proj.multiposition.tag": "Web Tool · Geospatial · Clustering",
      "proj.multiposition.b1":
        "Built a pure front-end tool that finds urban areas where multiple POI types co-occur (e.g. café + EV store).",
      "proj.multiposition.b2":
        "Combined Amap POI search with client-side DBSCAN clustering and match-score ranking.",
      "proj.multiposition.b3":
        "Shipped as a static GitHub Pages app with map visualization and city / nearby search modes.",
      "proj.multiposition.demo": "Live demo →",
      "proj.multiposition.repo": "GitHub →",
      "proj.chaos.title": "Chaos in Periodically Driven Dissipative Spin Systems",
      "proj.chaos.tag": "Quantum Dynamics · HPC",
      "proj.chaos.b1":
        "Compared quantum and classical chaos in a periodically driven dissipative spin model.",
      "proj.chaos.b2":
        "Computed Lyapunov exponents; contrasted thermodynamic classical limits with finite-size quantum behaviour.",
      "proj.chaos.b3":
        "Implemented large-scale matrix evolution and parallelized Python/MATLAB simulations.",
      "proj.mient.title": "Measurement-Induced Entanglement Transition",
      "proj.mient.tag": "Free Fermions · Stochastic Dynamics",
      "proj.mient.b1":
        "Studied entanglement transitions in free-fermion chains under Brownian-noise stochastic Schrödinger evolution.",
      "proj.mient.b2":
        "Analysed volume-law vs area-law bipartite entropy as measurement and potential strength vary.",
      "proj.mient.b3":
        "Built numerical solvers for stochastic differential equations and random dynamical evolution.",
      "proj.graphene.title": "Tetralayer Graphene Hartree Modelling",
      "proj.graphene.tag": "Self-Consistent Field · Materials",
      "proj.graphene.b1":
        "Built computational models for four-layer graphene with self-consistent Hartree potentials.",
      "proj.graphene.b2":
        "Solved layer-dependent potentials and electronic structure under iterative SCF frameworks.",
      "proj.graphene.b3":
        "Developed iterative self-consistent optimization algorithms for complex multiparameter systems.",

      "skills.label": "Toolkit",
      "skills.title": "Skills",
      "skills.prog": "Programming",
      "skills.math": "Mathematics",
      "skills.lang": "Languages",
      "skills.math.prob": "Probability",
      "skills.math.stoch": "Stochastic calculus",
      "skills.math.num": "Numerical analysis",
      "skills.math.la": "Linear algebra",
      "skills.math.game": "Game theory",
      "skills.lang.zh": "Mandarin",
      "skills.lang.en": "English",
      "skills.lang.sh": "Shanghainese",
      "skills.lang.yue": "Cantonese",
      "skills.lang.ja": "Japanese",

      "teaching.label": "Community",
      "teaching.title": "Teaching & Conferences",
      "teaching.ta": "Teaching Assistant",
      "teaching.conf": "Conferences",
      "teaching.t1": "Introductory Classical Mechanics",
      "teaching.t2": "Foundation Physics",
      "teaching.t3": "Foundation Physics, General Physics I",
      "teaching.c1":
        "Joint Annual Conference of Physical Societies in Guangdong–Hong Kong–Macao Greater Bay Area · CityU Hong Kong",
      "teaching.c2":
        "Department of Physics & Astronomy Postgraduate Research Conference · University of Manchester, UK",

      "achievements.label": "Highlights",
      "achievements.title": "Achievements & Certificates",
      "ach.cube.title": "Rubik’s Cube",
      "ach.cube.body":
        "3 Asian records and 11 national records; 48 gold, 21 silver, and 24 bronze medals in WCA competitions — pattern recognition, problem-solving, and cognitive agility under pressure.",
      "ach.cube.link": "WCA Profile →",
      "ach.cert.title": "Certificates",
      "ach.cert.cfa": "CFA Sustainable Investment Certificate (ESG)",
      "ach.cert.sac": "Securities Qualification Certificate (SAC)",

      "contact.label": "Connect",
      "contact.title": "Contact",
      "contact.desc":
        "Open to conversations about research, markets, and related opportunities.",
      "contact.email": "Email",
      "contact.linkedin": "Haowei Fan",
      "contact.form.name": "Name",
      "contact.form.email": "Your email",
      "contact.form.message": "Message",
      "contact.form.submit": "Send Message",
      "contact.form.mailto": "Email directly",
      "contact.form.placeholder":
        "The form is not connected yet. Please email hwfan0930@gmail.com — thanks for reaching out!",
      "contact.form.validation": "Please fill in all fields with a valid email.",
      "contact.form.errName": "Please enter your name.",
      "contact.form.errEmail": "Please enter a valid email address.",
      "contact.form.errMessage": "Please enter a message.",

      "footer.copy": "© 2026 Haowei Fan. All rights reserved.",
      "footer.credit":
        'Built with <a href="https://x.ai/grok" target="_blank" rel="noopener noreferrer">Grok Build</a> · Design system informed by <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noopener noreferrer">ui-ux-pro-max</a>',
      "footer.updated": "Last updated: September 2026",
      documentTitle: "Haowei Fan · Personal Homepage",
    },

    zh: {
      skip: "跳到主要内容",
      brand: "樊浩玮",
      brandZh: "樊浩玮",
      "nav.about": "简介",
      "nav.updates": "动态",
      "nav.aiViews": "AI洞察",
      "nav.writing": "随笔",
      "nav.notes": "笔记",
      "nav.experience": "经历",
      "nav.education": "教育",
      "nav.publications": "论文",
      "nav.projects": "项目",
      "nav.skills": "技能",
      "nav.achievements": "成就",
      "nav.contact": "联系",
      menuToggle: "打开菜单",
      themeToggle: "切换浅色 / 深色主题",

      "aiViews.label": "AI",
      "aiViews.title": "AI辅助-对世界的洞察",
      "aiViews.desc": "用 AI 辅助梳理的行业与世界观察。",
      "aiViews.descHome": "最新 AI 辅助洞察。点击卡片阅读全文。",
      "aiViews.viewAll": "查看全部",
      "aiViews.readMore": "阅读全文 →",
      "aiViews.empty": "暂无内容。",
      "aiViews.loading": "加载中…",
      "aiViews.error": "无法加载内容，请稍后再试。",
      "aiViews.backHome": "← 返回主页",
      "aiViews.backList": "← 全部洞察",
      "aiViews.missingSlug": "未选择文章。",
      "aiViews.notFound": "未找到该文章。",
      documentTitleAiViews: "AI洞察 · 樊浩玮",

      "writing.label": "随笔",
      "writing.title": "随笔",
      "writing.desc": "个人短文与随想。",
      "writing.descHome": "最新随笔。点击卡片阅读全文。",
      "writing.viewAll": "查看全部",
      "writing.readMore": "阅读全文 →",
      "writing.empty": "暂无内容。",
      "writing.loading": "加载中…",
      "writing.error": "无法加载随笔，请稍后再试。",
      "writing.backHome": "← 返回主页",
      "writing.backList": "← 全部随笔",
      "writing.missingSlug": "未选择文章。",
      "writing.notFound": "未找到该文章。",
      documentTitleWriting: "随笔 · 樊浩玮",

      "notes.label": "笔记",
      "notes.title": "笔记",
      "notes.desc": "学习笔记与摘录。",
      "notes.descHome": "最新学习笔记。点击卡片阅读全文。",
      "notes.viewAll": "查看全部",
      "notes.readMore": "阅读全文 →",
      "notes.empty": "暂无内容。",
      "notes.loading": "加载中…",
      "notes.error": "无法加载笔记，请稍后再试。",
      "notes.backHome": "← 返回主页",
      "notes.backList": "← 全部笔记",
      "notes.missingSlug": "未选择文章。",
      "notes.notFound": "未找到该文章。",
      documentTitleNotes: "笔记 · 樊浩玮",

      "updates.label": "近况",
      "updates.title": "动态",
      "updates.desc": "个人活动与近况",
      "updates.viewAll": "查看全部动态",
      "updates.empty": "暂无动态。",
      "updates.loading": "加载中…",
      "updates.error": "无法加载动态，请稍后再试。",
      "updates.backHome": "← 返回主页",
      documentTitleUpdates: "动态 · 樊浩玮",

      "hero.eyebrow": "博士研究生 · 理论物理",
      "hero.name": "樊浩玮",
      "hero.subtitle": "从量子物理到现实世界",
      "hero.lead":
        "理论物理博士生，希望以知识与认知为杠杆，在金融市场中拓宽个人边界、实现价值突破。",
      "hero.ctaProjects": "查看项目",
      "hero.ctaContact": "联系我",

      "about.label": "关于",
      "about.title": "个人简介",
      "about.body":
        "我是理论物理博士研究生，研究背景涵盖量子理论、低维系统、随机过程、高性能科学计算与大规模 Python / MATLAB 建模。博士训练塑造了结构化分析、复杂问题拆解，以及从数据与模型中提炼清晰结论的能力。我正把这些能力带到行业研究、金融市场，以及更广阔的现实问题之中。",

      "experience.label": "职业",
      "experience.title": "工作经历",
      "exp.yunrui.date": "2026 年 7 月 – 2026 年 10 月",
      "exp.yunrui.role": "投研部实习生",
      "exp.yunrui.org": "云睿资本（深圳）",
      "exp.yunrui.b1":
        "搭建 ABS 现金流瀑布模型，完成 IRR、敏感性分析与情景分析，用于投资评审。",
      "exp.yunrui.b2":
        "探索生成式 AI 在研究工作中的应用，并搭建内部新闻推送工具。",
      "exp.yunrui.b3":
        "参与 Pre-A 后尽调：可比公司分析、基于收入预测的倍数估值、现场访谈，并撰写完整尽调报告。",
      "exp.ngi.date": "2025 年 6 月 – 2025 年 11 月",
      "exp.ngi.role": "访问学者",
      "exp.ngi.org": "英国国家石墨烯研究所（National Graphene Institute）",
      "exp.ngi.b1":
        "研究周期性驱动耗散自旋模型中量子混沌与经典混沌的关联与区别。",
      "exp.ngi.b2":
        "构建包含自洽 Hartree 势的四层石墨烯计算模型。",
      "exp.ngi.b3":
        "从理论上研究二维体系中不同形式的 Hartree 修正。",
      "exp.pwc.date": "2021 年 8 月 – 2022 年 7 月",
      "exp.pwc.role": "金融审计",
      "exp.pwc.org": "普华永道中天会计师事务所（上海）",
      "exp.pwc.b1":
        "对公募与私募基金开展公司审计、基金审计，以及新募集基金验资。",
      "exp.pwc.b2":
        "参与鹏华基金、摩根士丹利华鑫基金、海通证券等大型项目的年度审计并出具基金报告。",
      "exp.pwc.b3":
        "评估风险控制与合规框架，积累财务报告与监管流程相关经验。",
      "exp.orient.date": "2018 年 10 月 – 2019 年 2 月",
      "exp.orient.role": "托管部助理实习生",
      "exp.orient.org": "东方证券股份有限公司（上海）",
      "exp.orient.b1":
        "整理归档基金相关原始文档（托管户开户回执、募集信息、销户回执等），并办理基金托管户开户与销户业务。",

      "education.label": "学术",
      "education.title": "教育背景",
      "edu.phd.degree": "理论物理博士（在读）",
      "edu.phd.school": "香港城市大学",
      "edu.msc.degree": "应用物理硕士（Distinction）",
      "edu.msc.school": "香港城市大学",
      "edu.bsc.degree": "应用化学学士（First Class）",
      "edu.bsc.school": "同济大学",

      "publications.label": "研究",
      "publications.title": "学术论文",
      "publications.view": "在 arXiv 查看 →",

      "projects.label": "精选",
      "projects.title": "项目",
      "proj.multiposition.title": "MultiPosition — 多目标共现区域发现",
      "proj.multiposition.tag": "网页工具 · 地理空间 · 聚类",
      "proj.multiposition.b1":
        "开发纯前端工具，在城市中发现多种 POI 类型共现的区域（如咖啡 + 新能源门店）。",
      "proj.multiposition.b2":
        "对接高德 POI 检索，并在客户端完成 DBSCAN 共现聚类与匹配度排序。",
      "proj.multiposition.b3":
        "以静态站点形式部署于 GitHub Pages，支持地图可视化与城市 / 附近搜索。",
      "proj.multiposition.demo": "在线演示 →",
      "proj.multiposition.repo": "GitHub →",
      "proj.chaos.title": "周期性驱动耗散自旋系统中的混沌",
      "proj.chaos.tag": "量子动力学 · 高性能计算",
      "proj.chaos.b1":
        "比较周期性驱动耗散自旋模型中量子与经典混沌的关系与差异。",
      "proj.chaos.b2":
        "计算 Lyapunov 指数，对比热力学经典极限与有限尺寸量子行为。",
      "proj.chaos.b3":
        "在 Python / MATLAB 中实现大规模矩阵演化与并行随机动力学模拟。",
      "proj.mient.title": "测量诱导纠缠相变",
      "proj.mient.tag": "自由费米子 · 随机动力学",
      "proj.mient.b1":
        "研究在布朗噪声驱动的随机薛定谔演化下，自由费米子链中的纠缠相变。",
      "proj.mient.b2":
        "分析二分纠缠熵在测量强度与势强度变化下的体律 / 面律转变。",
      "proj.mient.b3":
        "开发随机微分方程与随机动力学演化的数值求解器。",
      "proj.graphene.title": "四层石墨烯 Hartree 自洽建模",
      "proj.graphene.tag": "自洽场 · 材料计算",
      "proj.graphene.b1":
        "构建包含自洽 Hartree 势的四层石墨烯计算模型。",
      "proj.graphene.b2":
        "在迭代自洽场框架下求解层依赖势与电子结构。",
      "proj.graphene.b3":
        "发展面向复杂多参数系统的迭代自洽优化算法。",

      "skills.label": "能力",
      "skills.title": "技能",
      "skills.prog": "编程",
      "skills.math": "数学",
      "skills.lang": "语言",
      "skills.math.prob": "概率论",
      "skills.math.stoch": "随机微积分",
      "skills.math.num": "数值分析",
      "skills.math.la": "线性代数",
      "skills.math.game": "博弈论",
      "skills.lang.zh": "普通话",
      "skills.lang.en": "英语",
      "skills.lang.sh": "上海话",
      "skills.lang.yue": "粤语",
      "skills.lang.ja": "日语",

      "teaching.label": "社区",
      "teaching.title": "教学与会议",
      "teaching.ta": "助教经历",
      "teaching.conf": "学术会议",
      "teaching.t1": "经典力学导论",
      "teaching.t2": "基础物理",
      "teaching.t3": "基础物理、普通物理 I",
      "teaching.c1":
        "粤港澳大湾区物理学会联合年会 · 香港城市大学",
      "teaching.c2":
        "物理与天文学系研究生研究会议 · 英国曼彻斯特大学",

      "achievements.label": "亮点",
      "achievements.title": "成就与证书",
      "ach.cube.title": "魔方",
      "ach.cube.body":
        "3 项亚洲纪录、11 项国家纪录；WCA 赛事累计 48 金、21 银、24 铜——展现模式识别、问题解决与高压下的认知敏捷。",
      "ach.cube.link": "WCA 个人主页 →",
      "ach.cert.title": "证书",
      "ach.cert.cfa": "CFA 可持续投资证书（ESG）",
      "ach.cert.sac": "证券从业资格证书（SAC）",

      "contact.label": "联系",
      "contact.title": "与我联系",
      "contact.desc":
        "欢迎就研究、市场及相关机会交流。",
      "contact.email": "邮箱",
      "contact.linkedin": "樊浩玮",
      "contact.form.name": "姓名",
      "contact.form.email": "你的邮箱",
      "contact.form.message": "留言",
      "contact.form.submit": "发送",
      "contact.form.mailto": "直接发邮件",
      "contact.form.placeholder":
        "表单暂未接入后端。请直接发邮件至 hwfan0930@gmail.com，感谢联系！",
      "contact.form.validation": "请填写完整信息，并使用有效邮箱地址。",
      "contact.form.errName": "请填写姓名。",
      "contact.form.errEmail": "请填写有效的邮箱地址。",
      "contact.form.errMessage": "请填写留言内容。",

      "footer.copy": "© 2026 樊浩玮. 保留所有权利。",
      "footer.credit":
        '本页面由 <a href="https://x.ai/grok" target="_blank" rel="noopener noreferrer">Grok Build</a> 生成 · 设计系统参考 <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noopener noreferrer">ui-ux-pro-max</a>',
      "footer.updated": "最近更新：2026 年 9 月",
      documentTitle: "樊浩玮 · 个人主页",
    },

    "zh-Hant": {
      skip: "跳到主要內容",
      brand: "樊浩瑋",
      brandZh: "樊浩瑋",
      "nav.about": "簡介",
      "nav.updates": "動態",
      "nav.aiViews": "AI洞察",
      "nav.writing": "隨筆",
      "nav.notes": "筆記",
      "nav.experience": "經歷",
      "nav.education": "教育",
      "nav.publications": "論文",
      "nav.projects": "項目",
      "nav.skills": "技能",
      "nav.achievements": "成就",
      "nav.contact": "聯繫",
      menuToggle: "打開菜單",
      themeToggle: "切換淺色 / 深色主題",

      "aiViews.label": "AI",
      "aiViews.title": "AI輔助-對世界的洞察",
      "aiViews.desc": "用 AI 輔助梳理的行業與世界觀察。",
      "aiViews.descHome": "最新 AI 輔助洞察。點擊卡片閱讀全文。",
      "aiViews.viewAll": "查看全部",
      "aiViews.readMore": "閱讀全文 →",
      "aiViews.empty": "暫無內容。",
      "aiViews.loading": "加載中…",
      "aiViews.error": "無法加載內容，請稍後再試。",
      "aiViews.backHome": "← 返回主頁",
      "aiViews.backList": "← 全部洞察",
      "aiViews.missingSlug": "未選擇文章。",
      "aiViews.notFound": "未找到該文章。",
      documentTitleAiViews: "AI洞察 · 樊浩瑋",

      "writing.label": "隨筆",
      "writing.title": "隨筆",
      "writing.desc": "個人短文與隨想。",
      "writing.descHome": "最新隨筆。點擊卡片閱讀全文。",
      "writing.viewAll": "查看全部",
      "writing.readMore": "閱讀全文 →",
      "writing.empty": "暫無內容。",
      "writing.loading": "加載中…",
      "writing.error": "無法加載隨筆，請稍後再試。",
      "writing.backHome": "← 返回主頁",
      "writing.backList": "← 全部隨筆",
      "writing.missingSlug": "未選擇文章。",
      "writing.notFound": "未找到該文章。",
      documentTitleWriting: "隨筆 · 樊浩瑋",

      "notes.label": "筆記",
      "notes.title": "筆記",
      "notes.desc": "學習筆記與摘錄。",
      "notes.descHome": "最新學習筆記。點擊卡片閱讀全文。",
      "notes.viewAll": "查看全部",
      "notes.readMore": "閱讀全文 →",
      "notes.empty": "暫無內容。",
      "notes.loading": "加載中…",
      "notes.error": "無法加載筆記，請稍後再試。",
      "notes.backHome": "← 返回主頁",
      "notes.backList": "← 全部筆記",
      "notes.missingSlug": "未選擇文章。",
      "notes.notFound": "未找到該文章。",
      documentTitleNotes: "筆記 · 樊浩瑋",

      "updates.label": "近況",
      "updates.title": "動態",
      "updates.desc": "個人活動與近況",
      "updates.viewAll": "查看全部動態",
      "updates.empty": "暫無動態。",
      "updates.loading": "加載中…",
      "updates.error": "無法加載動態，請稍後再試。",
      "updates.backHome": "← 返回主頁",
      documentTitleUpdates: "動態 · 樊浩瑋",

      "hero.eyebrow": "博士研究生 · 理論物理",
      "hero.name": "樊浩瑋",
      "hero.subtitle": "從量子物理到現實世界",
      "hero.lead":
        "理論物理博士生，希望以知識與認知為槓桿，在金融市場中拓寬個人邊界、實現價值突破。",
      "hero.ctaProjects": "查看項目",
      "hero.ctaContact": "聯繫我",

      "about.label": "關於",
      "about.title": "個人簡介",
      "about.body":
        "我是理論物理博士研究生，研究背景涵蓋量子理論、低維系統、隨機過程、高性能科學計算與大規模 Python / MATLAB 建模。博士訓練塑造了結構化分析、複雜問題拆解，以及從數據與模型中提煉清晰結論的能力。我正把這些能力帶到行業研究、金融市場，以及更廣闊的現實問題之中。",

      "experience.label": "職業",
      "experience.title": "工作經歷",
      "exp.yunrui.date": "2026 年 7 月 – 2026 年 10 月",
      "exp.yunrui.role": "投研部實習生",
      "exp.yunrui.org": "雲睿資本（深圳）",
      "exp.yunrui.b1":
        "搭建 ABS 現金流瀑布模型，完成 IRR、敏感性分析與情景分析，用於投資評審。",
      "exp.yunrui.b2":
        "探索生成式 AI 在研究工作中的應用，並搭建內部新聞推送工具。",
      "exp.yunrui.b3":
        "參與 Pre-A 後盡調：可比公司分析、基於收入預測的倍數估值、現場訪談，並撰寫完整盡調報告。",
      "exp.ngi.date": "2025 年 6 月 – 2025 年 11 月",
      "exp.ngi.role": "訪問學者",
      "exp.ngi.org": "英國國家石墨烯研究所（National Graphene Institute）",
      "exp.ngi.b1":
        "研究周期性驅動耗散自旋模型中量子混沌與經典混沌的關聯與區別。",
      "exp.ngi.b2":
        "構建包含自洽 Hartree 勢的四層石墨烯計算模型。",
      "exp.ngi.b3":
        "從理論上研究二維體系中不同形式的 Hartree 修正。",
      "exp.pwc.date": "2021 年 8 月 – 2022 年 7 月",
      "exp.pwc.role": "金融審計",
      "exp.pwc.org": "普華永道中天會計師事務所（上海）",
      "exp.pwc.b1":
        "對公募與私募基金開展公司審計、基金審計，以及新募集基金驗資。",
      "exp.pwc.b2":
        "參與鵬華基金、摩根士丹利華鑫基金、海通證券等大型項目的年度審計並出具基金報告。",
      "exp.pwc.b3":
        "評估風險控制與合規框架，積累財務報告與監管流程相關經驗。",
      "exp.orient.date": "2018 年 10 月 – 2019 年 2 月",
      "exp.orient.role": "托管部助理實習生",
      "exp.orient.org": "東方證券股份有限公司（上海）",
      "exp.orient.b1":
        "整理歸檔基金相關原始文檔（托管戶開戶回執、募集信息、銷戶回執等），並辦理基金托管戶開戶與銷戶業務。",

      "education.label": "學術",
      "education.title": "教育背景",
      "edu.phd.degree": "理論物理博士（在讀）",
      "edu.phd.school": "香港城市大學",
      "edu.msc.degree": "應用物理碩士（Distinction）",
      "edu.msc.school": "香港城市大學",
      "edu.bsc.degree": "應用化學學士（First Class）",
      "edu.bsc.school": "同濟大學",

      "publications.label": "研究",
      "publications.title": "學術論文",
      "publications.view": "在 arXiv 查看 →",

      "projects.label": "精選",
      "projects.title": "項目",
      "proj.multiposition.title": "MultiPosition — 多目標共現區域發現",
      "proj.multiposition.tag": "網頁工具 · 地理空間 · 聚類",
      "proj.multiposition.b1":
        "開發純前端工具，在城市中發現多種 POI 類型共現的區域（如咖啡 + 新能源門店）。",
      "proj.multiposition.b2":
        "對接高德 POI 檢索，並在客戶端完成 DBSCAN 共現聚類與匹配度排序。",
      "proj.multiposition.b3":
        "以靜態站點形式部署於 GitHub Pages，支援地圖可視化與城市 / 附近搜索。",
      "proj.multiposition.demo": "線上演示 →",
      "proj.multiposition.repo": "GitHub →",
      "proj.chaos.title": "周期性驅動耗散自旋系統中的混沌",
      "proj.chaos.tag": "量子動力學 · 高性能計算",
      "proj.chaos.b1":
        "比較周期性驅動耗散自旋模型中量子與經典混沌的關係與差異。",
      "proj.chaos.b2":
        "計算 Lyapunov 指數，對比熱力學經典極限與有限尺寸量子行爲。",
      "proj.chaos.b3":
        "在 Python / MATLAB 中實現大規模矩陣演化與並行隨機動力學模擬。",
      "proj.mient.title": "測量誘導糾纏相變",
      "proj.mient.tag": "自由費米子 · 隨機動力學",
      "proj.mient.b1":
        "研究在布朗噪聲驅動的隨機薛定諤演化下，自由費米子鏈中的糾纏相變。",
      "proj.mient.b2":
        "分析二分糾纏熵在測量強度與勢強度變化下的體律 / 面律轉變。",
      "proj.mient.b3":
        "開發隨機微分方程與隨機動力學演化的數值求解器。",
      "proj.graphene.title": "四層石墨烯 Hartree 自洽建模",
      "proj.graphene.tag": "自洽場 · 材料計算",
      "proj.graphene.b1":
        "構建包含自洽 Hartree 勢的四層石墨烯計算模型。",
      "proj.graphene.b2":
        "在迭代自洽場框架下求解層依賴勢與電子結構。",
      "proj.graphene.b3":
        "發展面向複雜多參數系統的迭代自洽優化算法。",

      "skills.label": "能力",
      "skills.title": "技能",
      "skills.prog": "編程",
      "skills.math": "數學",
      "skills.lang": "語言",
      "skills.math.prob": "概率論",
      "skills.math.stoch": "隨機微積分",
      "skills.math.num": "數值分析",
      "skills.math.la": "線性代數",
      "skills.math.game": "博弈論",
      "skills.lang.zh": "普通話",
      "skills.lang.en": "英語",
      "skills.lang.sh": "上海話",
      "skills.lang.yue": "粵語",
      "skills.lang.ja": "日語",

      "teaching.label": "社區",
      "teaching.title": "教學與會議",
      "teaching.ta": "助教經歷",
      "teaching.conf": "學術會議",
      "teaching.t1": "經典力學導論",
      "teaching.t2": "基礎物理",
      "teaching.t3": "基礎物理、普通物理 I",
      "teaching.c1":
        "粵港澳大灣區物理學會聯合年會 · 香港城市大學",
      "teaching.c2":
        "物理與天文學系研究生研究會議 · 英國曼徹斯特大學",

      "achievements.label": "亮點",
      "achievements.title": "成就與證書",
      "ach.cube.title": "魔方",
      "ach.cube.body":
        "3 項亞洲紀錄、11 項國家紀錄；WCA 賽事累計 48 金、21 銀、24 銅——展現模式識別、問題解決與高壓下的認知敏捷。",
      "ach.cube.link": "WCA 個人主頁 →",
      "ach.cert.title": "證書",
      "ach.cert.cfa": "CFA 可持續投資證書（ESG）",
      "ach.cert.sac": "證券從業資格證書（SAC）",

      "contact.label": "聯繫",
      "contact.title": "與我聯繫",
      "contact.desc":
        "歡迎就研究、市場及相關機會交流。",
      "contact.email": "郵箱",
      "contact.linkedin": "樊浩瑋",
      "contact.form.name": "姓名",
      "contact.form.email": "你的郵箱",
      "contact.form.message": "留言",
      "contact.form.submit": "發送",
      "contact.form.mailto": "直接發郵件",
      "contact.form.placeholder":
        "表單暫未接入後端。請直接發郵件至 hwfan0930@gmail.com，感謝聯繫！",
      "contact.form.validation": "請填寫完整信息，並使用有效郵箱地址。",
      "contact.form.errName": "請填寫姓名。",
      "contact.form.errEmail": "請填寫有效的郵箱地址。",
      "contact.form.errMessage": "請填寫留言內容。",

      "footer.copy": "© 2026 樊浩瑋. 保留所有權利。",
      "footer.credit":
        '本頁面由 <a href="https://x.ai/grok" target="_blank" rel="noopener noreferrer">Grok Build</a> 生成 · 設計系統參考 <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noopener noreferrer">ui-ux-pro-max</a>',
      "footer.updated": "最近更新：2026 年 9 月",
      documentTitle: "樊浩瑋 · 個人主頁",
    },

    ja: {
      skip: "メインコンテンツへスキップ",
      brand: "樊浩玮",
      brandZh: "樊浩玮",
      "nav.about": "概要",
      "nav.updates": "近況",
      "nav.aiViews": "AI洞察",
      "nav.writing": "エッセイ",
      "nav.notes": "ノート",
      "nav.experience": "経歴",
      "nav.education": "学歴",
      "nav.publications": "論文",
      "nav.projects": "プロジェクト",
      "nav.skills": "スキル",
      "nav.achievements": "実績",
      "nav.contact": "連絡先",
      menuToggle: "メニューを開く",
      themeToggle: "ライト / ダークテーマを切り替え",

      "aiViews.label": "AI",
      "aiViews.title": "AIで読み解く世界",
      "aiViews.desc": "AIを活用した産業・世界の観察。",
      "aiViews.descHome":
        "最新のAI洞察。カードを開くと全文を読めます。",
      "aiViews.viewAll": "すべて見る",
      "aiViews.readMore": "続きを読む →",
      "aiViews.empty": "まだ投稿がありません。",
      "aiViews.loading": "読み込み中…",
      "aiViews.error":
        "読み込めませんでした。後でもう一度お試しください。",
      "aiViews.backHome": "← ホームへ戻る",
      "aiViews.backList": "← すべてのAI洞察",
      "aiViews.missingSlug": "記事が選択されていません。",
      "aiViews.notFound": "記事が見つかりません。",
      documentTitleAiViews: "AI洞察 · 樊浩玮",

      "writing.label": "エッセイ",
      "writing.title": "エッセイ",
      "writing.desc": "個人のエッセイと短文。",
      "writing.descHome":
        "最新のエッセイ。カードを開くと全文を読めます。",
      "writing.viewAll": "すべて見る",
      "writing.readMore": "続きを読む →",
      "writing.empty": "まだエッセイがありません。",
      "writing.loading": "読み込み中…",
      "writing.error":
        "エッセイを読み込めませんでした。後でもう一度お試しください。",
      "writing.backHome": "← ホームへ戻る",
      "writing.backList": "← すべてのエッセイ",
      "writing.missingSlug": "記事が選択されていません。",
      "writing.notFound": "記事が見つかりません。",
      documentTitleWriting: "エッセイ · 樊浩玮",

      "notes.label": "ノート",
      "notes.title": "ノート",
      "notes.desc": "学習ノートとメモ。",
      "notes.descHome":
        "最新の学習ノート。カードを開くと全文を読めます。",
      "notes.viewAll": "すべて見る",
      "notes.readMore": "続きを読む →",
      "notes.empty": "まだノートがありません。",
      "notes.loading": "読み込み中…",
      "notes.error":
        "ノートを読み込めませんでした。後でもう一度お試しください。",
      "notes.backHome": "← ホームへ戻る",
      "notes.backList": "← すべてのノート",
      "notes.missingSlug": "記事が選択されていません。",
      "notes.notFound": "記事が見つかりません。",
      documentTitleNotes: "ノート · 樊浩玮",

      "updates.label": "近況",
      "updates.title": "近況",
      "updates.desc": "個人の活動と近況",
      "updates.viewAll": "すべての近況を見る",
      "updates.empty": "まだ近況がありません。",
      "updates.loading": "読み込み中…",
      "updates.error":
        "近況を読み込めませんでした。後でもう一度お試しください。",
      "updates.backHome": "← ホームへ戻る",
      documentTitleUpdates: "近況 · 樊浩玮",

      "hero.eyebrow": "博士課程 · 理論物理学",
      "hero.name": "樊浩玮",
      "hero.subtitle":
        "量子物理から現実世界へ",
      "hero.lead":
        "理論物理学の博士課程に在籍。知識と認知をテコに、金融市場で自らの境界を広げ、価値の突破を目指しています。",
      "hero.ctaProjects": "プロジェクトを見る",
      "hero.ctaContact": "お問い合わせ",

      "about.label": "About",
      "about.title": "プロフィール",
      "about.body":
        "理論物理学の博士課程に在籍しています。研究背景は量子理論、低次元系、確率過程、高性能科学計算、大規模な Python / MATLAB モデリングに及びます。博士課程で培った構造化された分析、複雑な問題の分解、データとモデルから明確な結論を導く力を、産業リサーチ、金融市場、そしてより広い現実の問いに活かしています。",

      "experience.label": "キャリア",
      "experience.title": "職歴",
      "exp.yunrui.date": "2026年7月 – 2026年10月",
      "exp.yunrui.role": "投資リサーチインターン",
      "exp.yunrui.org": "雲睿資本（深圳）",
      "exp.yunrui.b1":
        "ABS のキャッシュフロー・ウォーターフォールモデルを構築し、投資審査向けに IRR、感応度分析、シナリオ分析を実施。",
      "exp.yunrui.b2":
        "研究業務における生成AIの活用を検討し、社内ニュース配信ツールを構築。",
      "exp.yunrui.b3":
        "Pre-A 後のデューデリジェンスに参加：類似企業分析、売上予測に基づくマルチプル評価、現地インタビュー、および完全な DD レポートの作成。",
      "exp.ngi.date": "2025年6月 – 2025年11月",
      "exp.ngi.role": "訪問研究員",
      "exp.ngi.org": "英国国立グラフェン研究所（National Graphene Institute）",
      "exp.ngi.b1":
        "周期駆動散逸スピンモデルにおける量子カオスと古典カオスの関係と相違を研究。",
      "exp.ngi.b2":
        "自己無撞着 Hartree ポテンシャルを取り入れた四層グラフェンの計算モデルを構築。",
      "exp.ngi.b3":
        "二次元系における異なる Hartree 補正を理論的に検討。",
      "exp.pwc.date": "2021年8月 – 2022年7月",
      "exp.pwc.role": "金融監査",
      "exp.pwc.org": "PwC 上海",
      "exp.pwc.b1":
        "公募・私募ファンドの会社監査・ファンド監査、および新規募集ファンドの出資検証を担当。",
      "exp.pwc.b2":
        "鵬華ファンド、モルガン・スタンレー華鑫ファンド、海通証券などの大型案件の年度監査とファンド報告書作成に参加。",
      "exp.pwc.b3":
        "リスク管理・コンプライアンス体制を評価し、財務報告と規制プロセスへの理解を深めた。",
      "exp.orient.date": "2018年10月 – 2019年2月",
      "exp.orient.role": "カストディ部門アシスタントインターン",
      "exp.orient.org": "東方証券（上海）",
      "exp.orient.b1":
        "ファンドカストディ関連の原本書類（口座開設回執、募集情報、口座閉鎖回執など）を整理・保管し、カストディ口座の開設・閉鎖手続きを担当。",

      "education.label": "学問",
      "education.title": "学歴",
      "edu.phd.degree": "理論物理学 博士課程（在学）",
      "edu.phd.school": "香港城市大学",
      "edu.msc.degree": "応用物理学 修士（Distinction）",
      "edu.msc.school": "香港城市大学",
      "edu.bsc.degree": "応用化学 学士（First Class）",
      "edu.bsc.school": "同済大学",

      "publications.label": "研究",
      "publications.title": "論文",
      "publications.view": "arXiv で見る →",

      "projects.label": "主な成果",
      "projects.title": "プロジェクト",
      "proj.multiposition.title":
        "MultiPosition — 複数ターゲット共起エリア探索",
      "proj.multiposition.tag": "Webツール · 地理空間 · クラスタリング",
      "proj.multiposition.b1":
        "複数の POI タイプが共起する都市エリアを見つける純フロントエンドツールを構築（例：カフェ + EV 店舗）。",
      "proj.multiposition.b2":
        "高徳 POI 検索とクライアント側 DBSCAN 共起クラスタリング・マッチ度ランキングを組み合わせ。",
      "proj.multiposition.b3":
        "GitHub Pages 上の静的アプリとして公開し、地図可視化と都市 / 近傍検索に対応。",
      "proj.multiposition.demo": "デモを見る →",
      "proj.multiposition.repo": "GitHub →",
      "proj.chaos.title": "周期駆動散逸スピン系におけるカオス",
      "proj.chaos.tag": "量子ダイナミクス · 高性能計算",
      "proj.chaos.b1":
        "周期駆動散逸スピンモデルにおける量子カオスと古典カオスを比較。",
      "proj.chaos.b2":
        "Lyapunov 指数を計算し、熱力学的古典極限と有限サイズの量子挙動を対比。",
      "proj.chaos.b3":
        "Python / MATLAB で大規模行列発展と並列化したシミュレーションを実装。",
      "proj.mient.title": "測定誘起エンタングルメント転移",
      "proj.mient.tag": "自由フェルミオン · 確率ダイナミクス",
      "proj.mient.b1":
        "ブラウンノイズ駆動の確率的シュレーディンガー発展下の自由フェルミオン鎖におけるエンタングルメント転移を研究。",
      "proj.mient.b2":
        "測定強度とポテンシャル強度の変化に伴う、体積則 / 面積則の二部エンタングルメントエントロピーの転移を解析。",
      "proj.mient.b3":
        "確率微分方程式および確率的ダイナミクス発展の数値ソルバーを開発。",
      "proj.graphene.title": "四層グラフェンの Hartree 自己無撞着モデリング",
      "proj.graphene.tag": "自己無撞着場 · 材料計算",
      "proj.graphene.b1":
        "自己無撞着 Hartree ポテンシャルを含む四層グラフェンの計算モデルを構築。",
      "proj.graphene.b2":
        "反復的自己無撞着場（SCF）枠組みの下で層依存ポテンシャルと電子構造を求解。",
      "proj.graphene.b3":
        "複雑な多パラメータ系向けの反復的自己無撞着最適化アルゴリズムを開発。",

      "skills.label": "ツールキット",
      "skills.title": "スキル",
      "skills.prog": "プログラミング",
      "skills.math": "数学",
      "skills.lang": "言語",
      "skills.math.prob": "確率論",
      "skills.math.stoch": "確率解析",
      "skills.math.num": "数値解析",
      "skills.math.la": "線形代数",
      "skills.math.game": "ゲーム理論",
      "skills.lang.zh": "中国語（普通話）",
      "skills.lang.en": "英語",
      "skills.lang.sh": "上海語",
      "skills.lang.yue": "広東語",
      "skills.lang.ja": "日本語",

      "teaching.label": "コミュニティ",
      "teaching.title": "教育・学会",
      "teaching.ta": "ティーチング・アシスタント",
      "teaching.conf": "学会・会議",
      "teaching.t1": "初等古典力学",
      "teaching.t2": "基礎物理学",
      "teaching.t3": "基礎物理学、一般物理学 I",
      "teaching.c1":
        "粤港澳大湾区物理学会合同年会 · 香港城市大学",
      "teaching.c2":
        "物理・天文学科大学院研究会議 · 英国マンチェスター大学",

      "achievements.label": "ハイライト",
      "achievements.title": "実績・資格",
      "ach.cube.title": "ルービックキューブ",
      "ach.cube.body":
        "アジア記録 3、国内記録 11；WCA 大会で金 48・銀 21・銅 24 — パターン認識、問題解決、プレッシャー下での認知的敏捷性を示す。",
      "ach.cube.link": "WCA プロフィール →",
      "ach.cert.title": "資格",
      "ach.cert.cfa": "CFA サステナブル投資証明書（ESG）",
      "ach.cert.sac": "証券業資格証明書（SAC）",

      "contact.label": "Connect",
      "contact.title": "お問い合わせ",
      "contact.desc":
        "研究、市場、および関連する機会についてのご連絡を歓迎します。",
      "contact.email": "メール",
      "contact.linkedin": "樊浩玮",
      "contact.form.name": "お名前",
      "contact.form.email": "メールアドレス",
      "contact.form.message": "メッセージ",
      "contact.form.submit": "送信",
      "contact.form.mailto": "メールで直接連絡",
      "contact.form.placeholder":
        "フォームはまだ接続されていません。hwfan0930@gmail.com までメールでご連絡ください。",
      "contact.form.validation": "すべての項目を入力し、有効なメールアドレスを記入してください。",
      "contact.form.errName": "お名前を入力してください。",
      "contact.form.errEmail": "有効なメールアドレスを入力してください。",
      "contact.form.errMessage": "メッセージを入力してください。",

      "footer.copy": "© 2026 樊浩玮. All rights reserved.",
      "footer.credit":
        '<a href="https://x.ai/grok" target="_blank" rel="noopener noreferrer">Grok Build</a> で構築 · デザインは <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noopener noreferrer">ui-ux-pro-max</a> を参考',
      "footer.updated": "最終更新：2026年9月",
      documentTitle: "樊浩玮 · パーソナルホームページ",
    },
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) {
      /* ignore */
    }
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (nav.startsWith("zh")) {
      // Traditional: Taiwan, Hong Kong, Macau, or explicit Hant
      if (
        nav.includes("tw") ||
        nav.includes("hk") ||
        nav.includes("mo") ||
        nav.includes("hant")
      ) {
        return "zh-Hant";
      }
      return "zh";
    }
    if (nav.startsWith("ja")) return "ja";
    return "en";
  }

  function t(key, lang) {
    const L = lang || currentLang;
    return (dict[L] && dict[L][key]) || (dict.en && dict.en[key]) || key;
  }

  function htmlLang(lang) {
    if (lang === "zh") return "zh-Hans";
    if (lang === "zh-Hant") return "zh-Hant";
    if (lang === "ja") return "ja";
    return "en";
  }

  let currentLang = detectLang();

  function applyLanguage(lang) {
    if (!dict[lang]) lang = "en";
    currentLang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }

    document.documentElement.lang = htmlLang(lang);
    const titleKey =
      document.body.getAttribute("data-i18n-document-title") || "documentTitle";
    const postTitleEl = document.getElementById("postTitle");
    const loadingLabels = [
      t("aiViews.loading", "Loading…"),
      t("writing.loading", "Loading…"),
      t("notes.loading", "Loading…"),
      t("aiViews.loading", lang),
      t("writing.loading", lang),
      t("notes.loading", lang),
    ];
    const loadedPost =
      postTitleEl &&
      postTitleEl.textContent &&
      !loadingLabels.includes(postTitleEl.textContent);
    if (loadedPost) {
      document.title = postTitleEl.textContent + " · Haowei Fan";
    } else {
      document.title = t(titleKey, lang);
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = t(key, lang);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    /* Trusted HTML strings from our dictionary only (e.g. footer credits) */
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(key, lang);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(key, lang));
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // CJK name for zh/ja; Latin name for en
    const brandEn = document.querySelector(".nav-brand-en");
    const brandZh = document.querySelector(".nav-brand-zh");
    if (brandEn && brandZh) {
      if (lang === "zh" || lang === "zh-Hant" || lang === "ja") {
        brandEn.hidden = true;
        brandZh.hidden = false;
        brandZh.textContent = t("brand", lang);
      } else {
        brandEn.hidden = false;
        brandZh.hidden = true;
      }
    }

    window.dispatchEvent(
      new CustomEvent("languagechange", { detail: { lang } })
    );
  }

  function initI18n() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang) applyLanguage(lang);
      });
    });
    applyLanguage(currentLang);
  }

  window.HF_I18N = {
    t,
    applyLanguage,
    getLang: () => currentLang,
    init: initI18n,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initI18n);
  } else {
    initI18n();
  }
})();
