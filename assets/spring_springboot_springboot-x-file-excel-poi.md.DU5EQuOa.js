import{_ as n,c as a,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-poi-2.png",t="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-poi-1.png",S=JSON.parse('{"title":"SpringBoot集成文件 - 集成POI之Excel导入导出","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-excel-poi.md","filePath":"spring/springboot/springboot-x-file-excel-poi.md","lastUpdated":1737706346000}'),o={name:"spring/springboot/springboot-x-file-excel-poi.md"};function i(r,s,c,d,u,h){return p(),a("div",null,s[0]||(s[0]=[e(`<h1 id="springboot集成文件-集成poi之excel导入导出" tabindex="-1">SpringBoot集成文件 - 集成POI之Excel导入导出 <a class="header-anchor" href="#springboot集成文件-集成poi之excel导入导出" aria-label="Permalink to &quot;SpringBoot集成文件 - 集成POI之Excel导入导出&quot;">​</a></h1><blockquote><p>Apache POI 是用Java编写的免费开源的跨平台的 Java API，Apache POI提供API给Java程序对Microsoft Office格式档案读和写的功能。本文主要介绍通过SpringBoot集成POI工具实现Excel的导入和导出功能。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解POI工具，以及POI对Excel中的对象的封装对应关系。</p></blockquote><h3 id="什么是poi" tabindex="-1">什么是POI <a class="header-anchor" href="#什么是poi" aria-label="Permalink to &quot;什么是POI&quot;">​</a></h3><blockquote><p>Apache POI 是用Java编写的免费开源的跨平台的 Java API，Apache POI提供API给Java程序对Microsoft Office格式档案读和写的功能。POI为“Poor Obfuscation Implementation”的首字母缩写，意为“简洁版的模糊实现”。</p></blockquote><p>Apache POI 是创建和维护操作各种符合Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2）的Java API。用它可以使用Java读取和创建,修改MS Excel文件.而且,还可以使用Java读取和创建MS Word和MSPowerPoint文件。更多请参考<a href="https://poi.apache.org/index.html" target="_blank" rel="noreferrer">官方文档在新窗口打开</a>。</p><h3 id="poi中基础概念" tabindex="-1">POI中基础概念 <a class="header-anchor" href="#poi中基础概念" aria-label="Permalink to &quot;POI中基础概念&quot;">​</a></h3><blockquote><p>生成xls和xlsx有什么区别？POI对Excel中的对象的封装对应关系？</p></blockquote><p>生成xls和xlsx有什么区别呢？</p><table tabindex="0"><thead><tr><th>XLS</th><th>XLSX</th></tr></thead><tbody><tr><td>只能打开xls格式，无法直接打开xlsx格式</td><td>可以直接打开xls、xlsx格式</td></tr><tr><td>只有65536行、256列</td><td>可以有1048576行、16384列</td></tr><tr><td>占用空间大</td><td>占用空间小，运算速度也会快一点</td></tr></tbody></table><p>POI对Excel中的对象的封装对应关系如下：</p><table tabindex="0"><thead><tr><th>Excel</th><th>POI XLS</th><th>POI XLSX(Excel 2007+)</th></tr></thead><tbody><tr><td>Excel 文件</td><td>HSSFWorkbook （xls）</td><td>XSSFWorkbook（xlsx）</td></tr><tr><td>Excel 工作表</td><td>HSSFSheet</td><td>XSSFSheet</td></tr><tr><td>Excel 行</td><td>HSSFRow</td><td>XSSFRow</td></tr><tr><td>Excel 单元格</td><td>HSSFCell</td><td>XSSFCell</td></tr><tr><td>Excel 单元格样式</td><td>HSSFCellStyle</td><td>HSSFCellStyle</td></tr><tr><td>Excel 颜色</td><td>HSSFColor</td><td>XSSFColor</td></tr><tr><td>Excel 字体</td><td>HSSFFont</td><td>XSSFFont</td></tr></tbody></table><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里展示SpringBoot集成POI导出用户列表的和导入用户列表的例子。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入poi的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.poi&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;poi&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.2.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.poi&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;poi-ooxml&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.2.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="导出excel" tabindex="-1">导出Excel <a class="header-anchor" href="#导出excel" aria-label="Permalink to &quot;导出Excel&quot;">​</a></h3><p>UserController中导出的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Download Excel&quot;)</span></span>
<span class="line"><span>@GetMapping(&quot;/excel/download&quot;)</span></span>
<span class="line"><span>public void download(HttpServletResponse response) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        SXSSFWorkbook workbook = userService.generateExcelWorkbook();</span></span>
<span class="line"><span>        response.reset();</span></span>
<span class="line"><span>        response.setContentType(&quot;application/vnd.ms-excel&quot;);</span></span>
<span class="line"><span>        response.setHeader(&quot;Content-disposition&quot;,</span></span>
<span class="line"><span>                &quot;attachment;filename=user_excel_&quot; + System.currentTimeMillis() + &quot;.xlsx&quot;);</span></span>
<span class="line"><span>        OutputStream os = response.getOutputStream();</span></span>
<span class="line"><span>        workbook.write(os);</span></span>
<span class="line"><span>        workbook.dispose();</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导出Excel的主方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final int POSITION_ROW = 1;</span></span>
<span class="line"><span>private static final int POSITION_COL = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return SXSSFWorkbook</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public SXSSFWorkbook generateExcelWorkbook() {</span></span>
<span class="line"><span>    SXSSFWorkbook workbook = new SXSSFWorkbook();</span></span>
<span class="line"><span>    Sheet sheet = workbook.createSheet();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rows = POSITION_ROW;</span></span>
<span class="line"><span>    int cols = POSITION_COL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 表头</span></span>
<span class="line"><span>    Row head = sheet.createRow(rows++);</span></span>
<span class="line"><span>    String[] columns = new String[]{&quot;ID&quot;, &quot;Name&quot;, &quot;Email&quot;, &quot;Phone&quot;, &quot;Description&quot;};</span></span>
<span class="line"><span>    int[] colWidths = new int[]{2000, 3000, 5000, 5000, 8000};</span></span>
<span class="line"><span>    CellStyle headStyle = getHeadCellStyle(workbook);</span></span>
<span class="line"><span>    for (int i = 0; i &lt; columns.length; ++i) {</span></span>
<span class="line"><span>        sheet.setColumnWidth(cols, colWidths[i]);</span></span>
<span class="line"><span>        addCellWithStyle(head, cols++, headStyle).setCellValue(columns[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 表内容</span></span>
<span class="line"><span>    CellStyle bodyStyle = getBodyCellStyle(workbook);</span></span>
<span class="line"><span>    for (User user : getUserList()) {</span></span>
<span class="line"><span>        cols = POSITION_COL;</span></span>
<span class="line"><span>        Row row = sheet.createRow(rows++);</span></span>
<span class="line"><span>        addCellWithStyle(row, cols++, bodyStyle).setCellValue(user.getId());</span></span>
<span class="line"><span>        addCellWithStyle(row, cols++, bodyStyle).setCellValue(user.getUserName());</span></span>
<span class="line"><span>        addCellWithStyle(row, cols++, bodyStyle).setCellValue(user.getEmail());</span></span>
<span class="line"><span>        addCellWithStyle(row, cols++, bodyStyle).setCellValue(String.valueOf(user.getPhoneNumber()));</span></span>
<span class="line"><span>        addCellWithStyle(row, cols++, bodyStyle).setCellValue(user.getDescription());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return workbook;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Cell addCellWithStyle(Row row, int colPosition, CellStyle cellStyle) {</span></span>
<span class="line"><span>    Cell cell = row.createCell(colPosition);</span></span>
<span class="line"><span>    cell.setCellStyle(cellStyle);</span></span>
<span class="line"><span>    return cell;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    return Collections.singletonList(User.builder()</span></span>
<span class="line"><span>            .id(1L).userName(&quot;pdai&quot;).email(&quot;pdai@pdai.tech&quot;).phoneNumber(121231231231L)</span></span>
<span class="line"><span>            .description(&quot;hello world&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private CellStyle getHeadCellStyle(Workbook workbook) {</span></span>
<span class="line"><span>    CellStyle style = getBaseCellStyle(workbook);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // fill</span></span>
<span class="line"><span>    style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());</span></span>
<span class="line"><span>    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return style;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private CellStyle getBodyCellStyle(Workbook workbook) {</span></span>
<span class="line"><span>    return getBaseCellStyle(workbook);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private CellStyle getBaseCellStyle(Workbook workbook) {</span></span>
<span class="line"><span>    CellStyle style = workbook.createCellStyle();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // font</span></span>
<span class="line"><span>    Font font = workbook.createFont();</span></span>
<span class="line"><span>    font.setBold(true);</span></span>
<span class="line"><span>    style.setFont(font);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // align</span></span>
<span class="line"><span>    style.setAlignment(HorizontalAlignment.CENTER);</span></span>
<span class="line"><span>    style.setVerticalAlignment(VerticalAlignment.TOP);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // border</span></span>
<span class="line"><span>    style.setBorderBottom(BorderStyle.THIN);</span></span>
<span class="line"><span>    style.setBottomBorderColor(IndexedColors.BLACK.getIndex());</span></span>
<span class="line"><span>    style.setBorderLeft(BorderStyle.THIN);</span></span>
<span class="line"><span>    style.setLeftBorderColor(IndexedColors.BLACK.getIndex());</span></span>
<span class="line"><span>    style.setBorderRight(BorderStyle.THIN);</span></span>
<span class="line"><span>    style.setRightBorderColor(IndexedColors.BLACK.getIndex());</span></span>
<span class="line"><span>    style.setBorderTop(BorderStyle.THIN);</span></span>
<span class="line"><span>    style.setTopBorderColor(IndexedColors.BLACK.getIndex());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return style;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>导出后的excel如下</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="导入excel" tabindex="-1">导入Excel <a class="header-anchor" href="#导入excel" aria-label="Permalink to &quot;导入Excel&quot;">​</a></h3><blockquote><p>我们将上面导出的excel文件导入。</p></blockquote><p>UserController中导入的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Upload Excel&quot;)</span></span>
<span class="line"><span>@PostMapping(&quot;/excel/upload&quot;)</span></span>
<span class="line"><span>public ResponseResult&lt;String&gt; upload(@RequestParam(value = &quot;file&quot;, required = true) MultipartFile file) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        userService.upload(file.getInputStream());</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>        return ResponseResult.fail(e.getMessage());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ResponseResult.success();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导入Excel的主方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void upload(InputStream inputStream) throws IOException {</span></span>
<span class="line"><span>    XSSFWorkbook book = new XSSFWorkbook(inputStream);</span></span>
<span class="line"><span>    XSSFSheet sheet = book.getSheetAt(0);</span></span>
<span class="line"><span>    // add some validation here</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // parse data</span></span>
<span class="line"><span>    int cols;</span></span>
<span class="line"><span>    for (int i = POSITION_ROW; i &lt; sheet.getLastRowNum(); i++) {</span></span>
<span class="line"><span>        XSSFRow row = sheet.getRow(i + 1); // 表头不算</span></span>
<span class="line"><span>        cols = POSITION_COL;</span></span>
<span class="line"><span>        User user = User.builder()</span></span>
<span class="line"><span>                .id(getCellLongValue(row.getCell(cols++)))</span></span>
<span class="line"><span>                .userName(getCellStringValue(row.getCell(cols++)))</span></span>
<span class="line"><span>                .email(getCellStringValue(row.getCell(cols++)))</span></span>
<span class="line"><span>                .phoneNumber(Long.parseLong(getCellStringValue(row.getCell(cols++))))</span></span>
<span class="line"><span>                .description(getCellStringValue(row.getCell(cols++)))</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        log.info(user.toString());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    book.close();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String getCellStringValue(XSSFCell cell) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (null!=cell) {</span></span>
<span class="line"><span>            return String.valueOf(cell.getStringCellValue());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        return String.valueOf(getCellIntValue(cell));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return &quot;&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private long getCellLongValue(XSSFCell cell) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (null!=cell) {</span></span>
<span class="line"><span>            return Long.parseLong(&quot;&quot; + (long) cell.getNumericCellValue());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0L;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int getCellIntValue(XSSFCell cell) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (null!=cell) {</span></span>
<span class="line"><span>            return Integer.parseInt(&quot;&quot; + (int) cell.getNumericCellValue());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过PostMan进行接口测试</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>执行接口后，后台的日志如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-06-10 21:36:01.720  INFO 15100 --- [nio-8080-exec-2] t.p.s.f.e.p.s.impl.UserServiceImpl       : User(id=1, userName=pdai, email=pdai@pdai.tech, phoneNumber=121231231231, description=hello world)</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://poi.apache.org/index.html" target="_blank" rel="noreferrer">https://poi.apache.org/index.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',40)]))}const b=n(o,[["render",i]]);export{S as __pageData,b as default};
