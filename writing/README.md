# Writing / Notes

把随笔、notes、博客草稿放在这里。主页会展示**按 `date` 从新到旧**排序的最新 5 条；完整列表在 `writing.html`，正文在 `post.html?slug=文件名`。

## 文件格式

```markdown
---
title: 标题
date: 2026-07-11
summary: 可选，卡片上显示的一句话
---

正文用 Markdown 写……
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 建议 | 标题；缺省则用文件名 |
| `date` | **是**（排序用） | `YYYY-MM-DD`，越新越靠前 |
| `summary` | 否 | 主页 / 列表摘要；缺省取正文前约 120 字 |

- 文件名即 slug：`hello-world.md` → `post.html?slug=hello-world`
- 忽略：`README.md`、以下划线开头的文件（如 `_draft.md`）

## 发布到 GitHub

```bash
cd /Users/yusa/GrokWorkSpace/Personalhomepage
./scripts/publish-writing.sh
# 或自定义提交说明：
./scripts/publish-writing.sh "writing: add note on markets"
```

脚本会：生成 `data/writing-index.json` → 仅暂存 `writing/` 与该索引 → commit → push。

只想本地预览、不推送时：

```bash
python3 scripts/build_writing.py
python3 -m http.server 8080
```

打开 http://localhost:8080
