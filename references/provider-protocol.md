# MonitorBar · Design Provider Protocol v1

适配 product-ui 的 `references/design-provider-protocol.md`，2026-10-22 按本机 product-ui v3.7 / Contract 1.0 核对。原始 Provider ID 为 `monitorbar-desktop-style`，版本从 [VERSION](../VERSION) 读取。此处是指令级交接，不是可调用 API、插件注册或自动执行保证；manifest 不能证明已安装或已调用。

如上层契约更新，先读取实际安装的 product-ui 原文并核对，不默认为兼容。不要求单独使用本 Skill 的用户安装 product-ui。

## 模式与权限

| 模式 | 项目写入 | 返回内容 |
|---|---|---|
| `style-candidate` | 禁止 | 同一已规划表面的视觉候选、可供上层渲染的代码片段、适配限制；不自选为最终方案 |
| `spec` | 禁止 | 已选风格的语义 Token、组件映射、状态与动效规范 |
| `implement` | 仅交接单明确允许的文件 / 表面 | 实际补丁或代码、产物位置、实际检查结果 |
| `style-audit` | 禁止 | 与已接受风格的偏差、位置 / 证据、严重程度与建议；不顺手修复 |

只读模式在回复中返回内容；产物若需落入项目，由 product-ui 写入。缺少模式、关键业务上下文、风格选择依据或实现文件范围时，向上层报告缺口；不把缺失信息当作默认写入授权。`implement` 缺少明确范围时停止写入，仍可返回只读建议。

Provider 不修改 PRODUCT.md 或项目的唯一 DESIGN.md，不创建竞争规范，不重跑用户关卡，不调度 Hallmark、Impeccable 或 shadcn agent Skill。依赖建议不代表安装授权。保留现有框架、API、权限、导航目的、密度、键盘语义和业务状态；若视觉基线冲突，提出适配建议，由上层裁决。

## 输入

完整示例见 [音频浮层 spec 交接单](../examples/provider-handoff.yaml)。接收以下字段；非关键未知值明确标记，不编造：

- `contract_version`, `request_id`, `provider_id`, `mode`。
- `project_route`：`NEW_BUILD / EXISTING_IMPROVE / EXISTING_REDESIGN / EXISTING_REBUILD`，由 product-ui 决定。
- `visual_intent`：明确用户选择、已认可 DESIGN.md 或候选比较委派；本 Skill 的默认浅色不覆盖既有视觉系统。
- `product_job`：用户、主要对象 / 任务、操作频率、密度和必要交互。
- `surface_blueprint`：已同意的区域、导航、状态和数据契约。
- `environment`：框架、现有组件、目标系统、浏览器或宿主限制。
- `design_source`：已接受 DESIGN.md、已有实现或新项目无既有系统。
- `change_scope`, `deliverable`, `constraints`：只读或明确可改路径、要求产物、无障碍与权限约束。

接受浮层、托盘和菜单栏相关表面。通用 SaaS / 完整工作台不因用户选中 Provider 就硬套 360 窄面板；返回 `skipped-not-needed` 并说明适用边界，交回 product-ui。混合项目只处理明确委派的浮层部分。

## 执行映射

1. 按 [银白主题](theme-light.md) 和 [组件适配](component-patterns.md) 对既定区域作视觉映射；只有明确选择原版深色时，使用 [上游规范](design-spec.md) 的配色。业务组件建议在 Provider 模式下不授权增删任务或分页。
2. 从 [tokens.json](../assets/tokens.json) 取语义角色；新浅色 Web 实现显式 `data-theme="light"`。辅助字、尺寸与密度服从真实缩放和上层任务；上游小字号只是提取记录。
3. 按 [manifest](../design-provider.json) 报告框架级别。HTML/CSS 可直接复用；React / Vue / Electron / Tauri 需要适配；SwiftUI / AppKit / WinUI / Qt / Go 仅提供指导，不声称已有可运行原生组件。
4. 颜色反馈可沿用 Web 样板 120 ms，快速切换随最新状态反馈；减少动态效果时取消过渡。原生弹窗、关闭和焦点交宿主，不能从 Web 样板推断原生测试通过。没有任务价值时无需新动效或动效依赖。
5. 专项审查实际使用的主题、层级、组件状态与平台表达；保留用户批准的覆盖项。语义状态、焦点要求来自上层，本 Skill 负责可见表达与受委派的实现。

## 输出

返回结构化摘要（YAML、JSON 或同字段的文字均可）：

- `provider_id`, `provider_version`（实际 VERSION）, `contract_version`, `request_id`, `mode`, `status`。
- `visual_family` 与 `preset`：通常 `monitorbar-compact` / `apple-inspired-light`；若为原版则明确 `monitorbar-dark`，附选择依据和约束。
- `design_decisions`：主题、Token 来源、字体、表面、图标、已接受覆盖项；区分建议和已应用。
- `component_mapping`：每个已规划区域 → 对应组件 / 现有库、适配方法与限制。
- `motion`：相关触发、时长、打断、减少动态效果、焦点；没有动效时写不适用。
- `artifacts` 与 `verification`：真实文件 / 补丁 / 回复中的规范、检查方法与结果；没有生成或没有检查的内容不能列为已完成。
- `compatibility`：框架及 `native / adapted / guidance`、实际依赖、待授权依赖和原生实现缺口。
- `unresolved`：需 product-ui 决策或补充的信息。
- `style_conformance`：`pass / warnings / fail / not-tested`，附具体证据。只生成规范而未实现或查看当前界面时使用 `not-tested`。

`status` 仅使用 `executed / skipped-not-needed / unavailable / blocked / failed`。`executed` 表示该模式已实际执行，不能等同于产品测试通过。已有样板的历史验证不证明新产品、真实系统托盘或新框架集成通过；视觉一致性审查也不能代替 product-ui 的完整 UX、可访问性和原生验收。

product-ui 可将接受的 Provider ID、VERSION、Contract 1.0、family / preset 和项目覆盖项写入其唯一 DESIGN.md。Provider 本身仅返回这些候选信息。
