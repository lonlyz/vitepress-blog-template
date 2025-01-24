import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springboot/springboot-file-pdf-itext-2.png",l="/vitepress-blog-template/images/spring/springboot/springboot-file-pdf-itext-1.png",i="/vitepress-blog-template/images/spring/springboot/springboot-file-pdf-itext-3.png",f=JSON.parse('{"title":"SpringBoot集成文件 - 集成itextpdf之导出PDF","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-pdf-itext.md","filePath":"spring/springboot/springboot-x-file-pdf-itext.md","lastUpdated":1737706346000}'),o={name:"spring/springboot/springboot-x-file-pdf-itext.md"};function c(r,n,d,g,u,h){return e(),s("div",null,n[0]||(n[0]=[p(`<h1 id="springboot集成文件-集成itextpdf之导出pdf" tabindex="-1">SpringBoot集成文件 - 集成itextpdf之导出PDF <a class="header-anchor" href="#springboot集成文件-集成itextpdf之导出pdf" aria-label="Permalink to &quot;SpringBoot集成文件 - 集成itextpdf之导出PDF&quot;">​</a></h1><blockquote><p>除了处理word, excel等文件外，最为常见的就是PDF的导出了。在java技术栈中，PDF创建和操作最为常用的itext了，但是使用itext一定要了解其版本历史和License问题，在早前版本使用的是MPL和LGPL双许可协议，在5.x以上版本中使用的是AGPLv3(这个协议意味着，只有个人用途和开源的项目才能使用itext这个库，否则是需要收费的)。本文主要介绍通过SpringBoot集成itextpdf实现PDF导出功能。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解itext，以及itext历史版本变迁，以及license的问题。</p></blockquote><h3 id="什么是itext" tabindex="-1">什么是itext <a class="header-anchor" href="#什么是itext" aria-label="Permalink to &quot;什么是itext&quot;">​</a></h3><blockquote><p>来源于百度百科：iText是著名的开放源码的站点sourceforge一个项目(由Bruno Lowagie编写)，是一个用Java和.NET语言写的库，用来创建和修改PDF文件。通过iText不仅可以生成PDF或rtf的文档，而且可以将XML、Html文件转化为PDF文件。 iText的安装非常方便，下载iText.jar文件后，只需要在系统的CLASSPATH中加入iText.jar的路径，在程序中就可以使用iText类库了。</p></blockquote><p>iText提供除了基本的创建、修改PDF文件外的其他高级的PDF特性，例如基于PKI的签名，40位和128位加密，颜色校正，带标签的PDF，PDF表单(AcroForms)，PDF/X,通过ICC配置文件和条形码进行颜色管理。这些特性被一些产品和服务中使用，包括Eclipse BIRT，Jasper Reports，JBoss Seam，Windward Reports和pdftk。</p><p>一般情况下，iText使用在有以下一个要求的项目中：</p><ul><li>内容无法提前利用：取决于用户的输入或实时的数据库信息。</li><li>由于内容，页面过多，PDF文档不能手动生成。</li><li>文档需在无人参与，批处理模式下自动创建。</li><li>内容被定制或个性化；例如，终端客户的名字需要标记在大量的页面上。</li></ul><h3 id="itext的历史版本和license问题" tabindex="-1">itext的历史版本和License问题 <a class="header-anchor" href="#itext的历史版本和license问题" aria-label="Permalink to &quot;itext的历史版本和License问题&quot;">​</a></h3><blockquote><p>使用itext一定要了解其版本历史，和License问题，在早前版本使用的是<strong>MPL和LGPL双许可协议</strong>，在5.x以上版本中使用的是<strong>AGPLv3</strong>(这个协议意味着，只有个人用途和开源的项目才能使用itext这个库，否则是需要收费的)</p></blockquote><ul><li><strong>iText 0.x-2.x/iTextSharp 3.x-4.x</strong><ul><li>更新时间是2000-2009</li><li>使用的是<strong>MPL和LGPL双许可协议</strong></li><li>最近的更新是2009年，版本号是<strong>iText 2.1.7</strong>/iTextSharp 4.1.6.0</li><li>此时引入包的GAV版本如下：</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;com.lowagie&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;itext&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;2.1.7&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li><strong>iText 5.x和iTextSharp 5.x</strong><ul><li>更新时间是2009-2016, 公司化运作，并标准化和提高性能</li><li>开始使用**<a href="https://github.com/itext/itextpdf/blob/develop/LICENSE.md" target="_blank" rel="noreferrer">AGPLv3协议在新窗口打开</a>** <ul><li><strong>只有个人用途和开源的项目才能使用itext这个库，否则是需要收费的</strong></li></ul></li><li>iTextSharp被设计成iText库的.NET版本，并且与iText版本号同步，iText 5.0.0和iTextSharp5.0.0同时发布</li><li>新功能不在这里面增加，但是官方会修复重要的bug</li><li>此时引入包的GAV版本如下：</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;com.itextpdf&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;itextpdf&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;5.5.13.3&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li><strong>iText 7.x</strong><ul><li>更新时间是2016到现在</li><li><a href="https://github.com/itext/itextpdf/blob/develop/LICENSE.md" target="_blank" rel="noreferrer">AGPLv3协议在新窗口打开</a></li><li>完全重写，重点关注可扩展性和模块化</li><li>不适用iTextSharp这个名称，都统称为iText,有Java和.Net版本</li><li>JDK 1.7+</li><li>此时引入包的GAV版本如下：</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;com.itextpdf&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;itext7-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;7.2.2&lt;/version&gt;</span></span>
<span class="line"><span>  &lt;type&gt;pom&lt;/type&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>注：iText变化后，GitHub上有团队基于4.x版本（MPL和LGPL双许可协议）fork了一个分支成为<a href="https://github.com/LibrePDF/OpenPDF/" target="_blank" rel="noreferrer">OpenPDF在新窗口打开</a>，并继续维护该项目。</p><h3 id="标准的itextpdf导出的步骤" tabindex="-1">标准的itextpdf导出的步骤 <a class="header-anchor" href="#标准的itextpdf导出的步骤" aria-label="Permalink to &quot;标准的itextpdf导出的步骤&quot;">​</a></h3><p>itextpdf导出pdf主要包含如下几步：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Document generateItextPdfDocument(OutputStream os) throws Exception {</span></span>
<span class="line"><span>    // 1. 创建文档</span></span>
<span class="line"><span>    Document document = new Document(PageSize.A4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 绑定输出流（通过pdfwriter)</span></span>
<span class="line"><span>    PdfWriter.getInstance(document, os);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 打开文档</span></span>
<span class="line"><span>    document.open();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 4. 往文档中添加内容</span></span>
<span class="line"><span>    document.add(xxx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 5. 关闭文档</span></span>
<span class="line"><span>    document.close();</span></span>
<span class="line"><span>    return document;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>document中添加的Element有哪些呢？</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>需要说明下如下概念之前的差别：</p><ul><li><strong>Chunk</strong>：文档的文本的最小块单位</li><li><strong>Phrase</strong>：一系列以特定间距（两行之间的距离）作为参数的块</li><li><strong>Paragraph</strong>：段落是一系列块和（或）短句。同短句一样，段落有确定的间距。用户还可以指定缩排；在边和（或）右边保留一定空白，段落可以左对齐、右对齐和居中对齐。添加到文档中的每一个段落将自动另起一行。</li></ul><p>（其它从字面上就可以看出，所以这里具体就不做解释了）</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里展示SpringBoot集成itext5导出PDF的例子。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入poi的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.itextpdf&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;itextpdf&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.5.13.3&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.itextpdf&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;itext-asian&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.2.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="导出pdf" tabindex="-1">导出PDF <a class="header-anchor" href="#导出pdf" aria-label="Permalink to &quot;导出PDF&quot;">​</a></h3><p>UserController中导出的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.word.poi.controller;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导出PDF方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Document generateItextPdfDocument(OutputStream os) throws Exception {</span></span>
<span class="line"><span>    // document</span></span>
<span class="line"><span>    Document document = new Document(PageSize.A4);</span></span>
<span class="line"><span>    PdfWriter.getInstance(document, os);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // open</span></span>
<span class="line"><span>    document.open();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // add content - pdf meta information</span></span>
<span class="line"><span>    document.addAuthor(&quot;pdai&quot;);</span></span>
<span class="line"><span>    document.addCreationDate();</span></span>
<span class="line"><span>    document.addTitle(&quot;pdai-pdf-itextpdf&quot;);</span></span>
<span class="line"><span>    document.addKeywords(&quot;pdf-pdai-keyword&quot;);</span></span>
<span class="line"><span>    document.addCreator(&quot;pdai&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // add content -  page content</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Title</span></span>
<span class="line"><span>    document.add(createTitle(&quot;Java 全栈知识体系&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Chapter 1</span></span>
<span class="line"><span>    document.add(createChapterH1(&quot;1. 知识准备&quot;));</span></span>
<span class="line"><span>    document.add(createChapterH2(&quot;1.1 什么是POI&quot;));</span></span>
<span class="line"><span>    document.add(createParagraph(&quot;Apache POI 是创建和维护操作各种符合Office Open XML（OOXML）标准和微软的OLE 2复合文档格式（OLE2）的Java API。用它可以使用Java读取和创建,修改MS Excel文件.而且,还可以使用Java读取和创建MS Word和MSPowerPoint文件。更多请参考[官方文档](https://poi.apache.org/index.html)&quot;));</span></span>
<span class="line"><span>    document.add(createChapterH2(&quot;1.2 POI中基础概念&quot;));</span></span>
<span class="line"><span>    document.add(createParagraph(&quot;生成xls和xlsx有什么区别？POI对Excel中的对象的封装对应关系？&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Chapter 2</span></span>
<span class="line"><span>    document.add(createChapterH1(&quot;2. 实现案例&quot;));</span></span>
<span class="line"><span>    document.add(createChapterH2(&quot;2.1 用户列表示例&quot;));</span></span>
<span class="line"><span>    document.add(createParagraph(&quot;以导出用户列表为例&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 表格</span></span>
<span class="line"><span>    List&lt;User&gt; userList = getUserList();</span></span>
<span class="line"><span>    PdfPTable table = new PdfPTable(new float[]{20, 40, 50, 40, 40});</span></span>
<span class="line"><span>    table.setTotalWidth(500);</span></span>
<span class="line"><span>    table.setLockedWidth(true);</span></span>
<span class="line"><span>    table.setHorizontalAlignment(Element.ALIGN_CENTER);</span></span>
<span class="line"><span>    table.getDefaultCell().setBorder(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; userList.size(); i++) {</span></span>
<span class="line"><span>        table.addCell(createCell(userList.get(i).getId() + &quot;&quot;));</span></span>
<span class="line"><span>        table.addCell(createCell(userList.get(i).getUserName()));</span></span>
<span class="line"><span>        table.addCell(createCell(userList.get(i).getEmail()));</span></span>
<span class="line"><span>        table.addCell(createCell(userList.get(i).getPhoneNumber() + &quot;&quot;));</span></span>
<span class="line"><span>        table.addCell(createCell(userList.get(i).getDescription()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    document.add(table);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    document.add(createChapterH2(&quot;2.2 图片导出示例&quot;));</span></span>
<span class="line"><span>    document.add(createParagraph(&quot;以导出图片为例&quot;));</span></span>
<span class="line"><span>    // 图片</span></span>
<span class="line"><span>    Resource resource = new ClassPathResource(&quot;pdai-guli.png&quot;);</span></span>
<span class="line"><span>    Image image = Image.getInstance(resource.getURL());</span></span>
<span class="line"><span>    // Image image = Image.getInstance(&quot;/Users/pdai/pdai/www/tech-pdai-spring-demos/481-springboot-demo-file-pdf-itextpdf/src/main/resources/pdai-guli.png&quot;);</span></span>
<span class="line"><span>    image.setAlignment(Element.ALIGN_CENTER);</span></span>
<span class="line"><span>    image.scalePercent(60); // 缩放</span></span>
<span class="line"><span>    document.add(image);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // close</span></span>
<span class="line"><span>    document.close();</span></span>
<span class="line"><span>    return document;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    List&lt;User&gt; userList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 5; i++) {</span></span>
<span class="line"><span>        userList.add(User.builder()</span></span>
<span class="line"><span>                .id(Long.parseLong(i + &quot;&quot;)).userName(&quot;pdai&quot; + i).email(&quot;pdai@pdai.tech&quot; + i).phoneNumber(121231231231L)</span></span>
<span class="line"><span>                .description(&quot;hello world&quot; + i)</span></span>
<span class="line"><span>                .build());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return userList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实现时可以将如下创建文档内容的方法封装到Util工具类中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>private Paragraph createTitle(String content) throws IOException, DocumentException {</span></span>
<span class="line"><span>    Font font = new Font(getBaseFont(), 24, Font.BOLD);</span></span>
<span class="line"><span>    Paragraph paragraph = new Paragraph(content, font);</span></span>
<span class="line"><span>    paragraph.setAlignment(Element.ALIGN_CENTER);</span></span>
<span class="line"><span>    return paragraph;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Paragraph createChapterH1(String content) throws IOException, DocumentException {</span></span>
<span class="line"><span>    Font font = new Font(getBaseFont(), 22, Font.BOLD);</span></span>
<span class="line"><span>    Paragraph paragraph = new Paragraph(content, font);</span></span>
<span class="line"><span>    paragraph.setAlignment(Element.ALIGN_LEFT);</span></span>
<span class="line"><span>    return paragraph;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Paragraph createChapterH2(String content) throws IOException, DocumentException {</span></span>
<span class="line"><span>    Font font = new Font(getBaseFont(), 18, Font.BOLD);</span></span>
<span class="line"><span>    Paragraph paragraph = new Paragraph(content, font);</span></span>
<span class="line"><span>    paragraph.setAlignment(Element.ALIGN_LEFT);</span></span>
<span class="line"><span>    return paragraph;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Paragraph createParagraph(String content) throws IOException, DocumentException {</span></span>
<span class="line"><span>    Font font = new Font(getBaseFont(), 12, Font.NORMAL);</span></span>
<span class="line"><span>    Paragraph paragraph = new Paragraph(content, font);</span></span>
<span class="line"><span>    paragraph.setAlignment(Element.ALIGN_LEFT);</span></span>
<span class="line"><span>    paragraph.setIndentationLeft(12); //设置左缩进</span></span>
<span class="line"><span>    paragraph.setIndentationRight(12); //设置右缩进</span></span>
<span class="line"><span>    paragraph.setFirstLineIndent(24); //设置首行缩进</span></span>
<span class="line"><span>    paragraph.setLeading(20f); //行间距</span></span>
<span class="line"><span>    paragraph.setSpacingBefore(5f); //设置段落上空白</span></span>
<span class="line"><span>    paragraph.setSpacingAfter(10f); //设置段落下空白</span></span>
<span class="line"><span>    return paragraph;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public PdfPCell createCell(String content) throws IOException, DocumentException {</span></span>
<span class="line"><span>    PdfPCell cell = new PdfPCell();</span></span>
<span class="line"><span>    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);</span></span>
<span class="line"><span>    cell.setHorizontalAlignment(Element.ALIGN_CENTER);</span></span>
<span class="line"><span>    Font font = new Font(getBaseFont(), 12, Font.NORMAL);</span></span>
<span class="line"><span>    cell.setPhrase(new Phrase(content, font));</span></span>
<span class="line"><span>    return cell;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private BaseFont getBaseFont() throws IOException, DocumentException {</span></span>
<span class="line"><span>    return BaseFont.createFont(&quot;STSong-Light&quot;, &quot;UniGB-UCS2-H&quot;, BaseFont.NOT_EMBEDDED);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>导出后的PDF</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="添加页眉页脚和水印" tabindex="-1">添加页眉页脚和水印 <a class="header-anchor" href="#添加页眉页脚和水印" aria-label="Permalink to &quot;添加页眉页脚和水印&quot;">​</a></h3><blockquote><p>在itextpdf 5.x 中可以利用PdfPageEvent来完成页眉页脚和水印。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.pdf.itextpdf.pdf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.itextpdf.text.BaseColor;</span></span>
<span class="line"><span>import com.itextpdf.text.Document;</span></span>
<span class="line"><span>import com.itextpdf.text.Element;</span></span>
<span class="line"><span>import com.itextpdf.text.Phrase;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.BaseFont;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.ColumnText;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfContentByte;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfGState;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfPageEventHelper;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfTemplate;</span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfWriter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class MyHeaderFooterPageEventHelper extends PdfPageEventHelper {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String headLeftTitle;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String headRightTitle;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String footerLeft;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String waterMark;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private PdfTemplate total;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyHeaderFooterPageEventHelper(String headLeftTitle, String headRightTitle, String footerLeft, String waterMark) {</span></span>
<span class="line"><span>        this.headLeftTitle = headLeftTitle;</span></span>
<span class="line"><span>        this.headRightTitle = headRightTitle;</span></span>
<span class="line"><span>        this.footerLeft = footerLeft;</span></span>
<span class="line"><span>        this.waterMark = waterMark;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onOpenDocument(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>        total = writer.getDirectContent().createTemplate(30, 16);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onEndPage(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>        BaseFont bf = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            bf = BaseFont.createFont(&quot;STSong-Light&quot;, &quot;UniGB-UCS2-H&quot;, BaseFont.NOT_EMBEDDED);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // page header and footer</span></span>
<span class="line"><span>        addPageHeaderAndFooter(writer, document, bf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // watermark</span></span>
<span class="line"><span>        if (waterMark!=null) {</span></span>
<span class="line"><span>            addWaterMark(writer, document, bf);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void addPageHeaderAndFooter(PdfWriter writer, Document document, BaseFont bf) {</span></span>
<span class="line"><span>        PdfContentByte cb = writer.getDirectContent();</span></span>
<span class="line"><span>        cb.saveState();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cb.beginText();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cb.setColorFill(BaseColor.GRAY);</span></span>
<span class="line"><span>        cb.setFontAndSize(bf, 10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // header</span></span>
<span class="line"><span>        float x = document.top(-10);</span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,</span></span>
<span class="line"><span>                headLeftTitle,</span></span>
<span class="line"><span>                document.left(), x, 0);</span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,</span></span>
<span class="line"><span>                headRightTitle,</span></span>
<span class="line"><span>                document.right(), x, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // footer</span></span>
<span class="line"><span>        float y = document.bottom(-10);</span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,</span></span>
<span class="line"><span>                footerLeft,</span></span>
<span class="line"><span>                document.left(), y, 0);</span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_CENTER,</span></span>
<span class="line"><span>                String.format(&quot;- %d -&quot;, writer.getPageNumber()),</span></span>
<span class="line"><span>                (document.right() + document.left()) / 2,</span></span>
<span class="line"><span>                y, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cb.endText();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cb.restoreState();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void addWaterMark(PdfWriter writer, Document document, BaseFont bf) {</span></span>
<span class="line"><span>        for (int i = 1; i &lt; 7; i++) {</span></span>
<span class="line"><span>            for (int j = 1; j &lt; 10; j++) {</span></span>
<span class="line"><span>                PdfContentByte cb = writer.getDirectContent();</span></span>
<span class="line"><span>                cb.saveState();</span></span>
<span class="line"><span>                cb.beginText();</span></span>
<span class="line"><span>                cb.setColorFill(BaseColor.GRAY);</span></span>
<span class="line"><span>                PdfGState gs = new PdfGState();</span></span>
<span class="line"><span>                gs.setFillOpacity(0.1f);</span></span>
<span class="line"><span>                cb.setGState(gs);</span></span>
<span class="line"><span>                cb.setFontAndSize(bf, 12);</span></span>
<span class="line"><span>                cb.showTextAligned(Element.ALIGN_MIDDLE, waterMark, 75 * i,</span></span>
<span class="line"><span>                        80 * j, 30);</span></span>
<span class="line"><span>                cb.endText();</span></span>
<span class="line"><span>                cb.restoreState();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onCloseDocument(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>        ColumnText.showTextAligned(total, Element.ALIGN_LEFT, new Phrase(String.valueOf(writer.getPageNumber() - 1)), 2,</span></span>
<span class="line"><span>                2, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>添加水印后导出后的PDF</p><p><img src="`+i+`" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过如下几个问题进一步理解itextpdf。</p></blockquote><h3 id="遇到license问题怎么办" tabindex="-1">遇到license问题怎么办 <a class="header-anchor" href="#遇到license问题怎么办" aria-label="Permalink to &quot;遇到license问题怎么办&quot;">​</a></h3><p>如前文所述，使用itext一定要了解其版本历史和License问题，在早前版本使用的是<strong>MPL和LGPL双许可协议</strong>，在5.x以上版本中使用的是<strong>AGPLv3</strong>。 有两种选择：</p><ol><li>使用2.1.7版本</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;com.lowagie&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;itext&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;2.1.7&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ol start="2"><li>使用OpenPDF</li></ol><p>GitHub上有团队基于itext 4.x版本（MPL和LGPL双许可协议）fork了一个分支成为<a href="https://github.com/LibrePDF/OpenPDF/" target="_blank" rel="noreferrer">OpenPDF在新窗口打开</a>，并继续维护该项目。</p><h3 id="为何添加页眉页脚和水印是通过pdfpageevent来完成" tabindex="-1">为何添加页眉页脚和水印是通过PdfPageEvent来完成 <a class="header-anchor" href="#为何添加页眉页脚和水印是通过pdfpageevent来完成" aria-label="Permalink to &quot;为何添加页眉页脚和水印是通过PdfPageEvent来完成&quot;">​</a></h3><blockquote><p>为何添加页眉页脚和水印是通过PdfPageEvent来完成？</p></blockquote><p>举个例子，如果我们在上述例子中需要在页脚中显示 “Page 1 of 3&quot;, 即总页数怎么办呢？而itext是流模式的写入内容，只有写到最后，才能知道有多少页，那么显示总页数必须在内容写完之后（或者关闭之前）确定；这就是为什么在onEndPage方法时才会写每页的页眉页脚。</p><p>iText仅在调用释放模板方法后才将PdfTemplate写入到OutputStream中，否则对象将一直保存在内存中，直到关闭文档。所以我们可以在最后关闭文档前，使用PdfTemplate写入总页码。可以理解成先写个占位符，然后统一替换。</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://itextpdf.com" target="_blank" rel="noreferrer">https://itextpdf.com</a></p><p><a href="https://blog.csdn.net/u012397189/article/details/80196974" target="_blank" rel="noreferrer">https://blog.csdn.net/u012397189/article/details/80196974</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,63)]))}const b=a(o,[["render",c]]);export{f as __pageData,b as default};
