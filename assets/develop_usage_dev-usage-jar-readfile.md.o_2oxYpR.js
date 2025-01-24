import{_ as s,c as e,ai as n,o as p}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"从jar包中读取资源文件","description":"","frontmatter":{},"headers":[],"relativePath":"develop/usage/dev-usage-jar-readfile.md","filePath":"develop/usage/dev-usage-jar-readfile.md","lastUpdated":1737706346000}'),r={name:"develop/usage/dev-usage-jar-readfile.md"};function t(l,a,i,o,c,u){return p(),e("div",null,a[0]||(a[0]=[n(`<h1 id="从jar包中读取资源文件" tabindex="-1">从jar包中读取资源文件 <a class="header-anchor" href="#从jar包中读取资源文件" aria-label="Permalink to &quot;从jar包中读取资源文件&quot;">​</a></h1><blockquote><p>最近做的一些导出项目，需要使用图片资源，字体资源，证书，其它文件等；由于编译为jar并部署的，通常需要读取jar中的资源； 本文只要记录读取资源并通过jar方式运行和在开发IDE中运行的一致性。 @pdai</p></blockquote><h2 id="常规使用" tabindex="-1">常规使用 <a class="header-anchor" href="#常规使用" aria-label="Permalink to &quot;常规使用&quot;">​</a></h2><h3 id="常规使用-绝对路径" tabindex="-1">常规使用 - 绝对路径 <a class="header-anchor" href="#常规使用-绝对路径" aria-label="Permalink to &quot;常规使用 - 绝对路径&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Resource {  </span></span>
<span class="line"><span>    public  void getResource() throws IOException{  </span></span>
<span class="line"><span>        File file=new File(&quot;D:\\\\res.txt&quot;);  </span></span>
<span class="line"><span>        BufferedReader br=new BufferedReader(new FileReader(file));  </span></span>
<span class="line"><span>        String s=&quot;&quot;;  </span></span>
<span class="line"><span>        while((s=br.readLine())!=null)  </span></span>
<span class="line"><span>            System.out.println(s);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="常规使用-项目的相对路径" tabindex="-1">常规使用 - 项目的相对路径 <a class="header-anchor" href="#常规使用-项目的相对路径" aria-label="Permalink to &quot;常规使用 - 项目的相对路径&quot;">​</a></h3><blockquote><p>取的是当前项目的根目录下的文件</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Resource {  </span></span>
<span class="line"><span>    public  void getResource() throws IOException{  </span></span>
<span class="line"><span>        File file=new File(&quot;res.txt&quot;);  </span></span>
<span class="line"><span>        BufferedReader br=new BufferedReader(new FileReader(file));  </span></span>
<span class="line"><span>        String s=&quot;&quot;;  </span></span>
<span class="line"><span>        while((s=br.readLine())!=null)  </span></span>
<span class="line"><span>            System.out.println(s);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码写在IDE 中是能正确运行的。但当我们把整个工程打成jar包以后(ResourceJar.jar)。</p><p>而这时jar包中Resource.class字节码: ldc <code>&lt;String &quot;bin/resource/res.txt&quot;&gt;</code> 将无法定位到jar包中的res.txt位置上。就算把bin/目录去掉: ldc <code>&lt;String &quot;resource/res.txt&quot;&gt;</code> 仍然无法定位到jar包中res.txt上。</p><p>这主要是因为jar包是一个单独的文件而非文件夹，绝对不可能通过&quot;file:/e:/.../ResourceJar.jar/resource/res.txt&quot;这种形式的文件URL来定位res.txt。所以即使是相对路径，也无法定位到jar文件内的txt文件(读者也许对这段原因解释有些费解，在下面我们会用一段代码运行的结果来进一步阐述)。</p><h2 id="jar中读取文件" tabindex="-1">Jar中读取文件 <a class="header-anchor" href="#jar中读取文件" aria-label="Permalink to &quot;Jar中读取文件&quot;">​</a></h2><p>我们可以用类装载器(ClassLoader)来做到这一点:</p><p>(1) ClassLoader 是类加载器的抽象类。它可以在运行时动态的获取加载类的运行信息。 可以这样说，当我们调用ResourceJar.jar中的Resource类时，JVM加载进Resource类，并记录下Resource运行时信息(包括Resource所在jar包的路径信息)。而ClassLoader类中的方法可以帮助我们动态的获取这些信息:</p><p>(2) ClassLoader是abstract的，不可能实例化对象，更加不可能通过ClassLoader调用上面两个方法。所以我们真正写代码的时候，是通过Class类中的getResource()和getResourceAsStream()方法，这两个方法会委托ClassLoader中的getResource()和getResourceAsStream()方法 。好了，现在我们重新写一段Resource代码,来看看上面那段费解的话是什么意思了:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    public class Resource {  </span></span>
<span class="line"><span>        public  void getResource() throws IOException{    </span></span>
<span class="line"><span>                  //查找指定资源的URL，其中res.txt仍然开始的bin目录下   </span></span>
<span class="line"><span>            URL fileURL=this.getClass().getResource(&quot;/resource/res.txt&quot;);   </span></span>
<span class="line"><span>            System.out.println(fileURL.getFile());  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        public static void main(String[] args) throws IOException {  </span></span>
<span class="line"><span>            Resource res=new Resource();  </span></span>
<span class="line"><span>            res.getResource();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>运行这段源代码结果: /E:/Code_Factory/WANWAN/bin/resource/res.txt (../ Code_Factory/WANWAN/.. 是java project所在的路径)</p><p>我们将这段代码打包成ResourceJar.jar ,并将ResourceJar.jar放在其他路径下(比如 c:\\ResourceJar.jar)。然后另外创建一个java project并导入ResourceJar.jar，写一段调用jar包中Resource类的测试代码:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TEST {  </span></span>
<span class="line"><span>    public static void main(String[] args) throws IOException {  </span></span>
<span class="line"><span>        Resource res=new Resource();  </span></span>
<span class="line"><span>        res.getResource();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这时的运行结果是: file:/C:/ResourceJar.jar!/resource/res.txt</p><p>我们成功的在运行时动态获得了res.txt的位置。然而，问题来了，你是否可以通过下面这样的代码来得到res.txt文件? File f=new File(&quot;C:/ResourceJar.jar!/resource/res.txt&quot;);</p><p>当然不可能，因为&quot;.../ResourceJar.jar!/resource/....&quot;并不是文件资源定位符的格式 (jar中资源有其专门的URL形式: jar:<code>&lt;url&gt;</code>!/{entry} )。所以，如果jar包中的类源代码用File f=new File(相对路径);的形式，是不可能定位到文件资源的。这也是为什么源代码1打包成jar文件后，调用jar包时会报出FileNotFoundException的症结所在了。</p><p>(3) 我们不能用常规操作文件的方法来读取ResourceJar.jar中的资源文件res.txt，但可以通过Class类的getResourceAsStream()方法来获取 ，这种方法是如何读取jar中的资源文件的，这一点对于我们来说是透明的。我们将Resource.java改写成:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Resource {  </span></span>
<span class="line"><span>    public void getResource() throws IOException{  </span></span>
<span class="line"><span>        //返回读取指定资源的输入流  </span></span>
<span class="line"><span>        InputStream is=this.getClass().getResourceAsStream(&quot;/resource/res.txt&quot;);   </span></span>
<span class="line"><span>        BufferedReader br=new BufferedReader(new InputStreamReader(is));  </span></span>
<span class="line"><span>        String s=&quot;&quot;;  </span></span>
<span class="line"><span>        while((s=br.readLine())!=null)  </span></span>
<span class="line"><span>            System.out.println(s);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们将java工程下/bin目录中的edu/hxraid/Resource.class和资源文件resource/res.txt一并打包进ResourceJar.jar中，不管jar包在系统的任何目录下，调用jar包中的Resource类都可以获得jar包中的res.txt资源，再也不会找不到res.txt文件了。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="http://hxraid.javaeye.com/blog/483115" target="_blank" rel="noreferrer">http://hxraid.javaeye.com/blog/483115</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,28)]))}const g=s(r,[["render",t]]);export{h as __pageData,g as default};
