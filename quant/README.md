# 量化研究（quant）

把量化研究的小论文、回测报告、策略笔记放在这里。主页 **量化研究** 区块展示按 `date` 从新到旧的最新 5 条；完整列表在 `quant.html`，正文在：

```text
post.html?collection=quant&slug=文件名
```

## 文件格式

```markdown
---
title: 标题
date: 2026-10-20
summary: 可选，卡片上显示的一句话
---

正文用 Markdown 写……
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 建议 | 标题；缺省则用文件名 |
| `date` | **是**（排序用） | `YYYY-MM-DD`，越新越靠前 |
| `summary` | 否 | 主页 / 列表摘要；缺省取正文前约 120 字 |

- 文件名即 slug：`mean-reversion.md` → `post.html?collection=quant&slug=mean-reversion`
- 也可直接放 `.pdf`。标题、日期、摘要写在同目录 `meta.json`（按文件名索引）；卡片链到 GitHub Pages 上的 PDF 直链。
- 忽略：`README.md`、`meta.json`、以下划线开头的文件（如 `_draft.md`）

## 发布到 GitHub

```bash
cd /Users/yusa/GrokWorkSpace/Personalhomepage
./scripts/publish-content.sh quant
# 或自定义提交说明：
./scripts/publish-content.sh quant "quant: add report"
```
