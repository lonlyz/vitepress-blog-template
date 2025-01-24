import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springboot/springboot-file-word-poi-1.png",l="/vitepress-blog-template/images/spring/springboot/springboot-file-word-poi-2.png",i="/vitepress-blog-template/images/spring/springboot/springboot-file-word-poi-3.png",b=JSON.parse('{"title":"SpringBoot集成文件 - 集成POI之Word导出","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-word-poi.md","filePath":"spring/springboot/springboot-x-file-word-poi.md","lastUpdated":1737706346000}'),r={name:"spring/springboot/springboot-x-file-word-poi.md"};function o(c,a,d,u,g,h){return e(),s("div",null,a[0]||(a[0]=[p('<h1 id="springboot集成文件-集成poi之word导出" tabindex="-1">SpringBoot集成文件 - 集成POI之Word导出 <a class="header-anchor" href="#springboot集成文件-集成poi之word导出" aria-label="Permalink to &quot;SpringBoot集成文件 - 集成POI之Word导出&quot;">​</a></h1><blockquote><p>前文我们介绍了通过Apache POI导出excel，而Apache POI包含是操作Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2）的Java API。所以也是可以通过POI来导出word的。本文主要介绍通过SpringBoot集成POI工具实现Word的导出功能。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要理解Apache POI遵循的标准（Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2））， 这将对应着API的依赖包。@pdai</p></blockquote><h3 id="什么是poi" tabindex="-1">什么是POI <a class="header-anchor" href="#什么是poi" aria-label="Permalink to &quot;什么是POI&quot;">​</a></h3><blockquote><p>Apache POI 是用Java编写的免费开源的跨平台的 Java API，Apache POI提供API给Java程序对Microsoft Office格式档案读和写的功能。POI为“Poor Obfuscation Implementation”的首字母缩写，意为“简洁版的模糊实现”。</p></blockquote><p>Apache POI 是创建和维护操作各种符合Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2）的Java API。更多请参考<a href="https://poi.apache.org/index.html" target="_blank" rel="noreferrer">官方文档在新窗口打开</a>。</p><p><img src="'+t+`" alt="error.图片加载失败"></p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里展示SpringBoot集成POI导出用户信息的Word例子。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入poi的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.poi&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;poi&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.2.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.poi&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;poi-ooxml&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.2.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="导出word" tabindex="-1">导出Word <a class="header-anchor" href="#导出word" aria-label="Permalink to &quot;导出Word&quot;">​</a></h3><p>UserController中导出的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.word.poi.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.OutputStream;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFDocument;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.file.word.poi.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private IUserService userService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ApiOperation(&quot;Download Word&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;/word/download&quot;)</span></span>
<span class="line"><span>    public void download(HttpServletResponse response) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            XWPFDocument document = userService.generateWordXWPFDocument();</span></span>
<span class="line"><span>            response.reset();</span></span>
<span class="line"><span>            response.setContentType(&quot;application/vnd.ms-excel&quot;);</span></span>
<span class="line"><span>            response.setHeader(&quot;Content-disposition&quot;,</span></span>
<span class="line"><span>                    &quot;attachment;filename=user_world_&quot; + System.currentTimeMillis() + &quot;.docx&quot;);</span></span>
<span class="line"><span>            OutputStream os = response.getOutputStream();</span></span>
<span class="line"><span>            document.write(os);</span></span>
<span class="line"><span>            os.close();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导出Word方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.word.poi.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.FileInputStream;</span></span>
<span class="line"><span>import java.io.FileNotFoundException;</span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.math.BigInteger;</span></span>
<span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.extern.slf4j.Slf4j;</span></span>
<span class="line"><span>import org.apache.poi.openxml4j.exceptions.InvalidFormatException;</span></span>
<span class="line"><span>import org.apache.poi.util.Units;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.BreakType;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.Document;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.ParagraphAlignment;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFDocument;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFParagraph;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFRun;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFTable;</span></span>
<span class="line"><span>import org.apache.poi.xwpf.usermodel.XWPFTableCell;</span></span>
<span class="line"><span>import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblPr;</span></span>
<span class="line"><span>import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblWidth;</span></span>
<span class="line"><span>import org.springframework.core.io.ClassPathResource;</span></span>
<span class="line"><span>import org.springframework.core.io.Resource;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.file.word.poi.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.file.word.poi.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class UserServiceImpl implements IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public XWPFDocument generateWordXWPFDocument() {</span></span>
<span class="line"><span>        XWPFDocument doc = new XWPFDocument();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Title</span></span>
<span class="line"><span>        createTitle(doc, &quot;Java 全栈知识体系&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Chapter 1</span></span>
<span class="line"><span>        createChapterH1(doc, &quot;1. 知识准备&quot;);</span></span>
<span class="line"><span>        createChapterH2(doc, &quot;1.1 什么是POI&quot;);</span></span>
<span class="line"><span>        createParagraph(doc, &quot;Apache POI 是创建和维护操作各种符合Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2）的Java API。用它可以使用Java读取和创建,修改MS Excel文件.而且,还可以使用Java读取和创建MS Word和MSPowerPoint文件。更多请参考[官方文档](https://poi.apache.org/index.html)&quot;);</span></span>
<span class="line"><span>        createChapterH2(doc, &quot;1.2 POI中基础概念&quot;);</span></span>
<span class="line"><span>        createParagraph(doc, &quot;生成xls和xlsx有什么区别？POI对Excel中的对象的封装对应关系？&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Chapter 2</span></span>
<span class="line"><span>        createChapterH1(doc, &quot;2. 实现案例&quot;);</span></span>
<span class="line"><span>        createChapterH2(doc, &quot;2.1 用户列表示例&quot;);</span></span>
<span class="line"><span>        createParagraph(doc, &quot;以导出用户列表为例&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 表格</span></span>
<span class="line"><span>        List&lt;User&gt; userList = getUserList();</span></span>
<span class="line"><span>        XWPFParagraph paragraph = doc.createParagraph();</span></span>
<span class="line"><span>        XWPFTable table = paragraph.getDocument().createTable(userList.size(), 5);</span></span>
<span class="line"><span>        table.setWidth(500);</span></span>
<span class="line"><span>        table.setCellMargins(20, 20, 20, 20);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //表格属性</span></span>
<span class="line"><span>        CTTblPr tablePr = table.getCTTbl().addNewTblPr();</span></span>
<span class="line"><span>        //表格宽度</span></span>
<span class="line"><span>        CTTblWidth width = tablePr.addNewTblW();</span></span>
<span class="line"><span>        width.setW(BigInteger.valueOf(8000));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(int i = 0; i&lt; userList.size(); i++) {</span></span>
<span class="line"><span>            List&lt;XWPFTableCell&gt; tableCells = table.getRow(i).getTableCells();</span></span>
<span class="line"><span>            tableCells.get(0).setText(userList.get(i).getId()+&quot;&quot;);</span></span>
<span class="line"><span>            tableCells.get(1).setText(userList.get(i).getUserName());</span></span>
<span class="line"><span>            tableCells.get(2).setText(userList.get(i).getEmail());</span></span>
<span class="line"><span>            tableCells.get(3).setText(userList.get(i).getPhoneNumber()+&quot;&quot;);</span></span>
<span class="line"><span>            tableCells.get(4).setText(userList.get(i).getDescription());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        createChapterH2(doc, &quot;2.2 图片导出示例&quot;);</span></span>
<span class="line"><span>        createParagraph(doc, &quot;以导出图片为例&quot;);</span></span>
<span class="line"><span>        // 图片</span></span>
<span class="line"><span>        InputStream stream = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            XWPFParagraph paragraph2 = doc.createParagraph();</span></span>
<span class="line"><span>            Resource resource = new ClassPathResource(&quot;pdai-guli.png&quot;);</span></span>
<span class="line"><span>            stream = new FileInputStream(resource.getFile());</span></span>
<span class="line"><span>            XWPFRun run = paragraph2.createRun();</span></span>
<span class="line"><span>            run.addPicture(stream, Document.PICTURE_TYPE_PNG, &quot;Generated&quot;, Units.toEMU(256), Units.toEMU(256));</span></span>
<span class="line"><span>        } catch (IOException | InvalidFormatException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return doc;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void createTitle(XWPFDocument doc, String content) {</span></span>
<span class="line"><span>        XWPFParagraph title = doc.createParagraph();</span></span>
<span class="line"><span>        title.setAlignment(ParagraphAlignment.CENTER);</span></span>
<span class="line"><span>        XWPFRun r1 = title.createRun();</span></span>
<span class="line"><span>        r1.setBold(true);</span></span>
<span class="line"><span>        r1.setFontFamily(&quot;宋体&quot;);</span></span>
<span class="line"><span>        r1.setText(content);</span></span>
<span class="line"><span>        r1.setFontSize(22);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void createChapterH1(XWPFDocument doc, String content) {</span></span>
<span class="line"><span>        XWPFParagraph actTheme = doc.createParagraph();</span></span>
<span class="line"><span>        actTheme.setAlignment(ParagraphAlignment.LEFT);</span></span>
<span class="line"><span>        XWPFRun runText1 = actTheme.createRun();</span></span>
<span class="line"><span>        runText1.setBold(true);</span></span>
<span class="line"><span>        runText1.setText(content);</span></span>
<span class="line"><span>        runText1.setFontSize(18);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void createChapterH2(XWPFDocument doc, String content) {</span></span>
<span class="line"><span>        XWPFParagraph actType = doc.createParagraph();</span></span>
<span class="line"><span>        XWPFRun runText2 = actType.createRun();</span></span>
<span class="line"><span>        runText2.setBold(true);</span></span>
<span class="line"><span>        runText2.setText(content);</span></span>
<span class="line"><span>        runText2.setFontSize(15);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void createParagraph(XWPFDocument doc, String content) {</span></span>
<span class="line"><span>        XWPFParagraph actType = doc.createParagraph();</span></span>
<span class="line"><span>        XWPFRun runText2 = actType.createRun();</span></span>
<span class="line"><span>        runText2.setText(content);</span></span>
<span class="line"><span>        runText2.setFontSize(11);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>        List&lt;User&gt; userList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 5; i++) {</span></span>
<span class="line"><span>            userList.add(User.builder()</span></span>
<span class="line"><span>                    .id(Long.parseLong(i + &quot;&quot;)).userName(&quot;pdai&quot; + i).email(&quot;pdai@pdai.tech&quot; + i).phoneNumber(121231231231L)</span></span>
<span class="line"><span>                    .description(&quot;hello world&quot; + i)</span></span>
<span class="line"><span>                    .build());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return userList;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>导出</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>导出后的word</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-label="Permalink to &quot;参考文档&quot;">​</a></h2><p><a href="https://poi.apache.org/index.html" target="_blank" rel="noreferrer">https://poi.apache.org/index.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',27)]))}const P=n(r,[["render",o]]);export{b as __pageData,P as default};
