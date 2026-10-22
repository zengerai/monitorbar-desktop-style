# MonitorBar Desktop Style

面向 macOS 菜单栏、Windows 系统托盘和紧凑浮层的 Codex Skill，也可作为 **product-ui Design Provider**。默认采用已认可的苹果风银白、浅灰、石墨文字与蓝色点缀；原版深色橙为可选主题。

当前 Provider 版本见 [VERSION](VERSION)。适配 product-ui **Design Provider Protocol v1 / contract 1.0**；2026-10-22 按本机 product-ui v3.7 的契约核对。这是指令级协作，无需修改 product-ui 或注册运行时插件。

## 使用

独立调用：

> 用 $monitorbar-desktop-style 做一个 macOS 菜单栏音频工具，采用银白浅色。

配合 product-ui：

> 用 $product-ui 设计一个 Windows 托盘工具，视觉 Provider 选择 $monitorbar-desktop-style，采用银白浅色。

product-ui 负责产品任务、页面结构、工作流和验收，本 Skill 负责紧凑浮层的主题、组件视觉、状态与动效表达。安装不会自动替换已有项目风格。支持 `style-candidate`、`spec`、`implement`、`style-audit`；仅 `implement` 可按委派范围写入。详见 [Provider 契约](references/provider-protocol.md) 和 [示例交接单](examples/provider-handoff.yaml)。

## 安装

已登录且有仓库访问权时，将仓库克隆到 Codex 的 skills 目录：

```sh
gh repo clone zengerai/monitorbar-desktop-style ~/.codex/skills/monitorbar-desktop-style
```

若自定义了 `CODEX_HOME`，改用该目录下的 `skills/monitorbar-desktop-style`。目标目录已有 Skill 时先检查本地修改，不直接覆盖。运行时本 Skill 无需联网，product-ui 仅在协作使用时需要独立安装。

## 预览与内容

在仓库根目录运行：

```sh
python3 -m http.server 43871 --bind 127.0.0.1
```

打开 [浅色样板](http://127.0.0.1:43871/assets/preview.html?theme=light)；`?theme=dark` 切换为原版深色。预览含模拟数据与交互，不控制真实设备。右侧截图是上游深色参考，不是浅色原生应用截图。

- [SKILL.md](SKILL.md)：调用入口与适用边界。
- [design-provider.json](design-provider.json)：Provider 能力和框架适配级别。
- [银白主题](references/theme-light.md)、[组件适配](references/component-patterns.md)、[平台契约](references/platform-contract.md)：复用规范。
- [Token](assets/tokens.json)、[CSS](assets/monitorbar.css)、HTML / JS 样板：Web 参考实现。
- [源码拆解](references/design-spec.md) 与 [来源证据](references/source-map.md)：上游常量、冻结源码及适配边界。

Web 资产可直接复用；React / Vue / Electron / Tauri 需要适配。SwiftUI / AppKit / WinUI / Qt / Go 提供设计指导，没有附带已验证的原生实现。原生托盘注册、焦点、多屏、DPI 与硬件 API 需在目标产品验证。

## 来源与许可

基于 [Binaryify/MonitorBar](https://github.com/Binaryify/MonitorBar) 的 UI 拆解，上游固定提交 `950ec67b540438578b56e0341503ba1e80f090e2`。复用的源码、图标路径、截图及相关内容保留 [原 MIT 许可](references/upstream/LICENSE) 与归属说明。浅色方案是本地设计适配，不是 Apple 官方组件或上游官方主题，不分发 SF Pro 字体或 SF Symbols。
