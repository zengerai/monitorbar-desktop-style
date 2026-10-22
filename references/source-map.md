# 来源与证据

项目：[Binaryify/MonitorBar](https://github.com/Binaryify/MonitorBar)。提取于 2026-10-15，提交 `950ec67b540438578b56e0341503ba1e80f090e2`。MIT，copyright 2026 binaryify；[原许可证](upstream/LICENSE) 已随包保留。复用了界面参数、图标路径和截图，继续分发时保留许可。原 README 将 LGwebOS-menubar 列为灵感来源，并注明 Lucide 图标风格；本包不声称这些为原创。

| 证据 | 文件 | 内容 |
|---|---|---|
| 参数 / 组件 | [widgets.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/widgets.go#L10) | 宽度、颜色、卡片、选项、控制组 |
| 外壳 / 分页 | [panel.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/panel.go#L37) | 箭头、标题、滚动、更新、状态 |
| 页面 | [tabs.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/tabs.go#L16) | 设备、场景、列表、自动切换、图表 |
| 窗口 | [app.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/app.go#L24) | 托盘、菜单、定位、尺寸、回退 |
| 图标 | [icons.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/icons.go#L15) | 24 网格、2 线宽、圆端点 |
| 测试 | [panel_test.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/panel_test.go#L19) | 样例数据、能力隐藏、2× 截图生成 |
| 场景预设 | [store.go](https://github.com/Binaryify/MonitorBar/blob/950ec67b540438578b56e0341503ba1e80f090e2/store.go#L28) | 日间 80/0、阅读 55/25、观影 100/5、夜间 30/55（亮度/色温） |

以上文件的冻结副本放在 `upstream/`，不需要联网即可核对。

已逐张检查 `assets/screenshots/` 下 overview、picture、modes、activity、windows 五张原图。前四张由项目固定 store、2× scale 的截图机制生成；示例设备、时长和连接不是本机数据。Windows 图为仓库 Windows 11 面板。

**版本差异**：`picture.png` 没有自动切换卡片，并包含不支持 DDC/CI 的说明；当前 `tabs.go` 已有 `autoSwitch`，`panel_test.go` 明确断言未支持硬件组及相应说明不出现。交互规范以当前源码为准，历史截图用于外观。本次没有运行原作重新生成截图，不声称截图完全反映最新代码。

证据等级：**精确**为源码常量和分支；**观察**为截图层级与视觉判断；**适配**为 CSS 字体栈、range、焦点圈、错误演示、动画和原生待验证建议。mygo 控件内部参数、实际阴影与系统材质不在本次精确提取范围。

没有运行发布二进制、访问显示器或改变系统设置。
