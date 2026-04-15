const tabs = Array.from(document.querySelectorAll('.command-tab'));
const panels = Array.from(document.querySelectorAll('.command-panel'));
const copyButtons = Array.from(document.querySelectorAll('.copy-button'));
const langButtons = Array.from(document.querySelectorAll('.lang-button'));
const translations = {
  "en": {
    "meta": {
      "title": "txiki-cli-lab — tiny runtime, loud ideas",
      "description": "A GitHub Pages promo site for txiki-cli-lab: a tiny txiki.js CLI playground that ships cross-platform binaries and runs JS, TS, WASM, and local HTTP demos."
    },
    "brand": {
      "ariaLabel": "txiki-cli-lab home"
    },
    "nav": {
      "ariaLabel": "Primary",
      "story": "Why it exists",
      "capabilities": "What it runs",
      "release": "Release loop",
      "commands": "Command deck",
      "repo": "Open repo"
    },
    "hero": {
      "eyebrow": "Tiny runtime. Release-first attitude.",
      "title": "Ship a cross-platform JS CLI in one file.",
      "lede": "txiki-cli-lab is a compact txiki.js experiment that compiles into cross-platform binaries, refreshes a rolling dev release on every push, and still gives you room to run JavaScript, TypeScript, WASM, and tiny HTTP demos from one executable.",
      "primaryCta": "Browse releases",
      "secondaryCta": "Explore examples",
      "factsAriaLabel": "Project highlights",
      "facts": {
        "targets": {
          "value": "3",
          "label": "release targets"
        },
        "dev": {
          "value": "1",
          "label": "rolling dev tag"
        },
        "modes": {
          "value": "JS · TS · WASM · HTTP",
          "label": "playground modes"
        }
      },
      "proofLeft": {
        "label": "main push",
        "value": "refreshes dev"
      },
      "proofRight": {
        "label": "smoke tests",
        "value": "guard the binary"
      },
      "terminal": [
        "<span class=\"prompt\">$</span> txiki-cli-lab run-http examples/http-state.ts 0 demo-mode",
        "<span class=\"terminal-ok\">Listening on http://127.0.0.1:3017/</span>",
        "<span class=\"prompt\">$</span> txiki-cli-lab run examples/hello.ts demo mode",
        "{",
        "&nbsp;&nbsp;\"message\": \"hello from TypeScript\",",
        "&nbsp;&nbsp;\"args\": [\"demo\", \"mode\"]",
        "}",
        "<span class=\"prompt\">$</span> txiki-cli-lab run-wasm examples/answer.wasm",
        "<span class=\"terminal-accent\">42</span>"
      ]
    },
    "story": {
      "one": {
        "step": "Chapter 01",
        "title": "CLI experiments usually die in folders.",
        "body": "A pile of scripts, a runtime that only works on your machine, and release notes that exist only in your head. txiki-cli-lab turns that mess into a repeatable shipping loop."
      },
      "two": {
        "step": "Chapter 02",
        "title": "Every push becomes evidence.",
        "body": "The project builds Linux x64, Linux arm64, and Windows x64 binaries, updates a shared dev release, and keeps a versioned path for tagged drops. Less ceremony, more proof."
      },
      "three": {
        "step": "Chapter 03",
        "title": "Play with scripts without abandoning binaries.",
        "body": "Run local JS, on-demand TypeScript, tiny WASM modules, and local HTTP demos from the same tool. It feels like a release candidate and a toybox at the same time."
      }
    },
    "capabilities": {
      "eyebrow": "What it runs",
      "title": "A tiny launcher with multiple personalities.",
      "cards": {
        "js": {
          "title": "JavaScript first",
          "body": "Run local .js and .mjs modules directly, with an injected runtime context for quick experiments."
        },
        "ts": {
          "title": "TypeScript when available",
          "body": "Use esbuild from PATH to transpile .ts and .mts on demand. If it is missing, the binary tells you exactly what to do."
        },
        "wasm": {
          "title": "WASM with no theatrics",
          "body": "Load a .wasm module directly or orchestrate it from JS. Great for proving tiny native-ish ideas without a full app shell."
        },
        "http": {
          "title": "Local HTTP demos",
          "body": "Turn a script into a small web endpoint with one command. Useful for promo pages, fixtures, and tiny web toy servers."
        }
      }
    },
    "release": {
      "eyebrow": "Release loop",
      "title": "One repo, two speeds.",
      "steps": {
        "main": {
          "title": "Push to main",
          "body": "Builds all targets, uploads workflow artifacts, and refreshes a shared dev prerelease tag."
        },
        "tag": {
          "title": "Tag a version",
          "body": "Uses the same build path, but promotes assets into a clean versioned release for keeps."
        },
        "proof": {
          "title": "Ship proof, not promises",
          "body": "The smoke suite validates command behavior before artifacts leave the workflow."
        }
      }
    },
    "commands": {
      "eyebrow": "Command deck",
      "title": "Pick a lane. The binary already knows the drill.",
      "tabAriaLabel": "Command samples",
      "tabs": {
        "release": "release"
      },
      "panels": {
        "run": {
          "label": "On-demand playground script",
          "code": "txiki-cli-lab run examples/hello.ts demo mode\n{\n  \"message\": \"hello from TypeScript\",\n  \"args\": [\"demo\", \"mode\"]\n}"
        },
        "http": {
          "label": "Tiny local web route",
          "code": "txiki-cli-lab run-http examples/http-state.ts 0 demo-mode\nListening on http://127.0.0.1:3017/\n{\"command\":\"run-http\",\"path\":\"/\",\"args\":[\"demo-mode\"]}"
        },
        "wasm": {
          "label": "Minimal wasm roundtrip",
          "code": "txiki-cli-lab run-wasm examples/answer.wasm\n42"
        },
        "release": {
          "label": "Release evidence",
          "code": "push -> main\n  • build linux-x64 / linux-arm64 / windows-x64\n  • update shared dev release\n\npush -> v0.1.0\n  • build same matrix\n  • publish versioned GitHub Release"
        }
      },
      "copy": "Copy command",
      "copied": "Copied",
      "fallback": "Copy manually"
    },
    "proof": {
      "ariaLabel": "Credibility markers",
      "packaging": {
        "label": "Packaging",
        "value": "Linux x64 · Linux arm64 · Windows x64"
      },
      "runtime": {
        "label": "Runtime",
        "value": "txiki.js + JS + TS + WASM + local HTTP"
      },
      "workflow": {
        "label": "Workflow",
        "value": "Rolling dev release + tag releases"
      }
    },
    "cta": {
      "eyebrow": "Ready to poke it?",
      "title": "Open the repo, grab a build, then make it do something weird.",
      "body": "The page is static. The binary is not. Start with the examples, then mutate the runtime in public.",
      "repo": "GitHub repository",
      "releases": "Releases",
      "examples": "Examples index"
    }
  },
  "zh": {
    "meta": {
      "title": "txiki-cli-lab — 小体积 runtime，大胆玩法",
      "description": "txiki-cli-lab 的 GitHub Pages 宣传页：一个基于 txiki.js 的小型 CLI 游乐场，支持跨平台二进制发布，也能运行 JS、TS、WASM 和本地 HTTP demo。"
    },
    "brand": {
      "ariaLabel": "txiki-cli-lab 首页"
    },
    "nav": {
      "ariaLabel": "主导航",
      "story": "为什么做它",
      "capabilities": "它能跑什么",
      "release": "发布节奏",
      "commands": "命令卡组",
      "repo": "打开仓库"
    },
    "hero": {
      "eyebrow": "小体积 runtime，发布优先。",
      "title": "把跨平台 JS CLI 打包成单文件",
      "lede": "txiki-cli-lab 是一个紧凑的 txiki.js 实验项目：它能编译成跨平台二进制，每次 push 自动刷新滚动 dev release，同时还保留运行 JavaScript、TypeScript、WASM 和本地 HTTP demo 的空间。",
      "primaryCta": "查看发布物",
      "secondaryCta": "浏览示例",
      "factsAriaLabel": "项目亮点",
      "facts": {
        "targets": {
          "value": "3",
          "label": "发布目标平台"
        },
        "dev": {
          "value": "1",
          "label": "滚动 dev 标签"
        },
        "modes": {
          "value": "JS · TS · WASM · HTTP",
          "label": "可玩模式"
        }
      },
      "proofLeft": {
        "label": "push 到 main",
        "value": "自动刷新 dev"
      },
      "proofRight": {
        "label": "smoke 测试",
        "value": "守住二进制质量"
      },
      "terminal": [
        "<span class=\"prompt\">$</span> txiki-cli-lab run-http examples/http-state.ts 0 demo-mode",
        "<span class=\"terminal-ok\">Listening on http://127.0.0.1:3017/</span>",
        "<span class=\"prompt\">$</span> txiki-cli-lab run examples/hello.ts demo mode",
        "{",
        "&nbsp;&nbsp;\"message\": \"hello from TypeScript\",",
        "&nbsp;&nbsp;\"args\": [\"demo\", \"mode\"]",
        "}",
        "<span class=\"prompt\">$</span> txiki-cli-lab run-wasm examples/answer.wasm",
        "<span class=\"terminal-accent\">42</span>"
      ]
    },
    "story": {
      "one": {
        "step": "章节 01",
        "title": "CLI 实验常常死在临时目录里。",
        "body": "一堆脚本、只在自己机器上能跑的 runtime，以及只存在脑海里的 release note。txiki-cli-lab 做的事，就是把这团东西整理成可重复的发布链路。"
      },
      "two": {
        "step": "章节 02",
        "title": "每次 push 都会留下证据。",
        "body": "项目会构建 Linux x64、Linux arm64、Windows x64 三套二进制，更新共享的 dev release，并保留 tag 版本的正式发布路径。少一点仪式感，多一点可验证结果。"
      },
      "three": {
        "step": "章节 03",
        "title": "不用放弃二进制，也能继续玩脚本。",
        "body": "你可以在同一个工具里跑本地 JS、按需转译的 TypeScript、小型 WASM 模块，以及本地 HTTP demo。它一边像 release candidate，一边又像玩具箱。"
      }
    },
    "capabilities": {
      "eyebrow": "它能跑什么",
      "title": "一个小型启动器，多种人格。",
      "cards": {
        "js": {
          "title": "先把 JavaScript 跑顺",
          "body": "本地 .js / .mjs 可以直接运行，还会注入一份 runtime 上下文，适合快速实验。"
        },
        "ts": {
          "title": "TypeScript 按需出场",
          "body": "如果 PATH 里有 esbuild，就能按需转译 .ts / .mts。没有也没关系，二进制会直接告诉你下一步做什么。"
        },
        "wasm": {
          "title": "WASM 不装神弄鬼",
          "body": "既可以直接运行 .wasm，也可以从 JS 里编排它，适合验证小而硬的想法。"
        },
        "http": {
          "title": "本地 HTTP demo",
          "body": "一条命令把脚本变成小型网页或接口，做宣传页、fixture、玩具服务器都很顺手。"
        }
      }
    },
    "release": {
      "eyebrow": "发布节奏",
      "title": "一个仓库，两种速度。",
      "steps": {
        "main": {
          "title": "push 到 main",
          "body": "构建全部目标平台、上传 workflow artifact，并刷新共享的 dev 预发布标签。"
        },
        "tag": {
          "title": "打版本标签",
          "body": "沿用同一套构建流程，但把资产提升为干净、可留档的正式版本发布。"
        },
        "proof": {
          "title": "发布证据，不发布口号",
          "body": "二进制离开 workflow 之前，会先经过 smoke suite 的验证。"
        }
      }
    },
    "commands": {
      "eyebrow": "命令卡组",
      "title": "选一条路走，二进制已经知道该怎么配合。",
      "tabAriaLabel": "命令示例",
      "tabs": {
        "release": "发布"
      },
      "panels": {
        "run": {
          "label": "按需运行的脚本模式",
          "code": "txiki-cli-lab run examples/hello.ts demo mode\n{\n  \"message\": \"hello from TypeScript\",\n  \"args\": [\"demo\", \"mode\"]\n}"
        },
        "http": {
          "label": "本地网页 / 接口模式",
          "code": "txiki-cli-lab run-http examples/http-state.ts 0 demo-mode\nListening on http://127.0.0.1:3017/\n{\"command\":\"run-http\",\"path\":\"/\",\"args\":[\"demo-mode\"]}"
        },
        "wasm": {
          "label": "最小 WASM 往返",
          "code": "txiki-cli-lab run-wasm examples/answer.wasm\n42"
        },
        "release": {
          "label": "发布链路摘要",
          "code": "push -> main\n  • 构建 linux-x64 / linux-arm64 / windows-x64\n  • 刷新共享 dev release\n\npush -> v0.1.0\n  • 走同一套矩阵构建\n  • 发布正式 GitHub Release"
        }
      },
      "copy": "复制命令",
      "copied": "已复制",
      "fallback": "请手动复制"
    },
    "proof": {
      "ariaLabel": "可信度标记",
      "packaging": {
        "label": "打包目标",
        "value": "Linux x64 · Linux arm64 · Windows x64"
      },
      "runtime": {
        "label": "运行能力",
        "value": "txiki.js + JS + TS + WASM + 本地 HTTP"
      },
      "workflow": {
        "label": "工作流",
        "value": "滚动 dev release + tag 正式发布"
      }
    },
    "cta": {
      "eyebrow": "想上手试试？",
      "title": "打开仓库，抓一个构建包，然后让它做点奇怪的事。",
      "body": "页面是静态的，二进制不是。先从 examples 开始，再把它改造成你自己的小 runtime。",
      "repo": "GitHub 仓库",
      "releases": "发布页",
      "examples": "示例索引"
    }
  }
};

