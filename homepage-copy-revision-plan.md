# Homepage 文案修改方向

目标：把个人主页从“Ph.D. Candidate + GUI Testing”为中心，更新为“已完成博士 + 阿尔伯塔大学博后 + AI&SE / coding agents / agent 构建”为中心，同时保留既有软件测试、GUI 测试、ART 工作作为研究基础和历史贡献。

## 需要同步更新的事实

- Ph.D. 状态：已毕业，不再写 `Ph.D. Candidate`。
- 博士毕业日期：2026-06-22。
- 博士入学时间：2023-09。
- 博后经历：University of Alberta，2026.06 至今，指导老师建议英文写作 `Prof. Lei Ma`。
- 产业经历：2026.07 起将加入同花顺，方向面向 agent。公司英文名建议暂写 `Hithink RoyalFlush Information Network Co., Ltd. (Tonghuashun)`，但最终上线前最好确认入职合同或公司英文抬头。
- 研究方向：从 GUI testing 主叙事转向 AI&SE。GUI testing 可以保留为 previous work / research foundation，不再放在当前研究兴趣的核心位置。
- 邮箱先统一替换为 `chenhuicui97@gmail.com`。
- News 可以增加博士毕业和博后开始两条；同花顺入职新闻暂不加。

## 总体叙事

建议新的主页叙事是：

> I work at the intersection of AI and software engineering. My previous work studied software testing, adaptive random testing, and mobile/web GUI testing. Moving forward, I am exploring coding agents and agent-oriented software engineering, with an emphasis on how agents understand, modify, test, and maintain real software systems.

这样写的好处：

- 不否定之前的 GUI/testing 成果，只是把它们从“当前主线”改为“研究基础”。
- AI&SE 是总方向，coding agents 和 agent construction 是下一阶段聚焦点。
- “刚起步”的状态可以用 `exploring` / `expanding this line toward` 表达，不会显得过度承诺。
- 同花顺 agent 岗位可以作为 applied engineering direction，不建议把它写成已经有完整研究成果。

## Profile Card

当前位置：`index.html` 左侧个人卡片。

建议修改：

```html
<p class="text-lg text-accent font-medium mb-1">Postdoc Research Fellow</p>
<p class="text-neutral-600 mb-2">University of Alberta</p>
```

如果想同时展示即将入职同花顺，可以更稳妥地放到 Work Experience，而不是塞进左侧卡片。左侧卡片保持当前身份最清楚。

## Research Interests

当前列表里 `Android/Web GUI Testing` 太像主方向。建议改成：

```html
<span class="text-sm font-medium">AI for Software Engineering</span>
<span class="text-sm font-medium">Coding Agents & Agentic Software Engineering</span>
<span class="text-sm font-medium">Software Testing & Quality Assurance</span>
<span class="text-sm font-medium">Agent Evaluation & Reliability</span>
```

如果希望更偏工程落地，可以把最后一项换成：

```html
<span class="text-sm font-medium">Agent Construction & Tool Use</span>
```

不建议继续把 `Android/Web GUI Testing` 放在研究兴趣卡片里。它可以留在论文、经历、Research Thrust 的 prior work 描述中。

## About Me

建议替换当前 About Me 第一段和第二段为：

```html
<p class="mb-4">
    I am a postdoc research fellow at the University of Alberta, working with Prof. Lei Ma.
    I received my Ph.D. in Computer Technology and Its Applications from Macau University of Science and Technology (MUST) on June 22, 2026, advised by Prof. Rubing Huang.
    I received my M.S. degree (2022) and B.S. degree (2019) from Jiangsu University.
</p>

<p class="mb-4">
    My research lies at the intersection of AI and software engineering.
    My previous work studied software testing, adaptive random testing, and mobile/web GUI testing.
    Moving forward, I am expanding this line toward coding agents and agent-oriented software engineering, focusing on how agents understand, modify, test, and maintain real software systems.
</p>
```

如果想把“同花顺 2026.07”也放进 About Me，可以加一句，但建议等正式入职或确认 title 后再上线：

```html
<p class="mb-4">
    Starting in July 2026, I will join Hithink RoyalFlush Information Network Co., Ltd. (Tonghuashun), working on agent-oriented software systems.
</p>
```

## Collaboration Highlight

当前 highlight 还在强调 `mobile testing, GUI modeling, or AI4SE`。建议改成：

```html
<p>
    <strong><i class="fas fa-lightbulb text-accent mr-2"></i>I am open to research collaboration.</strong>
    If you are interested in AI for Software Engineering, coding agents, agent evaluation, or software testing, feel free to reach out:
    <a href="mailto:chenhuicui97@gmail.com" class="link-highlight">chenhuicui97@gmail.com</a>.
</p>
```

邮箱先统一替换为 `chenhuicui97@gmail.com`，包括左侧个人卡片、About Me collaboration highlight 和 Contact。

## Education

博士条目不再写 `Ph.D. Candidate`，建议改成：

