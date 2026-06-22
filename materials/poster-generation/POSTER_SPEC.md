# HTML 海报生成规范（POSTER_SPEC）

给「用 HTML 为社团设计招新海报」的 AI 的统一要求。
每次生成时请把 **本规范 + 该社团的 `brief.md` + `素材/`** 一起作为输入。

海报最终会被嵌入社团详情页里「招新海报 · Poster」的位置（左列，圆角裁切），
与已经交了图片海报的社团**位置完全一致**。它通过 `<iframe>` 加载，与站点样式相互隔离。

---

## 一、技术契约（必须满足，否则无法嵌入）

1. **单文件、自包含**
   - 交付物是 **一个 `.html` 文件**。CSS 写在 `<style>` 里，JS（如有）写在 `<script>` 里。
   - 不依赖任何构建步骤、不引入外部 CSS/JS 框架、不发外部网络请求（除下文约定的本地素材）。
   - 单独用浏览器打开能正常显示，放进 `<iframe>` 也能正常显示。

2. **宽度流体、高度随内容**
   - 海报根元素 `width: 100%`，**填满容器宽度**；不要写死像素宽度。
   - 用**相对单位**排版（容器查询单位 `cqw` 或 `vw`、百分比、`em`），保证从 ~320px（手机）到 ~600px（桌面左列）宽度区间都不破版、内部**不出现滚动条**。
   - 高度不用强求统一比例：你可以自己定这张海报的比例（用 `aspect-ratio`）或让它按内容自然撑开。**站点会把 iframe 高度自动适配到内容高度**，所以只要保证「宽度变化时整体等比缩放、不溢出」即可。
   - 不要依赖固定视口高度（少用 `100vh` 之类假设屏幕尺寸）。

3. **满版背景（full-bleed）**
   - 海报要把背景铺满整块画布、画到边。它会被圆角裁切、显示在深色页面上，**不要留透明区**等着页面背景透出来。

4. **真文字 + 中文系统字体**
   - 所有文案用**真实可选中的文本**，不要把文字做成图片。
   - 中文用系统字体栈：`"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`，不要加载几 MB 的中文 web font。
   - 西文标题可用 display 字体，但要给 fallback。

5. **健壮、安全**
   - 无 console 报错。
   - **禁止** `position: fixed`、禁止顶层页面跳转、禁止外部脚本/统计/广告。
   - 引用的素材图缺失时要优雅降级（不要整页崩或留大白块）。

---

## 二、内容要求

6. **只用 brief 里的真实信息**
   - 严格采用 `brief.md` 中 **O 列**要放的文字：社名（中英）、slogan、活动亮点、公众号、社长/指导老师等。
   - **不要编造**日期、人名、战绩、数据。缺的就留白或合理占位。

7. **遵循设计要求（P 列）**
   - 按 brief 里 **P 列**的风格、主色调、必含元素来做（很多社写明了 logo / 配色 / 元素 / 小动效）。
   - **素材可用可不用**：可以调用 `素材/` 里的照片/logo，也可以纯 CSS / 代码重新创作；以「好看、贴合社团气质」为准。

8. **不放二维码 / 不必放联系方式二维码**
   - 招新群二维码站点已在详情页单独展示，**海报里不要再画二维码**。
   - O 列里的纯文字联系方式（如公众号名）可按排版需要保留。

---

## 三、动效（可选的小巧思）

有很多发挥空间，比如物理社可以做个牛顿摆之类的、橄榄球社可以来一个橄榄球场，上面是橄榄球在滚动，人在跑
9. 也可能只是基本的动效，基于 `transform` / `opacity`（社团常提到的「悬浮、渐入、流动」这类）。
   - 不要音频、不要重 JS / 大型动画库。

---

## 四、素材与路径约定

10. 若使用社团的照片/素材，按以下固定路径引用（站点会把素材部署到这里）：

    ```
    /poster-html/{slug}/assets/<文件名>
    ```

    - `{slug}` 是每个社团分配的英文目录名，见下表。
    - 也可以把**小图以 data URI 内联**进 HTML（更省事、可移植），由你权衡。
    - 素材原图在各社团文件夹的 `素材/` 里（docx 已抽出 `_图片/` 和 `_文字.txt`）。

11. **交付物命名**：`{slug}.html`（一个社团一个文件）。

### slug 对照表

| 序号 | 社团 | slug |
|---|---|---|
| 1  | 图寻地理社 GeoQuery | `geoquery` |
| 2  | Prologue 动物保护社 | `prologue` |
| 3  | 世外汽车社 Power Galaxy | `power-galaxy` |
| 4  | 轻羽飞扬 WFLA Badminton | `badminton` |
| 18 | Asclepius 急救医学社 | `asclepius` |
| 30 | 腰旗橄榄球社 | `flag-football` |
| 47 | 物理社 Physics Society | `physics` |
| 48 | Modi 3D建模社 | `modi-3d` |
| 53 | 響日语社 Hibiki | `hibiki` |
| 55 | 汉文化社 | `han-culture` |
| 56 | Voice | `voice` |
| 57 | 极客工坊 E3 Lab | `e3-lab` |
| 58 | 深蓝 BlueX | `bluex` |
| 62 | Origin 起源社 | `origin` |

---

## 五、可参考的骨架

```html
<!doctype html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; container-type: inline-size; }   /* cqw 以此宽度为基准 */
    * { box-sizing: border-box; }

    .poster {
      width: 100%;
      aspect-ratio: 3 / 4;                 /* 比例自定，可去掉改为内容撑开 */
      position: relative;
      overflow: hidden;
      background: #0e1630;                  /* 满版背景 */
      color: #fff;
      font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
    }
    /* 用 cqw（容器宽度的百分比）做字号/间距，宽度变化时整体等比缩放 */
    .title   { font-size: 11cqw; font-weight: 800; }
    .slogan  { font-size: 4.2cqw; opacity: .85; }

    @keyframes floaty { from { transform: translateY(0) } to { transform: translateY(-1.2cqw) } }
    .float { animation: floaty 3s ease-in-out infinite alternate; }
  </style>
</head>
<body>
  <div class="poster">
    <!-- 自由发挥：标题 / slogan / 活动亮点 / 装饰元素 ... -->
  </div>
</body>
</html>
```
