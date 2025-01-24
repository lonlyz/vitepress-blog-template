import{_ as s,c as n,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/jvm/java-jvm-class-1.png",t="/vitepress-blog-template/images/jvm/java-jvm-class-2.png",u=JSON.parse('{"title":"JVM 基础 - 类字节码详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/jvm/java-jvm-class.md","filePath":"java/jvm/java-jvm-class.md","lastUpdated":1737706346000}'),i={name:"java/jvm/java-jvm-class.md"};function c(o,a,r,d,h,b){return l(),n("div",null,a[0]||(a[0]=[p('<h1 id="jvm-基础-类字节码详解" tabindex="-1">JVM 基础 - 类字节码详解 <a class="header-anchor" href="#jvm-基础-类字节码详解" aria-label="Permalink to &quot;JVM 基础 - 类字节码详解&quot;">​</a></h1><blockquote><p>源代码通过编译器编译为字节码，再通过类加载子系统进行加载到JVM中运行。@pdai</p></blockquote><h2 id="多语言编译为字节码在jvm运行" tabindex="-1">多语言编译为字节码在JVM运行 <a class="header-anchor" href="#多语言编译为字节码在jvm运行" aria-label="Permalink to &quot;多语言编译为字节码在JVM运行&quot;">​</a></h2><p>计算机是不能直接运行java代码的，必须要先运行java虚拟机，再由java虚拟机运行编译后的java代码。这个编译后的java代码，就是本文要介绍的java字节码。</p><p>为什么jvm不能直接运行java代码呢，这是因为在cpu层面看来计算机中所有的操作都是一个个指令的运行汇集而成的，java是高级语言，只有人类才能理解其逻辑，计算机是无法识别的，所以java代码必须要先编译成字节码文件，jvm才能正确识别代码转换后的指令并将其运行。</p><ul><li>Java代码间接翻译成字节码，储存字节码的文件再交由运行于不同平台上的JVM虚拟机去读取执行，从而实现一次编写，到处运行的目的。</li><li>JVM也不再只支持Java，由此衍生出了许多基于JVM的编程语言，如Groovy, Scala, Koltin等等。</li></ul><p><img src="'+e+'" alt="error.图片加载失败"></p><h2 id="java字节码文件" tabindex="-1">Java字节码文件 <a class="header-anchor" href="#java字节码文件" aria-label="Permalink to &quot;Java字节码文件&quot;">​</a></h2><p>class文件本质上是一个以8位字节为基础单位的二进制流，各个数据项目严格按照顺序紧凑的排列在class文件中。jvm根据其特定的规则解析该二进制数据，从而得到相关信息。</p><p>Class文件采用一种伪结构来存储数据，它有两种类型：无符号数和表。这里暂不详细的讲。</p><p>本文将通过简单的java例子编译后的文件来理解。</p><h3 id="class文件的结构属性" tabindex="-1">Class文件的结构属性 <a class="header-anchor" href="#class文件的结构属性" aria-label="Permalink to &quot;Class文件的结构属性&quot;">​</a></h3><p>在理解之前先从整体看下java字节码文件包含了哪些类型的数据：</p><p><img src="'+t+`" alt="error.图片加载失败"></p><h3 id="从一个例子开始" tabindex="-1">从一个例子开始 <a class="header-anchor" href="#从一个例子开始" aria-label="Permalink to &quot;从一个例子开始&quot;">​</a></h3><p>下面以一个简单的例子来逐步讲解字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Main.java</span></span>
<span class="line"><span>public class Main {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    private int m;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public int inc() {</span></span>
<span class="line"><span>        return m + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过以下命令, 可以在当前所在路径下生成一个Main.class文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>javac Main.java</span></span></code></pre></div><p>以文本的形式打开生成的class文件，内容如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cafe babe 0000 0034 0013 0a00 0400 0f09</span></span>
<span class="line"><span>0003 0010 0700 1107 0012 0100 016d 0100</span></span>
<span class="line"><span>0149 0100 063c 696e 6974 3e01 0003 2829</span></span>
<span class="line"><span>5601 0004 436f 6465 0100 0f4c 696e 654e</span></span>
<span class="line"><span>756d 6265 7254 6162 6c65 0100 0369 6e63</span></span>
<span class="line"><span>0100 0328 2949 0100 0a53 6f75 7263 6546</span></span>
<span class="line"><span>696c 6501 0009 4d61 696e 2e6a 6176 610c</span></span>
<span class="line"><span>0007 0008 0c00 0500 0601 0010 636f 6d2f</span></span>
<span class="line"><span>7268 7974 686d 372f 4d61 696e 0100 106a</span></span>
<span class="line"><span>6176 612f 6c61 6e67 2f4f 626a 6563 7400</span></span>
<span class="line"><span>2100 0300 0400 0000 0100 0200 0500 0600</span></span>
<span class="line"><span>0000 0200 0100 0700 0800 0100 0900 0000</span></span>
<span class="line"><span>1d00 0100 0100 0000 052a b700 01b1 0000</span></span>
<span class="line"><span>0001 000a 0000 0006 0001 0000 0003 0001</span></span>
<span class="line"><span>000b 000c 0001 0009 0000 001f 0002 0001</span></span>
<span class="line"><span>0000 0007 2ab4 0002 0460 ac00 0000 0100</span></span>
<span class="line"><span>0a00 0000 0600 0100 0000 0800 0100 0d00</span></span>
<span class="line"><span>0000 0200 0e</span></span></code></pre></div><ul><li>文件开头的4个字节(&quot;cafe babe&quot;)称之为 <code>魔数</code>，唯有以&quot;cafe babe&quot;开头的class文件方可被虚拟机所接受，这4个字节就是字节码文件的身份识别。</li><li>0000是编译器jdk版本的次版本号0，0034转化为十进制是52,是主版本号，java的版本号从45开始，除1.0和1.1都是使用45.x外,以后每升一个大版本，版本号加一。也就是说，编译生成该class文件的jdk版本为1.8.0。</li></ul><p>通过java -version命令稍加验证, 可得结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Java(TM) SE Runtime Environment (build 1.8.0_131-b11)</span></span>
<span class="line"><span>Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)</span></span></code></pre></div><p>继续往下是常量池... 知道是这么分析的就可以了，然后我们通过工具反编译字节码文件继续去看。</p><h3 id="反编译字节码文件" tabindex="-1">反编译字节码文件 <a class="header-anchor" href="#反编译字节码文件" aria-label="Permalink to &quot;反编译字节码文件&quot;">​</a></h3><blockquote><p>使用到java内置的一个反编译工具javap可以反编译字节码文件, 用法: <code>javap &lt;options&gt; &lt;classes&gt;</code></p></blockquote><p>其中<code>&lt;options&gt;</code>选项包括:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  -help  --help  -?        输出此用法消息</span></span>
<span class="line"><span>  -version                 版本信息</span></span>
<span class="line"><span>  -v  -verbose             输出附加信息</span></span>
<span class="line"><span>  -l                       输出行号和本地变量表</span></span>
<span class="line"><span>  -public                  仅显示公共类和成员</span></span>
<span class="line"><span>  -protected               显示受保护的/公共类和成员</span></span>
<span class="line"><span>  -package                 显示程序包/受保护的/公共类</span></span>
<span class="line"><span>                           和成员 (默认)</span></span>
<span class="line"><span>  -p  -private             显示所有类和成员</span></span>
<span class="line"><span>  -c                       对代码进行反汇编</span></span>
<span class="line"><span>  -s                       输出内部类型签名</span></span>
<span class="line"><span>  -sysinfo                 显示正在处理的类的</span></span>
<span class="line"><span>                           系统信息 (路径, 大小, 日期, MD5 散列)</span></span>
<span class="line"><span>  -constants               显示最终常量</span></span>
<span class="line"><span>  -classpath &lt;path&gt;        指定查找用户类文件的位置</span></span>
<span class="line"><span>  -cp &lt;path&gt;               指定查找用户类文件的位置</span></span>
<span class="line"><span>  -bootclasspath &lt;path&gt;    覆盖引导类文件的位置</span></span></code></pre></div><p>输入命令<code>javap -verbose -p Main.class</code>查看输出内容:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Classfile /E:/JavaCode/TestProj/out/production/TestProj/com/rhythm7/Main.class</span></span>
<span class="line"><span>  Last modified 2018-4-7; size 362 bytes</span></span>
<span class="line"><span>  MD5 checksum 4aed8540b098992663b7ba08c65312de</span></span>
<span class="line"><span>  Compiled from &quot;Main.java&quot;</span></span>
<span class="line"><span>public class com.rhythm7.Main</span></span>
<span class="line"><span>  minor version: 0</span></span>
<span class="line"><span>  major version: 52</span></span>
<span class="line"><span>  flags: ACC_PUBLIC, ACC_SUPER</span></span>
<span class="line"><span>Constant pool:</span></span>
<span class="line"><span>   #1 = Methodref          #4.#18         // java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>   #2 = Fieldref           #3.#19         // com/rhythm7/Main.m:I</span></span>
<span class="line"><span>   #3 = Class              #20            // com/rhythm7/Main</span></span>
<span class="line"><span>   #4 = Class              #21            // java/lang/Object</span></span>
<span class="line"><span>   #5 = Utf8               m</span></span>
<span class="line"><span>   #6 = Utf8               I</span></span>
<span class="line"><span>   #7 = Utf8               &lt;init&gt;</span></span>
<span class="line"><span>   #8 = Utf8               ()V</span></span>
<span class="line"><span>   #9 = Utf8               Code</span></span>
<span class="line"><span>  #10 = Utf8               LineNumberTable</span></span>
<span class="line"><span>  #11 = Utf8               LocalVariableTable</span></span>
<span class="line"><span>  #12 = Utf8               this</span></span>
<span class="line"><span>  #13 = Utf8               Lcom/rhythm7/Main;</span></span>
<span class="line"><span>  #14 = Utf8               inc</span></span>
<span class="line"><span>  #15 = Utf8               ()I</span></span>
<span class="line"><span>  #16 = Utf8               SourceFile</span></span>
<span class="line"><span>  #17 = Utf8               Main.java</span></span>
<span class="line"><span>  #18 = NameAndType        #7:#8          // &quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>  #19 = NameAndType        #5:#6          // m:I</span></span>
<span class="line"><span>  #20 = Utf8               com/rhythm7/Main</span></span>
<span class="line"><span>  #21 = Utf8               java/lang/Object</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  private int m;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: ACC_PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public com.rhythm7.Main();</span></span>
<span class="line"><span>    descriptor: ()V</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=1, locals=1, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: invokespecial #1                  // Method java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>         4: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 3: 0</span></span>
<span class="line"><span>      LocalVariableTable:</span></span>
<span class="line"><span>        Start  Length  Slot  Name   Signature</span></span>
<span class="line"><span>            0       5     0  this   Lcom/rhythm7/Main;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int inc();</span></span>
<span class="line"><span>    descriptor: ()I</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=2, locals=1, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: getfield      #2                  // Field m:I</span></span>
<span class="line"><span>         4: iconst_1</span></span>
<span class="line"><span>         5: iadd</span></span>
<span class="line"><span>         6: ireturn</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 8: 0</span></span>
<span class="line"><span>      LocalVariableTable:</span></span>
<span class="line"><span>        Start  Length  Slot  Name   Signature</span></span>
<span class="line"><span>            0       7     0  this   Lcom/rhythm7/Main;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>SourceFile: &quot;Main.java&quot;</span></span></code></pre></div><h3 id="字节码文件信息" tabindex="-1">字节码文件信息 <a class="header-anchor" href="#字节码文件信息" aria-label="Permalink to &quot;字节码文件信息&quot;">​</a></h3><p>开头的7行信息包括:Class文件当前所在位置，最后修改时间，文件大小，MD5值，编译自哪个文件，类的全限定名，jdk次版本号，主版本号。</p><p>然后紧接着的是该类的访问标志：ACC_PUBLIC, ACC_SUPER，访问标志的含义如下:</p><table tabindex="0"><thead><tr><th>标志名称</th><th>标志值</th><th>含义</th></tr></thead><tbody><tr><td>ACC_PUBLIC</td><td>0x0001</td><td>是否为Public类型</td></tr><tr><td>ACC_FINAL</td><td>0x0010</td><td>是否被声明为final，只有类可以设置</td></tr><tr><td>ACC_SUPER</td><td>0x0020</td><td>是否允许使用invokespecial字节码指令的新语义．</td></tr><tr><td>ACC_INTERFACE</td><td>0x0200</td><td>标志这是一个接口</td></tr><tr><td>ACC_ABSTRACT</td><td>0x0400</td><td>是否为abstract类型，对于接口或者抽象类来说，次标志值为真，其他类型为假</td></tr><tr><td>ACC_SYNTHETIC</td><td>0x1000</td><td>标志这个类并非由用户代码产生</td></tr><tr><td>ACC_ANNOTATION</td><td>0x2000</td><td>标志这是一个注解</td></tr><tr><td>ACC_ENUM</td><td>0x4000</td><td>标志这是一个枚举</td></tr></tbody></table><h3 id="常量池" tabindex="-1">常量池 <a class="header-anchor" href="#常量池" aria-label="Permalink to &quot;常量池&quot;">​</a></h3><p><code>Constant pool</code>意为常量池。</p><p>常量池可以理解成Class文件中的资源仓库。主要存放的是两大类常量：字面量(Literal)和符号引用(Symbolic References)。字面量类似于java中的常量概念，如文本字符串，final常量等，而符号引用则属于编译原理方面的概念，包括以下三种:</p><ul><li>类和接口的全限定名(Fully Qualified Name)</li><li>字段的名称和描述符号(Descriptor)</li><li>方法的名称和描述符</li></ul><p>不同于C/C++, JVM是在加载Class文件的时候才进行的动态链接，也就是说这些字段和方法符号引用只有在运行期转换后才能获得真正的内存入口地址。当虚拟机运行时，需要从常量池获得对应的符号引用，再在类创建或运行时解析并翻译到具体的内存地址中。 直接通过反编译文件来查看字节码内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#1 = Methodref          #4.#18         // java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>#4 = Class              #21            // java/lang/Object</span></span>
<span class="line"><span>#7 = Utf8               &lt;init&gt;</span></span>
<span class="line"><span>#8 = Utf8               ()V</span></span>
<span class="line"><span>#18 = NameAndType        #7:#8          // &quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>#21 = Utf8               java/lang/Object</span></span></code></pre></div><p><strong>第一个常量</strong>是一个方法定义，指向了第4和第18个常量。以此类推查看第4和第18个常量。最后可以拼接成第一个常量右侧的注释内容:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span></code></pre></div><p>这段可以理解为该类的实例构造器的声明，由于Main类没有重写构造方法，所以调用的是父类的构造方法。此处也说明了Main类的直接父类是Object。 该方法默认返回值是V, 也就是void，无返回值。</p><p><strong>第二个常量</strong>同理可得:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#2 = Fieldref           #3.#19         // com/rhythm7/Main.m:I</span></span>
<span class="line"><span>#3 = Class              #20            // com/rhythm7/Main</span></span>
<span class="line"><span>#5 = Utf8               m</span></span>
<span class="line"><span>#6 = Utf8               I</span></span>
<span class="line"><span>#19 = NameAndType        #5:#6          // m:I</span></span>
<span class="line"><span>#20 = Utf8               com/rhythm7/Main</span></span></code></pre></div><p>复制代码此处声明了一个字段m，类型为I, I即是int类型。关于字节码的类型对应如下：</p><table tabindex="0"><thead><tr><th>标识字符</th><th>含义</th></tr></thead><tbody><tr><td>B</td><td>基本类型byte</td></tr><tr><td>C</td><td>基本类型char</td></tr><tr><td>D</td><td>基本类型double</td></tr><tr><td>F</td><td>基本类型float</td></tr><tr><td>I</td><td>基本类型int</td></tr><tr><td>J</td><td>基本类型long</td></tr><tr><td>S</td><td>基本类型short</td></tr><tr><td>Z</td><td>基本类型boolean</td></tr><tr><td>V</td><td>特殊类型void</td></tr><tr><td>L</td><td>对象类型，以分号结尾，如Ljava/lang/Object;</td></tr></tbody></table><p>对于数组类型，每一位使用一个前置的<code>[</code>字符来描述，如定义一个<code>java.lang.String[][]</code>类型的维数组，将被记录为<code>[[Ljava/lang/String;</code></p><h3 id="方法表集合" tabindex="-1">方法表集合 <a class="header-anchor" href="#方法表集合" aria-label="Permalink to &quot;方法表集合&quot;">​</a></h3><p>在常量池之后的是对类内部的方法描述，在字节码中以表的集合形式表现，暂且不管字节码文件的16进制文件内容如何，我们直接看反编译后的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int m;</span></span>
<span class="line"><span>  descriptor: I</span></span>
<span class="line"><span>  flags: ACC_PRIVATE</span></span></code></pre></div><p>此处声明了一个私有变量m，类型为int，返回值为int</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public com.rhythm7.Main();</span></span>
<span class="line"><span>   descriptor: ()V</span></span>
<span class="line"><span>   flags: ACC_PUBLIC</span></span>
<span class="line"><span>   Code:</span></span>
<span class="line"><span>     stack=1, locals=1, args_size=1</span></span>
<span class="line"><span>        0: aload_0</span></span>
<span class="line"><span>        1: invokespecial #1                  // Method java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>        4: return</span></span>
<span class="line"><span>     LineNumberTable:</span></span>
<span class="line"><span>       line 3: 0</span></span>
<span class="line"><span>     LocalVariableTable:</span></span>
<span class="line"><span>       Start  Length  Slot  Name   Signature</span></span>
<span class="line"><span>           0       5     0  this   Lcom/rhythm7/Main;</span></span></code></pre></div><p>这里是构造方法：Main()，返回值为void, 公开方法。</p><p>code内的主要属性为:</p><ul><li><p><strong>stack</strong>: 最大操作数栈，JVM运行时会根据这个值来分配栈帧(Frame)中的操作栈深度,此处为1</p></li><li><p><strong>locals</strong>: 局部变量所需的存储空间，单位为Slot, Slot是虚拟机为局部变量分配内存时所使用的最小单位，为4个字节大小。方法参数(包括实例方法中的隐藏参数this)，显示异常处理器的参数(try catch中的catch块所定义的异常)，方法体中定义的局部变量都需要使用局部变量表来存放。值得一提的是，locals的大小并不一定等于所有局部变量所占的Slot之和，因为局部变量中的Slot是可以重用的。</p></li><li><p><strong>args_size</strong>: 方法参数的个数，这里是1，因为每个实例方法都会有一个隐藏参数this</p></li><li><p><strong>attribute_info</strong>: 方法体内容，0,1,4为字节码&quot;行号&quot;，该段代码的意思是将第一个引用类型本地变量推送至栈顶，然后执行该类型的实例方法，也就是常量池存放的第一个变量，也就是注释里的<code>java/lang/Object.&quot;&quot;:()V</code>, 然后执行返回语句，结束方法。</p></li><li><p><strong>LineNumberTable</strong>: 该属性的作用是描述源码行号与字节码行号(字节码偏移量)之间的对应关系。可以使用 -g:none 或-g:lines选项来取消或要求生成这项信息，如果选择不生成LineNumberTable，当程序运行异常时将无法获取到发生异常的源码行号，也无法按照源码的行数来调试程序。</p></li><li><p><strong>LocalVariableTable</strong>: 该属性的作用是描述帧栈中局部变量与源码中定义的变量之间的关系。可以使用 -g:none 或 -g:vars来取消或生成这项信息，如果没有生成这项信息，那么当别人引用这个方法时，将无法获取到参数名称，取而代之的是arg0, arg1这样的占位符。 start 表示该局部变量在哪一行开始可见，length表示可见行数，Slot代表所在帧栈位置，Name是变量名称，然后是类型签名。</p></li></ul><p>同理可以分析Main类中的另一个方法&quot;inc()&quot;:</p><p>方法体内的内容是：将this入栈，获取字段#2并置于栈顶, 将int类型的1入栈，将栈内顶部的两个数值相加，返回一个int类型的值。</p><h3 id="类名" tabindex="-1">类名 <a class="header-anchor" href="#类名" aria-label="Permalink to &quot;类名&quot;">​</a></h3><p>最后很显然是源码文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SourceFile: &quot;Main.java&quot;</span></span></code></pre></div><h2 id="再看两个示例" tabindex="-1">再看两个示例 <a class="header-anchor" href="#再看两个示例" aria-label="Permalink to &quot;再看两个示例&quot;">​</a></h2><h3 id="分析try-catch-finally" tabindex="-1">分析try-catch-finally <a class="header-anchor" href="#分析try-catch-finally" aria-label="Permalink to &quot;分析try-catch-finally&quot;">​</a></h3><p>通过以上一个最简单的例子，可以大致了解源码被编译成字节码后是什么样子的。 下面利用所学的知识点来分析一些Java问题:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestCode {</span></span>
<span class="line"><span>    public int foo() {</span></span>
<span class="line"><span>        int x;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            x = 1;</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            x = 2;</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            x = 3;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>试问当不发生异常和发生异常的情况下，foo()的返回值分别是多少。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>javac TestCode.java</span></span>
<span class="line"><span>javap -verbose TestCode.class</span></span></code></pre></div><p>查看字节码的foo方法内容:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int foo();</span></span>
<span class="line"><span>    descriptor: ()I</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=1, locals=5, args_size=1</span></span>
<span class="line"><span>         0: iconst_1 //int型1入栈 -&gt;栈顶=1</span></span>
<span class="line"><span>         1: istore_1 //将栈顶的int型数值存入第二个局部变量 -&gt;局部2=1</span></span>
<span class="line"><span>         2: iload_1 //将第二个int型局部变量推送至栈顶 -&gt;栈顶=1</span></span>
<span class="line"><span>         3: istore_2 //!!将栈顶int型数值存入第三个局部变量 -&gt;局部3=1</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>         4: iconst_3 //int型3入栈 -&gt;栈顶=3</span></span>
<span class="line"><span>         5: istore_1 //将栈顶的int型数值存入第二个局部变量 -&gt;局部2=3</span></span>
<span class="line"><span>         6: iload_2 //!!将第三个int型局部变量推送至栈顶 -&gt;栈顶=1</span></span>
<span class="line"><span>         7: ireturn //从当前方法返回栈顶int数值 -&gt;1</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>         8: astore_2 // -&gt;局部3=Exception</span></span>
<span class="line"><span>         9: iconst_2 // -&gt;栈顶=2</span></span>
<span class="line"><span>        10: istore_1 // -&gt;局部2=2</span></span>
<span class="line"><span>        11: iload_1 //-&gt;栈顶=2</span></span>
<span class="line"><span>        12: istore_3 //!! -&gt;局部4=2</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        13: iconst_3 // -&gt;栈顶=3</span></span>
<span class="line"><span>        14: istore_1 // -&gt;局部1=3</span></span>
<span class="line"><span>        15: iload_3 //!! -&gt;栈顶=2</span></span>
<span class="line"><span>        16: ireturn // -&gt; 2</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        17: astore        4 //将栈顶引用型数值存入第五个局部变量=any</span></span>
<span class="line"><span>        19: iconst_3 //将int型数值3入栈 -&gt; 栈顶3</span></span>
<span class="line"><span>        20: istore_1 //将栈顶第一个int数值存入第二个局部变量 -&gt; 局部2=3</span></span>
<span class="line"><span>        21: aload         4 //将局部第五个局部变量(引用型)推送至栈顶</span></span>
<span class="line"><span>        23: athrow //将栈顶的异常抛出</span></span>
<span class="line"><span>      Exception table:</span></span>
<span class="line"><span>         from    to  target type</span></span>
<span class="line"><span>             0     4     8   Class java/lang/Exception //0到4行对应的异常，对应#8中储存的异常</span></span>
<span class="line"><span>             0     4    17   any //Exeption之外的其他异常</span></span>
<span class="line"><span>             8    13    17   any</span></span>
<span class="line"><span>            17    19    17   any</span></span></code></pre></div><p>在字节码的4,5，以及13,14中执行的是同一个操作，就是将int型的3入操作数栈顶，并存入第二个局部变量。这正是我们源码在finally语句块中内容。也就是说，JVM在处理异常时，会在每个可能的分支都将finally语句重复执行一遍。</p><p>通过一步步分析字节码，可以得出最后的运行结果是：</p><ul><li>不发生异常时: return 1</li><li>发生异常时: return 2</li><li>发生非Exception及其子类的异常，抛出异常，不返回值</li></ul><blockquote><p>以上例子来自于《深入理解Java虚拟机 JVM高级特性与最佳实践》, 关于虚拟机字节码指令表，也可以在《深入理解Java虚拟机 JVM高级特性与最佳实践-附录B》中获取。</p></blockquote><h3 id="kotlin-函数扩展的实现" tabindex="-1">kotlin 函数扩展的实现 <a class="header-anchor" href="#kotlin-函数扩展的实现" aria-label="Permalink to &quot;kotlin 函数扩展的实现&quot;">​</a></h3><p>kotlin提供了扩展函数的语言特性，借助这个特性，我们可以给任意对象添加自定义方法。</p><p>以下示例为Object添加&quot;sayHello&quot;方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//SayHello.kt</span></span>
<span class="line"><span>package com.rhythm7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fun Any.sayHello() {</span></span>
<span class="line"><span>    println(&quot;Hello&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>编译后，使用javap查看生成SayHelloKt.class文件的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Classfile /E:/JavaCode/TestProj/out/production/TestProj/com/rhythm7/SayHelloKt.class</span></span>
<span class="line"><span>Last modified 2018-4-8; size 958 bytes</span></span>
<span class="line"><span> MD5 checksum 780a04b75a91be7605cac4655b499f19</span></span>
<span class="line"><span> Compiled from &quot;SayHello.kt&quot;</span></span>
<span class="line"><span>public final class com.rhythm7.SayHelloKt</span></span>
<span class="line"><span> minor version: 0</span></span>
<span class="line"><span> major version: 52</span></span>
<span class="line"><span> flags: ACC_PUBLIC, ACC_FINAL, ACC_SUPER</span></span>
<span class="line"><span>Constant pool:</span></span>
<span class="line"><span>    //省略常量池部分字节码</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> public static final void sayHello(java.lang.Object);</span></span>
<span class="line"><span>   descriptor: (Ljava/lang/Object;)V</span></span>
<span class="line"><span>   flags: ACC_PUBLIC, ACC_STATIC, ACC_FINAL</span></span>
<span class="line"><span>   Code:</span></span>
<span class="line"><span>     stack=2, locals=2, args_size=1</span></span>
<span class="line"><span>        0: aload_0</span></span>
<span class="line"><span>        1: ldc           #9                  // String $receiver</span></span>
<span class="line"><span>        3: invokestatic  #15                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V</span></span>
<span class="line"><span>        6: ldc           #17                 // String Hello</span></span>
<span class="line"><span>        8: astore_1</span></span>
<span class="line"><span>        9: getstatic     #23                 // Field java/lang/System.out:Ljava/io/PrintStream;</span></span>
<span class="line"><span>       12: aload_1</span></span>
<span class="line"><span>       13: invokevirtual #28                 // Method java/io/PrintStream.println:(Ljava/lang/Object;)V</span></span>
<span class="line"><span>       16: return</span></span>
<span class="line"><span>     LocalVariableTable:</span></span>
<span class="line"><span>       Start  Length  Slot  Name   Signature</span></span>
<span class="line"><span>           0      17     0 $receiver   Ljava/lang/Object;</span></span>
<span class="line"><span>     LineNumberTable:</span></span>
<span class="line"><span>       line 4: 6</span></span>
<span class="line"><span>       line 5: 16</span></span>
<span class="line"><span>   RuntimeInvisibleParameterAnnotations:</span></span>
<span class="line"><span>     0:</span></span>
<span class="line"><span>       0: #7()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>SourceFile: &quot;SayHello.kt&quot;</span></span></code></pre></div><p>观察头部发现,koltin为文件SayHello生成了一个类，类名&quot;com.rhythm7.SayHelloKt&quot;.</p><p>由于我们一开始编写SayHello.kt时并不希望SayHello是一个可实例化的对象类，所以，SayHelloKt是无法被实例化的，SayHelloKt并没有任何一个构造器。</p><p>再观察唯一的一个方法：发现Any.sayHello()的具体实现是静态不可变方法的形式:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static final void sayHello(java.lang.Object);</span></span></code></pre></div><p>所以当我们在其他地方使用Any.sayHello()时，事实上等同于调用java的SayHelloKt.sayHello(Object)方法。</p><p>顺便一提的是，当扩展的方法为Any时，意味着Any是non-null的，这时，编译器会在方法体的开头检查参数的非空，即调用 <code>kotlin.jvm.internal.Intrinsics.checkParameterIsNotNull(Object value, String paramName)</code> 方法来检查传入的Any类型对象是否为空。如果我们扩展的函数为<code>Any?.sayHello()</code>，那么在编译后的文件中则不会有这段字节码的出现。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.cnblogs.com/paddix/p/5282004.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/paddix/p/5282004.html</a></li><li><a href="https://blog.csdn.net/sinat%5C_37191123/article/details/84582438" target="_blank" rel="noreferrer">https://blog.csdn.net/sinat\\_37191123/article/details/84582438</a></li><li><a href="https://blog.csdn.net/tyyj90/article/details/78472986" target="_blank" rel="noreferrer">https://blog.csdn.net/tyyj90/article/details/78472986</a></li><li><a href="https://blog.csdn.net/a15089415104/article/details/83215598" target="_blank" rel="noreferrer">https://blog.csdn.net/a15089415104/article/details/83215598</a></li><li>咸鱼不思议 <a href="https://juejin.im/post/5aca2c366fb9a028c97a5609" target="_blank" rel="noreferrer">https://juejin.im/post/5aca2c366fb9a028c97a5609</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,89)]))}const v=s(i,[["render",c]]);export{u as __pageData,v as default};
