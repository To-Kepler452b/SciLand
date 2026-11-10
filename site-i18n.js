/* SciLand V11 — bilingual site content and instant English / Chinese switching.
   No API, third-party translator or external runtime dependency. */
(() => {
  'use strict';
  const data = window.SCILAND_CONTENT;
  if (!data) return;

  const en = JSON.parse(JSON.stringify(data));
  const zh = JSON.parse(JSON.stringify(en));
  Object.assign(zh, {
    labName: 'SciLand 实验室',
    institution: '科学具身智能 · 研究实验室',
    location: '机器人、人工智能与科学发现',
    heroEyebrow: '科学具身智能 / 2026',
    heroTitleSecond: '科学具身智能实验室平台',
    heroDescription: '面向真实科学实验室，探索自主、可靠且具有泛化能力的具身智能。',
    heroTypewriterPhrases: [
      '机器人能自主完成科学实验吗？',
      '如果实验也能帮助机器人学习呢？',
      '让人工智能从理解走向精准操作。',
      '迈向更智能的科学实验室。'
    ],
    mission: '科学发现需要能够在现实世界行动的智能。',
    missionCopy: '我们的研究连接机器人学习、可信人工智能与自主科学实验。从精细化操作到长序列实验流程，我们探索如何构建具备执行能力、可验证性与适应性的智能实验室系统。'
  });
  const projectZh = {
    sciland: {
      category: '实验室平台',
      status: '研发中',
      subtitle: '科学具身智能实验室平台',
      summary: '将机器人操作与真实实验室工作流程相连接，覆盖基础抓取放置、精细化操作及结构化任务评估。',
      details: 'SciLand 1.0 探索科学实验室场景下具身智能的基础能力。当前工作包括实体机器人部署、可复现操作任务定义，以及逐步提高精度与自主性要求的任务分级。公开资料和演示将在准备完成后提供。',
      tags: ['具身机器人', '科学实验自动化', '真实世界系统']
    }
  };
  const reportZh = {
    'sciland-report': {
      title: 'SciLand 1.0：科学具身智能实验室平台',
      description: '平台概览、实验装置、任务结构和初步评估方法。',
      status: '撰写中',
      summary: 'SciLand 1.0 技术报告将介绍实验室平台、科学操作任务设计与评估方案。报告仍在撰写中，尚未提供公开 PDF。'
    },
    'task-taxonomy': {
      title: '科学实验精细化操作：任务分级体系',
      description: '持续完善的 L0–L5 科学实验室具身操作难度分级。',
      status: '研究笔记',
      summary: '初步分级体系涵盖基础平移与放置、精确对齐、液体处理，以及自主长序列实验流程。这是持续完善的研究内容，尚非正式发布的基准测试。'
    }
  };
  zh.projects = en.projects.map(p => Object.assign({}, p, projectZh[p.id] || {}));
  zh.reports = en.reports.map(r => Object.assign({}, r, reportZh[r.id] || {}));

  // Literal visible English strings in the existing HTML; translating text nodes
  // preserves markup, icons, navigation links, buttons, and interactive behavior.
  const dictionary = {
    'Skip to main content':'跳转至主要内容',
    'SciLand Lab home':'返回 SciLand 实验室首页',
    'Main navigation':'主导航',
    'Mobile navigation':'移动端导航',
    'RESEARCH / EMBODIED AI':'研究 / 具身智能',
    'About':'关于我们',
    'Research':'科研项目',
    'Reports':'技术报告',
    'Approach':'研究理念',
    'Get in touch':'联系我们',
    'Technical reports':'技术报告',
    'Contact':'联系方式',
    'Open navigation':'打开导航菜单',
    'Close navigation':'关闭导航菜单',
    'Website language':'网站语言',
    'SCIENTIFIC EMBODIED INTELLIGENCE / 2026':'科学具身智能 / 2026',
    'RESEARCH AT THE INTERSECTION OF AI & SCIENCE':'探索人工智能与科学的交汇',
    'SciLand research questions and vision':'SciLand 研究问题与愿景',
    'Explore our research':'探索我们的研究',
    'OPEN QUESTIONS. REAL ROBOTS. SCIENTIFIC IMPACT.':'开放问题 · 真实机器人 · 科学影响力',
    'EMBODIED SYSTEM / 01':'具身系统 / 01',
    'CONCEPT VISUAL':'概念示意',
    'PERCEPTION':'感知',
    'REASONING':'推理',
    'CONTROL':'控制',
    'Precision matters':'精度至关重要',
    'Fine-grained manipulation':'精细化操作',
    'Closed-loop learning':'闭环学习',
    'Observe → Verify → Improve':'观察 → 验证 → 改进',
    'EXPLORING EMBODIED SCIENCE':'探索具身科学',
    'SCROLL TO DISCOVER':'向下探索',
    'RESEARCH LAB':'研究实验室',
    'Research topics':'研究主题',
    'ROBOT LEARNING':'机器人学习',
    'SCIENTIFIC AUTOMATION':'科学实验自动化',
    'TRUSTWORTHY AI':'可信人工智能',
    'LONG-HORIZON MANIPULATION':'长序列操作',
    'OUR MISSION':'我们的使命',
    'We think intelligence':'我们相信智能',
    'should be able':'应当能够',
    'to do science.':'开展科学实验。',
    'FROM DIGITAL REASONING':'从数字世界推理',
    'TO PHYSICAL DISCOVERY ↗':'走向物理世界探索 ↗',
    'WHY WE EXIST':'我们的初衷',
    'THE INTELLIGENCE LOOP':'智能闭环',
    'Research cycle: perceive, reason, act, verify':'研究闭环：感知、推理、执行、验证',
    'Observe':'感知',
    'Reason':'推理',
    'Act':'执行',
    'Verify':'验证',
    "WHAT WE'RE BUILDING":'我们的研究',
    'RESEARCH / SELECTED DIRECTIONS':'研究 / 重点方向',
    'Exploring the frontier':'探索前沿',
    'of':'',
    'embodied science.':'具身科学。',
    'From robot workcells to scientific manipulation protocols, SciLand connects embodied intelligence with practical laboratory challenges.':'从机器人实验台到科学操作流程，SciLand 将具身智能与真实实验室需求相结合。',
    'Project descriptions reflect ongoing research directions. Release status is indicated individually; prototypes and outcomes are not presented as published results.':'项目介绍反映当前研究方向。各项成果的公开状态分别标注；原型及初步结果不代表已发表成果。',
    'OUR APPROACH':'研究方法',
    'DESIGNED FOR THE REAL WORLD':'面向真实世界',
    'From knowing':'从理解',
    'to':'走向',
    'doing precisely.':'精准执行。',
    '01 / PERCEIVE':'01 / 感知',
    'Understand the scene.':'理解实验场景。',
    'Ground decisions in visual observations, robot state and scientific context.':'基于视觉观测、机器人状态和科学背景信息作出决策。',
    '02 / EXECUTE':'02 / 执行',
    'Act with precision.':'实现精准操作。',
    'Move from high-level intent to reliable and measurable physical interaction.':'将高层任务意图转化为可靠、可测量的物理交互。',
    '03 / IMPROVE':'03 / 改进',
    'Learn from outcomes.':'从实验结果中学习。',
    'Use verification and feedback to make future task execution more robust.':'通过结果验证与反馈不断提高后续任务执行的鲁棒性。',
    'PUBLICATIONS & DOCUMENTS':'论文与技术文档',
    'KNOWLEDGE / OPEN WHEN READY':'研究资料 / 准备就绪后公开',
    '&':'与',
    'research notes.':'研究笔记。',
    'A growing collection of technical documents, research proposals and working notes. Public PDFs will be linked here as they become available.':'我们持续整理技术报告、研究计划和阶段性笔记；相关 PDF 准备公开后将在此提供链接。',
    'Filter reports':'筛选报告',
    'All documents':'全部文档',
    'Notes & proposals':'笔记与研究计划',
    'No public download URLs have been assigned to draft reports. Add verified PDF links in':'草稿尚未配置公开下载地址。请在',
    'when ready.':'中添加已确认的 PDF 链接。',
    "WHAT'S NEXT":'未来展望',
    'The next experiment':'下一场实验',
    'starts here.':'从这里开始。',
    'Building the bridge between artificial intelligence and scientific experimentation — one reliable action at a time.':'连接人工智能与科学实验，从每一次可靠操作开始。',
    'Back to the beginning':'返回首页',
    'Official contact details will be added here.':'正式联系方式将在此公布。',
    'Scientific Embodied Intelligence':'科学具身智能',
    'Research in motion.':'研究持续进行中。',
    'DESIGNED FOR SCIENTIFIC DISCOVERY':'为科学发现而设计',
    'SCILAND LAB':'SCILAND 实验室',
    'RESEARCH OVERVIEW':'研究概览',
    'Close details':'关闭详情',
    'Open public resource':'打开公开资料',
    'Open public resource ↗':'打开公开资料 ↗',
    'Stylized robotic arm operating over a scientific laboratory workbench':'机械臂在科学实验台上执行操作的示意图',
    'ENTRY':'条记录',
    'ENTRIES':'条记录',
    'Explore the project':'查看项目',
    'Project illustration:':'项目示意图：',
    'Read overview of':'查看项目简介：',
    'Open PDF':'打开 PDF',
    'Read overview':'查看简介',
    'LAB PLATFORM':'实验室平台',
    'In development':'研发中',
    'Technical Report':'技术报告',
    'Research Notes':'研究笔记',
    'In preparation':'撰写中',
    'Working notes':'研究笔记'
  };

  const baseNodes = new WeakMap();
  const baseAttrs = new WeakMap();
  let lang = 'en';
  try { if (window.localStorage.getItem('sciland-language') === 'zh') lang = 'zh'; }
  catch (_) { /* Private browsing can disable storage. */ }
  const clone = x => JSON.parse(JSON.stringify(x));
  function applyData() {
    const selected = lang === 'zh' ? zh : en;
    Object.keys(data).forEach(key => { if (!(key in selected)) delete data[key]; });
    Object.assign(data, clone(selected));
  }
  function translateText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,svg,code,noscript')) continue;
      if (!baseNodes.has(node)) baseNodes.set(node, node.nodeValue);
      const original = baseNodes.get(node);
      const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!match || !Object.prototype.hasOwnProperty.call(dictionary, match[2])) continue;
      node.nodeValue = lang === 'zh' ? match[1] + dictionary[match[2]] + match[3] : original;
    }
  }
  function translateAttributes(root) {
    const attrs = ['aria-label','alt','title','placeholder'];
    for (const element of root.querySelectorAll('[aria-label],[alt],[title],[placeholder]')) {
      if (!baseAttrs.has(element)) {
        const originals = {};
        for (const attr of attrs) if (element.hasAttribute(attr)) originals[attr] = element.getAttribute(attr);
        baseAttrs.set(element, originals);
      }
      const originals = baseAttrs.get(element);
      for (const [attr, english] of Object.entries(originals)) {
        element.setAttribute(attr, lang === 'zh' && Object.prototype.hasOwnProperty.call(dictionary, english)
          ? dictionary[english] : english);
      }
    }
  }
  function applyStatic() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = data.labName + ' — ' + (lang === 'zh' ? '科学具身智能' : 'Scientific Embodied Intelligence');
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = lang === 'zh'
      ? 'SciLand 实验室探索科学具身智能、可信机器人和自主科学实验系统。'
      : 'SciLand Lab explores scientific embodied intelligence, trustworthy robotics, and autonomous experimental systems.';
    translateText(document.body);
    translateAttributes(document.body);
    document.querySelectorAll('button[data-lang]').forEach(button => {
      const active = button.dataset.lang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function t(key) {
    return lang === 'zh' && Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : key;
  }
  function setLanguage(next) {
    if (next !== 'en' && next !== 'zh') return;
    if (next === lang) return;
    lang = next;
    try { window.localStorage.setItem('sciland-language', lang); } catch (_) {}
    applyData();
    applyStatic();
    window.dispatchEvent(new CustomEvent('sciland:languagechange', {detail:{language:lang}}));
  }
  window.SCILAND_I18N = {t, setLanguage, get language(){return lang;}};
  applyData();
  applyStatic();
  document.querySelectorAll('button[data-lang]').forEach(button =>
    button.addEventListener('click', () => setLanguage(button.dataset.lang))
  );
})();