# 动态（updates）

记录个人活动与近况。主页 **动态** 区块展示按 `date` 从新到旧的最新 5 条；完整列表在 `updates.html`，正文在：

```text
post.html?collection=updates&slug=文件名
```

## 文风

动态宜 **短、口语、记事**。`title` 短一点，`summary` 一句话即可；正文通常一句话 + 链接，不必写成长文。

## 文件格式

```markdown
---
title: 短标题
date: 2026-07-14
summary: 可选，卡片上显示的一句话
---

一句话说明…… [链接文字](https://example.com)
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 建议 | 标题；缺省则用文件名 |
| `date` | **是**（排序用） | `YYYY-MM-DD`，越新越靠前 |
| `summary` | 否 | 主页 / 列表摘要；缺省取正文前约 120 字 |

- 文件名即 slug：`hello.md` → `post.html?collection=updates&slug=hello`
- 忽略：`README.md`、以下划线开头的文件（如 `_draft.md`）

## 发布到 GitHub

```bash
cd /Users/yusa/GrokWorkSpace/Personalhomepage
./scripts/publish-content.sh updates
# 或自定义提交说明：
./scripts/publish-content.sh updates "updates: add note"
```

只想本地预览、不推送时：

```bash
python3 scripts/build_content.py updates
python3 -m http.server 8080
```
