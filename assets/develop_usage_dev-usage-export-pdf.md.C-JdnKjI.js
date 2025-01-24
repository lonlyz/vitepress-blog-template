import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"Itext PDF 导出","description":"","frontmatter":{},"headers":[],"relativePath":"develop/usage/dev-usage-export-pdf.md","filePath":"develop/usage/dev-usage-export-pdf.md","lastUpdated":1737706346000}'),t={name:"develop/usage/dev-usage-export-pdf.md"};function l(i,n,o,c,r,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="itext-pdf-导出" tabindex="-1">Itext PDF 导出 <a class="header-anchor" href="#itext-pdf-导出" aria-label="Permalink to &quot;Itext PDF 导出&quot;">​</a></h1><blockquote><p>给我的文档系统添加了导出，本文记录PDF填坑小结。@pdai</p></blockquote><h2 id="pdf导出的实现" tabindex="-1">PDF导出的实现 <a class="header-anchor" href="#pdf导出的实现" aria-label="Permalink to &quot;PDF导出的实现&quot;">​</a></h2><h3 id="导出流" tabindex="-1">导出流 <a class="header-anchor" href="#导出流" aria-label="Permalink to &quot;导出流&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RequestMapping(value = &quot;export&quot;)</span></span>
<span class="line"><span>public void exportPdfNew(String mdContent, String type, HttpServletResponse response) {</span></span>
<span class="line"><span>	response.reset();</span></span>
<span class="line"><span>	response.setContentType(&quot;multipart/form-data&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	String title = &quot;file&quot;;</span></span>
<span class="line"><span>	String author = &quot;pdai&quot;;</span></span>
<span class="line"><span>	String mdFileContent = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ServletOutputStream out = null;</span></span>
<span class="line"><span>	try {</span></span>
<span class="line"><span>		byte[] fileBytes = null;</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		String htmlFile = StringEscapeUtils.unescapeHtml4(mdContent);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		String cleanedHtmlFile = htmlFile.replace(&quot;&lt;img&quot;, &quot;&lt;img style=\\&quot;display:inline-block;width:100%;max-width:650px;\\&quot; &quot;);</span></span>
<span class="line"><span>		cleanedHtmlFile = cleanHtml(cleanedHtmlFile);</span></span>
<span class="line"><span>		fileBytes = convert(author, cleanedHtmlFile);</span></span>
<span class="line"><span>		response.setHeader(&quot;Content-Disposition&quot;,</span></span>
<span class="line"><span>				&quot;inline; filename=\\&quot;&quot; + title + &quot;_&quot; + System.currentTimeMillis() + &quot;.pdf\\&quot;&quot;);</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>		out = response.getOutputStream();</span></span>
<span class="line"><span>		out.write(fileBytes);</span></span>
<span class="line"><span>		out.close();</span></span>
<span class="line"><span>		out.flush();</span></span>
<span class="line"><span>	} catch (Exception e) {</span></span>
<span class="line"><span>		System.out.println(e);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="清理html" tabindex="-1">清理HTML <a class="header-anchor" href="#清理html" aria-label="Permalink to &quot;清理HTML&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static String cleanHtml(String input) throws ConversionException, IOException {</span></span>
<span class="line"><span>	InputStream stringAsStream;</span></span>
<span class="line"><span>	try {</span></span>
<span class="line"><span>		stringAsStream = new ByteArrayInputStream(input.getBytes(&quot;UTF-8&quot;));</span></span>
<span class="line"><span>	} catch (UnsupportedEncodingException e) {</span></span>
<span class="line"><span>		throw ConversionException.HTML_TO_PDF_EXCEPTION;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	HtmlCleaner cleaner = new HtmlCleaner();</span></span>
<span class="line"><span>	TagNode node = cleaner.clean(stringAsStream, &quot;UTF-8&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	TagNode t = new TagNode(&quot;root&quot;);</span></span>
<span class="line"><span>	t.addChild(node);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	String html = cleaner.getInnerHtml(t);</span></span>
<span class="line"><span>	return html;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="页眉页脚支持" tabindex="-1">页眉页脚支持 <a class="header-anchor" href="#页眉页脚支持" aria-label="Permalink to &quot;页眉页脚支持&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HeaderFooterEvent extends PdfPageEventHelper {</span></span>
<span class="line"><span>	String header, author;</span></span>
<span class="line"><span>	PdfTemplate total;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void setHeader(String header) {</span></span>
<span class="line"><span>		this.header = header;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public void setAuthor(String author) {</span></span>
<span class="line"><span>		this.author = author;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void onOpenDocument(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>		total = writer.getDirectContent().createTemplate(30, 16);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//	public void onEndPage(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>//		PdfPTable table = new PdfPTable(3);</span></span>
<span class="line"><span>//		try {</span></span>
<span class="line"><span>//			table.setWidths(new int[] { 60, 24, 2 });</span></span>
<span class="line"><span>//			table.setTotalWidth(600);</span></span>
<span class="line"><span>//			table.setLockedWidth(true);</span></span>
<span class="line"><span>//			table.getDefaultCell().setFixedHeight(40);</span></span>
<span class="line"><span>//			table.getDefaultCell().setBorder(Rectangle.BOX);</span></span>
<span class="line"><span>//			table.getDefaultCell().setBorderWidth(0.1f);</span></span>
<span class="line"><span>//			table.getDefaultCell().setBorderColor(Color.gray);</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//			table.addCell(header);</span></span>
<span class="line"><span>//			table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);</span></span>
<span class="line"><span>//			table.addCell(String.format(&quot;Page %d of&quot;, writer.getPageNumber()));</span></span>
<span class="line"><span>//			PdfPCell cell = new PdfPCell(Image.getInstance(total));</span></span>
<span class="line"><span>//			cell.setBorder(Rectangle.BOTTOM);</span></span>
<span class="line"><span>//			table.addCell(cell);</span></span>
<span class="line"><span>//			table.writeSelectedRows(0, -1, 34, 803, writer.getDirectContent());</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//		} catch (DocumentException de) {</span></span>
<span class="line"><span>//			throw new ExceptionConverter(de);</span></span>
<span class="line"><span>//		}</span></span>
<span class="line"><span>//	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public void onEndPage(PdfWriter writer, Document document) {  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        PdfContentByte cb = writer.getDirectContent();  </span></span>
<span class="line"><span>        cb.saveState();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        cb.beginText();  </span></span>
<span class="line"><span>        BaseFont bf = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);</span></span>
<span class="line"><span>        } catch (Exception e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        cb.setColorFill(Color.GRAY);</span></span>
<span class="line"><span>        cb.setFontAndSize(bf, 10);  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        //Header  </span></span>
<span class="line"><span>        float x = document.top(-10);  </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        //左  </span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,  </span></span>
<span class="line"><span>                           &quot;Author: &quot; + author,   </span></span>
<span class="line"><span>                           document.left(), x, 0);  </span></span>
<span class="line"><span>        //中  </span></span>
<span class="line"><span>//        cb.showTextAligned(PdfContentByte.ALIGN_CENTER,  </span></span>
<span class="line"><span>//                            writer.getPageNumber()+ &quot; page&quot;,  </span></span>
<span class="line"><span>//                           (document.right() + document.left())/2,  </span></span>
<span class="line"><span>//                           x, 0);  </span></span>
<span class="line"><span>        //右  </span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,  </span></span>
<span class="line"><span>                           &quot;Email: suzhou.daipeng@gmail.com&quot;,  </span></span>
<span class="line"><span>                           document.right(), x, 0);  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        //Footer  </span></span>
<span class="line"><span>        float y = document.bottom(-10);  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        //左  </span></span>
<span class="line"><span>        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,  </span></span>
<span class="line"><span>                           &quot;Confidential&quot;,  </span></span>
<span class="line"><span>                           document.left(), y, 0);  </span></span>
<span class="line"><span>        //中  </span></span>
<span class="line"><span>		cb.showTextAligned(PdfContentByte.ALIGN_CENTER,  </span></span>
<span class="line"><span>				String.format(&quot;- %d -&quot;, writer.getPageNumber()),  </span></span>
<span class="line"><span>		                   (document.right() + document.left())/2,  </span></span>
<span class="line"><span>		                   y, 0);</span></span>
<span class="line"><span>        //右  </span></span>
<span class="line"><span>//        cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,  </span></span>
<span class="line"><span>//                           &quot;F-Right&quot;,  </span></span>
<span class="line"><span>//                           document.right(), y, 0);  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        cb.endText();  </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        cb.restoreState();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void onCloseDocument(PdfWriter writer, Document document) {</span></span>
<span class="line"><span>		ColumnText.showTextAligned(total, Element.ALIGN_LEFT, new Phrase(String.valueOf(writer.getPageNumber() - 1)), 2,</span></span>
<span class="line"><span>				2, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="pdf中文支持" tabindex="-1">PDF中文支持 <a class="header-anchor" href="#pdf中文支持" aria-label="Permalink to &quot;PDF中文支持&quot;">​</a></h2><blockquote><p>常见的中文支持思路:</p></blockquote><p>简单demo如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package oliver.itext.demo;  </span></span>
<span class="line"><span>import java.io.File;  </span></span>
<span class="line"><span>import java.io.FileOutputStream;  </span></span>
<span class="line"><span>import java.io.IOException;  </span></span>
<span class="line"><span>import java.io.OutputStream;  </span></span>
<span class="line"><span>import com.itextpdf.text.Document;  </span></span>
<span class="line"><span>import com.itextpdf.text.DocumentException;  </span></span>
<span class="line"><span>import com.itextpdf.text.Font;  </span></span>
<span class="line"><span>import com.itextpdf.text.Paragraph;  </span></span>
<span class="line"><span>import com.itextpdf.text.pdf.BaseFont;  </span></span>
<span class="line"><span>import com.itextpdf.text.pdf.PdfWriter;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>public class PDF2Chinese  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    public static void main(String[] args) throws DocumentException, IOException  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        Document document = new Document();  </span></span>
<span class="line"><span>        OutputStream os = new FileOutputStream(new File(&quot;chinese.pdf&quot;));  </span></span>
<span class="line"><span>        PdfWriter.getInstance(document,os);  </span></span>
<span class="line"><span>        document.open();  </span></span>
<span class="line"><span>        //方法一: 使用Windows系统字体(TrueType)  </span></span>
<span class="line"><span>        BaseFont baseFont = BaseFont.createFont(&quot;C:/Windows/Fonts/SIMYOU.TTF&quot;,BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        //方法二: 使用iTextAsian.jar中的字体  </span></span>
<span class="line"><span>        //BaseFont baseFont = BaseFont.createFont(&quot;STSong-Light&quot;,BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        //方法三: 使用资源字体(ClassPath)  </span></span>
<span class="line"><span>        ////BaseFont baseFont = BaseFont.createFont(&quot;/SIMYOU.TTF&quot;,BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  </span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        Font font = new Font(baseFont);  </span></span>
<span class="line"><span>        document.add(new Paragraph(&quot;解决中文问题了！&quot;,font));  </span></span>
<span class="line"><span>        document.close();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="通过itextfontresolvert添加字体" tabindex="-1">通过ITextFontResolvert添加字体 <a class="header-anchor" href="#通过itextfontresolvert添加字体" aria-label="Permalink to &quot;通过ITextFontResolvert添加字体&quot;">​</a></h3><p>将Windows下fonts中所需要的字体拷贝到项目classpath下:</p><p>在代码中通过<code>ITextFontResolver</code>添加字体，具体代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public byte[] convert(String author, String input)</span></span>
<span class="line"><span>			throws ConversionException, IOException, com.lowagie.text.DocumentException {</span></span>
<span class="line"><span>	ITextRenderer renderer = new ITextRenderer();</span></span>
<span class="line"><span>	renderer.setDocumentFromString(new String(input.getBytes()));</span></span>
<span class="line"><span>	renderer.setPDFVersion(PdfWriter.VERSION_1_7);</span></span>
<span class="line"><span>	HeaderFooterEvent headerFooterEvent = new HeaderFooterEvent();</span></span>
<span class="line"><span>	headerFooterEvent.setAuthor(author);</span></span>
<span class="line"><span>	renderer.setPdfPageEvent(headerFooterEvent);</span></span>
<span class="line"><span>	ITextFontResolver fontResolver = renderer.getFontResolver();</span></span>
<span class="line"><span>	fontResolver.addFont(fontPath+&quot;MSYH.TTC&quot;, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);// 微软雅黑</span></span>
<span class="line"><span>	fontResolver.addFont(fontPath+&quot;MSYHBD.TTC&quot;, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);</span></span>
<span class="line"><span>	fontResolver.addFont(fontPath+&quot;MSYHL.TTC&quot;, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	renderer.layout();</span></span>
<span class="line"><span>	ByteArrayOutputStream outputStream = new ByteArrayOutputStream();</span></span>
<span class="line"><span>	renderer.createPDF(outputStream);</span></span>
<span class="line"><span>	byte[] bytes = outputStream.toByteArray();</span></span>
<span class="line"><span>	return bytes;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="pdf-linux环境下中文字体乱码" tabindex="-1">PDF Linux环境下中文字体乱码 <a class="header-anchor" href="#pdf-linux环境下中文字体乱码" aria-label="Permalink to &quot;PDF Linux环境下中文字体乱码&quot;">​</a></h2><blockquote><p>用itext生成pdf在windows环境下没有出现中文乱码而在linux下出现中文乱码，打开pdf查看pdf编码，以及显示的编码，发现编码并没有对应。原因是使用的宋体和微软雅黑在linux环境下并没有安装。</p></blockquote><h3 id="解决方法" tabindex="-1">解决方法 <a class="header-anchor" href="#解决方法" aria-label="Permalink to &quot;解决方法&quot;">​</a></h3><ul><li><p>由于我这边PDF生成是通过HTML转化的，所以第一步先导出HTML，去查看需要用哪些字体文件；</p></li><li><p>到windows环境下将所需字体拷贝到linux下。(simsun.ttc(宋体), msyf.ttf(微软雅黑))</p></li><li><p>到linux环境下创建目录</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mkdir -pv /usr/share/fonts/chinese/TrueType</span></span></code></pre></div><p>将字体放入目录下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd /usr/share/fonts/chinese/TrueType</span></span>
<span class="line"><span>chmod 755 * 为字体赋予可执行权限</span></span></code></pre></div><ul><li>建立字体缓存</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mkfontscale (如果提示 mkfontscale: command not found，需自行安装 # yum install mkfontscale )</span></span>
<span class="line"><span>mkfontdir</span></span>
<span class="line"><span>fc-cache -fv (如果提示 fc-cache: command not found，则需要安装# yum install fontconfig )</span></span></code></pre></div><ul><li>reboot重启系统</li></ul><blockquote><p>经不同Linux环境测试，以上步骤必须顺序全部执行， 建立字体缓存必须是在字体拷贝完成之后顺序执行 mkfontscale，mkfontdir，fc-cache -fv</p></blockquote><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,29)]))}const m=s(t,[["render",l]]);export{h as __pageData,m as default};