function getValue(language, key) {
  return key.split('.').reduce((acc, part) => acc?.[part], translations[language]);
}

function renderTerminal(lines) {
  return lines.map(line => `<p>${line}</p>`).join('');
}

function activatePanel(targetId) {
  tabs.forEach(tab => {
    const active = tab.dataset.panel === targetId;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  panels.forEach(panel => {
    const active = panel.id === targetId;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

let currentLanguage = 'en';

function detectBrowserLanguage() {
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || 'en'];

  return candidates.some(value => String(value).toLowerCase().startsWith('zh')) ? 'zh' : 'en';
}

function applyTranslations(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = translations[language].meta.title;
  document.querySelector('meta[name="description"]').setAttribute('content', translations[language].meta.description);

  document.querySelectorAll('[data-i18n]').forEach(node => {
    const value = getValue(language, node.dataset.i18n);
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(node => {
    const value = getValue(language, node.dataset.i18nAriaLabel);
    if (typeof value === 'string') {
      node.setAttribute('aria-label', value);
    }
  });

  document.querySelector('[data-terminal="hero"]').innerHTML = renderTerminal(translations[language].hero.terminal);
  document.querySelector('[data-i18n="commands.panels.run.code"]').textContent = translations[language].commands.panels.run.code;
  document.querySelector('[data-i18n="commands.panels.http.code"]').textContent = translations[language].commands.panels.http.code;
  document.querySelector('[data-i18n="commands.panels.wasm.code"]').textContent = translations[language].commands.panels.wasm.code;
  document.querySelector('[data-i18n="commands.panels.release.code"]').textContent = translations[language].commands.panels.release.code;

  copyButtons.forEach(button => {
    button.textContent = translations[language].commands.copy;
    button.dataset.defaultLabel = translations[language].commands.copy;
    button.dataset.copiedLabel = translations[language].commands.copied;
    button.dataset.fallbackLabel = translations[language].commands.fallback;
  });

  langButtons.forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function setLanguage(language) {
  const next = translations[language] ? language : 'en';
  localStorage.setItem('txiki-cli-lab-language', next);
  applyTranslations(next);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activatePanel(tab.dataset.panel));
});

function toggleLanguage() {
  setLanguage(currentLanguage === 'en' ? 'zh' : 'en');
}

langButtons.forEach(button => {
  button.addEventListener('click', toggleLanguage);
});

copyButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy ?? '';

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = button.dataset.copiedLabel;
      button.classList.add('copied');
      window.setTimeout(() => {
        button.textContent = button.dataset.defaultLabel;
        button.classList.remove('copied');
      }, 1200);
    } catch {
      button.textContent = button.dataset.fallbackLabel;
      window.setTimeout(() => {
        button.textContent = button.dataset.defaultLabel;
      }, 1200);
    }
  });
});

const initialLanguage = localStorage.getItem('txiki-cli-lab-language') || detectBrowserLanguage();
applyTranslations(translations[initialLanguage] ? initialLanguage : 'en');
