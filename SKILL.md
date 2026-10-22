---
name: monitorbar-desktop-style
description: 为 macOS 菜单栏、Windows 系统托盘及弹出控制面板提供 MonitorBar 风格设计、实现和审查；可独立使用或作为 product-ui Design Provider。默认紧凑浮层、苹果风银白浅色与蓝色点缀，保留深色橙主题。适用于 menu bar app、tray app、flyout；不用于网页底部状态条、通用 SaaS 或完整桌面工作台。
---

# MonitorBar 状态栏风格

用户于 2026-10-15 认可本地苹果风浅色交付，并要求固化为以后 macOS 菜单栏 / Windows 托盘工具的可复用 Skill。继承 MonitorBar 的紧凑结构，默认使用银白底、白卡片、浅灰控件、石墨文字和少量蓝色；不使用绿色。后续明确要求与已有项目主题优先，原版深色橙作为可选主题。这不代表替换操作系统的菜单栏或任务栏。

## product-ui Provider 模式

支持 Design Provider Protocol v1（`contract_version: "1.0"`），版本见 [VERSION](VERSION)，发现元数据见 [design-provider.json](design-provider.json)。收到 product-ui 委派时先读取 [Provider 契约](references/provider-protocol.md)，按 `style-candidate / spec / implement / style-audit` 执行并返回结果。

`style-candidate`、`spec` 和 `style-audit` 都只读；只有 `implement` 可修改交接单明确允许的文件。product-ui 保留任务、信息架构、导航、密度、业务语义、规划与验收关卡，以及 PRODUCT.md、唯一 DESIGN.md 和外部审查 Skill 的调度权。本 Skill 只处理已确定结构的视觉表达，不自行改变分页或隐藏必要业务信息，不重复询问上层已完成的批准，不调用 Hallmark / Impeccable / shadcn agent Skill。

Provider 选择须来自当前用户意图、已接受 DESIGN.md 或候选比较委派；安装本 Skill 不自动改造已有项目。360 宽、字号与卡片密度是风格基线，不覆盖上层可读性、缩放和任务约束。超出菜单栏 / 托盘浮层的表面交回 product-ui 选择其他方案。独立使用时按下述流程工作，无需安装 product-ui。

## 使用

确认目标是浮层、托盘入口、组件适配还是风格审查。读取现有实现和业务能力，保留功能、数据及技术栈。新工具只澄清影响主要交互的信息；风格已指定时不再要求选择视觉方向。

- 设计 / 实现：先读取 [苹果风银白主题](references/theme-light.md) 与 [组件与业务适配](references/component-patterns.md)，使用完整语义颜色组，按实际任务选择组件。
- 精确几何 / 原版深色 / 源码拆解：按需读取 [上游设计规范](references/design-spec.md)。其中深色、橙色、绿色连接点和设备光晕属于原作，不覆盖已认可的浅色方案。
- 原生窗口 / 跨平台适配：读取 [平台与交互契约](references/platform-contract.md)。HTML 预览不等于托盘集成。
- 查证或分发：读取 [来源映射](references/source-map.md)，必要时检查 `references/upstream/*.go`；复用原作内容时保留 MIT 许可。
- 视觉校准：`assets/preview.html?theme=light` 是已认可方案的可操作 Web 样板；`?theme=dark` 与 `assets/screenshots/` 用于原版对照，截图均为上游深色。
- Web 栈：从 `assets/tokens.json`、`assets/monitorbar.css` 复用参数，浅色根节点显式设置 `class="mb" data-theme="light"`。CSS 无主题时的深色基线用于兼容原版，不是新工具的默认选择。演示脚本不直接接设备 API。

## 必须保留的视觉特征

1. **窄幅控制浮层**：基线 360 逻辑单位宽，随内容调高；短屏只滚动内容。标题、分页、状态稳定，不扩成带侧栏的后台。
2. **克制的表面层次**：默认银白底、白色卡片、浅灰控件，以明度、细边和间距区分层级。标题图标与可选设备预览保持中性，不添加有色光晕、大面积强调色或装饰性玻璃模糊。
3. **单一强调色**：图形蓝 `#007AFF`，小号强调文字用较深 `#0066CC`；用于选中、滑轨和当前指标。连接点也用蓝色并配文字；错误 / 检测有各自语义色。原版深色使用橙 `#FF6900` / `#FF4500`。
4. **紧凑层级**：面板 / 卡片 / 控件圆角 16 / 12 / 9；外 / 内 padding 13 / 12；组间距 12。浅色基线为 12 标题、11 辅助、16 名称、20–22 数值。尺寸为逻辑单位，按系统字体、文本缩放和可读性调整。
5. **一组功能一张卡**：图标、名称、右侧当前值 / 说明，下方直接操作。分类、选项、模式分别用图标分段栏、选项块和紧凑列表。
6. **即时操作与渐进展开**：常用操作进概览，低频应用操作进更多。不支持的能力隐藏；暂时失败要反馈与恢复，不能混为不支持。

## 迁移边界

继承密度、层级、选中态和浮层行为，不硬套显示器、分辨率与四个分页。单一任务可不设分页，列表工具可让列表成为主体。设备插画仅在帮助理解设备或状态时保留；没有数据需求时不加图表。具体映射见组件与业务适配。

图标采用 24 网格、2 线宽、圆端点体系。原作没有指定字体家族，使用平台系统字体，不宣称已提取精确 SF Pro / Segoe UI 字体。

Go / SwiftUI / AppKit / WinUI / Qt 采用语义与参数；Electron / Tauri / WebView 采用 CSS 适配。不为风格强制换框架。系统字体渲染、焦点、缩放与窗口行为优先。

## 交互与交付

实现 hover / pressed / selected / focus / disabled；图标有可访问名称，分页与控件可键盘操作，选中不只靠颜色。真实宿主验证关闭、焦点返回、多屏边缘、DPI 和异步失败。原作没有明确自定义动效时长；新增动画标为适配选择，支持减少动态效果。

按任务交付规范、实现或只读审查，不扩展业务范围。界面改动后集中检查主要视图、长名称、能力缺失、失败状态、短屏与键盘路径；修复后复查受影响路径。区分真实原生测试与 Web 样板测试。

Provider 交付按契约返回实际产物、验证结果、兼容性和 `style_conformance`；manifest 校验通过不能代替实际调用、界面审查或原生宿主测试。