```html
<h3 class="font-semibold text-primary">Ph.D.</h3>
<p class="text-sm text-accent font-medium">Macau University of Science and Technology (MUST)</p>
<p class="text-sm text-neutral-500">Sept. 2023 - Jun. 2026</p>
<p class="text-sm text-neutral-600 mt-1">
    Ph.D. in Computer Technology and Its Applications. Advisor: Prof. Rubing Huang.
    Degree completed on June 22, 2026.
</p>
```

如果页面空间紧，可以缩成：

```html
Ph.D. in Computer Technology and Its Applications. Advisor: Prof. Rubing Huang.
```

毕业日期已经在 About Me 写过，Education 里可以不重复。

## Work Experience

建议在 Work Experience 顶部新增两个条目：博后和同花顺。由于同花顺是 2026.07 开始，当前可以写 `Incoming` 或 `Starting Jul. 2026`。

### Postdoc

```html
<h3 class="font-semibold text-primary">Postdoc Research Fellow</h3>
<p class="text-sm text-accent font-medium">University of Alberta · Edmonton, Canada</p>
<p class="text-sm text-neutral-500">Jun. 2026 - Present</p>
<p class="text-sm text-neutral-600 mt-1">
    Research on AI for Software Engineering, coding agents, and agent-oriented software engineering with Prof. Lei Ma.
</p>
```

### Tonghuashun

如果正式 title 未确认，建议不要写死 `Software Engineer`，先用更稳的：

```html
<h3 class="font-semibold text-primary">Incoming Agent-Oriented R&D Role</h3>
<p class="text-sm text-accent font-medium">Hithink RoyalFlush Information Network Co., Ltd. (Tonghuashun) · China</p>
<p class="text-sm text-neutral-500">Starting Jul. 2026</p>
<p class="text-sm text-neutral-600 mt-1">
    Work on agent-oriented software systems and applied agent engineering.
</p>
```

如果入职后确认 title，再改成：

```html
<h3 class="font-semibold text-primary">Agent-Oriented Software Engineer</h3>
```

## Research Thrust

当前 Research Thrust 的 quote 和第一张卡都太 GUI-oriented。建议整体换成 AI&SE / coding agent 主线。

### Quote

```html
<blockquote class="pl-4 border-l-4 border-accent/30 italic text-neutral-600 bg-neutral-50/50 p-4 rounded-r-lg mb-6">
    "I study how AI agents can be engineered, evaluated, and integrated into software development workflows.
    My near-term focus is on coding agents: their repository-level reasoning, tool use, test-feedback loops, and reliability in real-world engineering settings."
</blockquote>
```

### Thrust 1

```html
Coding Agents & Agentic Software Engineering
```

```html
I am interested in how coding agents plan, edit, test, and maintain software across realistic repositories, and how agent workflows can be constructed to support reliable software development.
```

### Thrust 2

```html
AI for Software Engineering & Software Quality
```

```html
My previous work in software testing, adaptive random testing, and mobile/web GUI testing provides the quality-assurance foundation for my current AI&SE direction. I am interested in using AI techniques to improve software testing, maintenance, and evaluation under practical engineering constraints.
```

这样可以把 GUI testing 放到第二张卡的背景里，而不是让它继续主导页面。

## News

可以在 `data/news.json` 增加博士毕业和博后开始两条新闻：

```json
{
  "date": "2026-06-22",
  "content": "I received my Ph.D. in Computer Technology and Its Applications from Macau University of Science and Technology."
}
```

```json
{
  "date": "2026-06",
  "content": "I started as a postdoc research fellow at the University of Alberta, working with Prof. Lei Ma."
}
```

同花顺入职新闻暂不加，等 2026.07 正式入职或 title/公司英文名确认后再更新。

## Contact

当前 Contact 地址仍是 MUST。建议后续有 UAlberta 邮箱或办公地址后统一改：

```html
University of Alberta<br>Edmonton, Alberta, Canada
```

邮箱先统一替换为：

```html
chenhuicui97@gmail.com
```

## 推荐实施顺序

1. 先改 `Profile Card`、`About Me`、`Education`、`Work Experience`，这些是身份事实，优先级最高。
2. 再改 `Research Interests` 和 `Research Thrust`，完成从 GUI testing 到 AI&SE/coding agents 的叙事迁移。
3. 再统一替换邮箱为 `chenhuicui97@gmail.com`，并同步更新 `Contact`。
4. 在 `data/news.json` 增加博士毕业和博后开始两条新闻。
5. 同花顺条目的正式 title、城市、公司英文名建议入职材料确认后再定稿，News 里暂不加同花顺入职新闻。

## 外部命名确认

- Prof. Lei Ma 的 UAlberta 目录页显示其为 University of Alberta Faculty of Engineering / Electrical & Computer Engineering 的 Associate Professor: https://apps.ualberta.ca/directory/person/lma7
- Prof. Lei Ma 个人主页显示其与 University of Alberta 有任职关系，并聚焦 Software Engineering and Artificial Intelligence: https://www.malei.org/
- 同花顺英文名常见写法为 `Hithink RoyalFlush Information Network Co., Ltd.`，但最终页面建议以正式入职文件或公司英文抬头为准。
