import{_ as s}from"./chunks/java_jvm_classload_2.DG-F-PhB.js";import{_ as n}from"./chunks/java_jvm_classload_3.fMcwOggY.js";import{_ as l,c as e,ai as p,o}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/jvm/java_jvm_classload_1.png",g=JSON.parse('{"title":"JVM 基础 - Java 类加载机制","description":"","frontmatter":{},"headers":[],"relativePath":"java/jvm/java-jvm-classload.md","filePath":"java/jvm/java-jvm-classload.md","lastUpdated":1737706346000}'),i={name:"java/jvm/java-jvm-classload.md"};function c(r,a,d,u,h,m){return o(),e("div",null,a[0]||(a[0]=[p('<h1 id="jvm-基础-java-类加载机制" tabindex="-1">JVM 基础 - Java 类加载机制 <a class="header-anchor" href="#jvm-基础-java-类加载机制" aria-label="Permalink to &quot;JVM 基础 - Java 类加载机制&quot;">​</a></h1><blockquote><p>这篇文章将带你深入理解Java 类加载机制。 @pdai</p></blockquote><h2 id="类的生命周期" tabindex="-1">类的生命周期 <a class="header-anchor" href="#类的生命周期" aria-label="Permalink to &quot;类的生命周期&quot;">​</a></h2><p>其中类加载的过程包括了<code>加载</code>、<code>验证</code>、<code>准备</code>、<code>解析</code>、<code>初始化</code>五个阶段。在这五个阶段中，<code>加载</code>、<code>验证</code>、<code>准备</code>和<code>初始化</code>这四个阶段发生的顺序是确定的，<em>而<code>解析</code>阶段则不一定，它在某些情况下可以在初始化阶段之后开始，这是为了支持Java语言的运行时绑定(也成为动态绑定或晚期绑定)</em>。另外注意这里的几个阶段是按顺序开始，而不是按顺序进行或完成，因为这些阶段通常都是互相交叉地混合进行的，通常在一个阶段执行的过程中调用或激活另一个阶段。</p><p><img src="'+s+'" alt="error.图片加载失败"></p><h3 id="类的加载-查找并加载类的二进制数据" tabindex="-1">类的加载: 查找并加载类的二进制数据 <a class="header-anchor" href="#类的加载-查找并加载类的二进制数据" aria-label="Permalink to &quot;类的加载: 查找并加载类的二进制数据&quot;">​</a></h3><p>加载时类加载过程的第一个阶段，在加载阶段，虚拟机需要完成以下三件事情:</p><ul><li>通过一个类的全限定名来获取其定义的二进制字节流。</li><li>将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构。</li><li>在Java堆中生成一个代表这个类的java.lang.Class对象，作为对方法区中这些数据的访问入口。</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><p>相对于类加载的其他阶段而言，<em>加载阶段(准确地说，是加载阶段获取类的二进制字节流的动作)是可控性最强的阶段</em>，因为开发人员既可以使用系统提供的类加载器来完成加载，也可以自定义自己的类加载器来完成加载。</p><p>加载阶段完成后，虚拟机外部的 二进制字节流就按照虚拟机所需的格式存储在方法区之中，而且在Java堆中也创建一个<code>java.lang.Class</code>类的对象，这样便可以通过该对象访问方法区中的这些数据。</p><p>类加载器并不需要等到某个类被“首次主动使用”时再加载它，JVM规范允许类加载器在预料某个类将要被使用时就预先加载它，如果在预先加载的过程中遇到了.class文件缺失或存在错误，类加载器必须在程序首次主动使用该类时才报告错误(LinkageError错误)如果这个类一直没有被程序主动使用，那么类加载器就不会报告错误。</p><blockquote><p>加载.class文件的方式</p></blockquote><ul><li>从本地系统中直接加载</li><li>通过网络下载.class文件</li><li>从zip，jar等归档文件中加载.class文件</li><li>从专有数据库中提取.class文件</li><li>将Java源文件动态编译为.class文件</li></ul><h3 id="连接" tabindex="-1">连接 <a class="header-anchor" href="#连接" aria-label="Permalink to &quot;连接&quot;">​</a></h3><h4 id="验证-确保被加载的类的正确性" tabindex="-1">验证: 确保被加载的类的正确性 <a class="header-anchor" href="#验证-确保被加载的类的正确性" aria-label="Permalink to &quot;验证: 确保被加载的类的正确性&quot;">​</a></h4><p>验证是连接阶段的第一步，这一阶段的目的是为了确保Class文件的字节流中包含的信息符合当前虚拟机的要求，并且不会危害虚拟机自身的安全。验证阶段大致会完成4个阶段的检验动作:</p><ul><li><p><code>文件格式验证</code>: 验证字节流是否符合Class文件格式的规范；例如: 是否以<code>0xCAFEBABE</code>开头、主次版本号是否在当前虚拟机的处理范围之内、常量池中的常量是否有不被支持的类型。</p></li><li><p><code>元数据验证</code>: 对字节码描述的信息进行语义分析(注意: 对比<code>javac</code>编译阶段的语义分析)，以保证其描述的信息符合Java语言规范的要求；例如: 这个类是否有父类，除了<code>java.lang.Object</code>之外。</p></li><li><p><code>字节码验证</code>: 通过数据流和控制流分析，确定程序语义是合法的、符合逻辑的。</p></li><li><p><code>符号引用验证</code>: 确保解析动作能正确执行。</p></li></ul><blockquote><p>验证阶段是非常重要的，但不是必须的，它对程序运行期没有影响，<em>如果所引用的类经过反复验证，那么可以考虑采用<code>-Xverifynone</code>参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。</em></p></blockquote><h4 id="准备-为类的静态变量分配内存-并将其初始化为默认值" tabindex="-1">准备: 为类的静态变量分配内存，并将其初始化为默认值 <a class="header-anchor" href="#准备-为类的静态变量分配内存-并将其初始化为默认值" aria-label="Permalink to &quot;准备: 为类的静态变量分配内存，并将其初始化为默认值&quot;">​</a></h4><p>准备阶段是正式为类变量分配内存并设置类变量初始值的阶段，<strong>这些内存都将在方法区中分配</strong>。对于该阶段有以下几点需要注意:</p><ul><li><p>这时候进行内存分配的仅包括类变量(<code>static</code>)，而不包括实例变量，实例变量会在对象实例化时随着对象一块分配在Java堆中。</p></li><li><p>这里所设置的初始值通常情况下是数据类型默认的零值(如<code>0</code>、<code>0L</code>、<code>null</code>、<code>false</code>等)，而不是被在Java代码中被显式地赋予的值。</p><p>假设一个类变量的定义为: <code>public static int value = 3</code>；那么变量value在准备阶段过后的初始值为<code>0</code>，而不是<code>3</code>，因为这时候尚未开始执行任何Java方法，而把value赋值为3的<code>put static</code>指令是在程序编译后，存放于类构造器<code>&lt;clinit&gt;()</code>方法之中的，所以把value赋值为3的动作将在初始化阶段才会执行。</p></li></ul><blockquote><p>这里还需要注意如下几点</p></blockquote><ul><li>对基本数据类型来说，对于类变量(static)和全局变量，如果不显式地对其赋值而直接使用，则系统会为其赋予默认的零值，而对于局部变量来说，在使用前必须显式地为其赋值，否则编译时不通过。</li><li>对于同时被<code>static</code>和<code>final</code>修饰的常量，必须在声明的时候就为其显式地赋值，否则编译时不通过；而只被final修饰的常量则既可以在声明时显式地为其赋值，也可以在类初始化时显式地为其赋值，总之，在使用前必须为其显式地赋值，系统不会为其赋予默认零值。</li><li>对于引用数据类型<code>reference</code>来说，如数组引用、对象引用等，如果没有对其进行显式地赋值而直接使用，系统都会为其赋予默认的零值，即<code>null</code>。</li><li>如果在数组初始化时没有对数组中的各元素赋值，那么其中的元素将根据对应的数据类型而被赋予默认的零值。</li><li>如果类字段的字段属性表中存在ConstantValue属性，即同时被final和static修饰，那么在准备阶段变量value就会被初始化为ConstValue属性所指定的值。假设上面的类变量value被定义为: <code>public static final int value = 3；</code>编译时Javac将会为value生成ConstantValue属性，在准备阶段虚拟机就会根据ConstantValue的设置将value赋值为3。我们可以理解为<code>static final</code>常量在编译期就将其结果放入了调用它的类的常量池中</li></ul><h4 id="解析-把类中的符号引用转换为直接引用" tabindex="-1">解析: 把类中的符号引用转换为直接引用 <a class="header-anchor" href="#解析-把类中的符号引用转换为直接引用" aria-label="Permalink to &quot;解析: 把类中的符号引用转换为直接引用&quot;">​</a></h4><p>解析阶段是虚拟机将常量池内的符号引用替换为直接引用的过程，解析动作主要针对<code>类</code>或<code>接口</code>、<code>字段</code>、<code>类方法</code>、<code>接口方法</code>、<code>方法类型</code>、<code>方法句柄</code>和<code>调用点</code>限定符7类符号引用进行。符号引用就是一组符号来描述目标，可以是任何字面量。</p><p><code>直接引用</code>就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。</p><h3 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h3><p>初始化，为类的静态变量赋予正确的初始值，JVM负责对类进行初始化，主要对类变量进行初始化。在Java中对类变量进行初始值设定有两种方式:</p><ul><li>声明类变量是指定初始值</li><li>使用静态代码块为类变量指定初始值</li></ul><p><strong>JVM初始化步骤</strong></p><ul><li>假如这个类还没有被加载和连接，则程序先加载并连接该类</li><li>假如该类的直接父类还没有被初始化，则先初始化其直接父类</li><li>假如类中有初始化语句，则系统依次执行这些初始化语句</li></ul><p><strong>类初始化时机</strong>: 只有当对类的主动使用的时候才会导致类的初始化，类的主动使用包括以下六种:</p><ul><li>创建类的实例，也就是new的方式</li><li>访问某个类或接口的静态变量，或者对该静态变量赋值</li><li>调用类的静态方法</li><li>反射(如Class.forName(&quot;com.pdai.jvm.Test&quot;))</li><li>初始化某个类的子类，则其父类也会被初始化</li><li>Java虚拟机启动时被标明为启动类的类(Java Test)，直接使用java.exe命令来运行某个主类</li></ul><h3 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-label="Permalink to &quot;使用&quot;">​</a></h3><p>类访问方法区内的数据结构的接口， 对象是Heap区的数据。</p><h3 id="卸载" tabindex="-1">卸载 <a class="header-anchor" href="#卸载" aria-label="Permalink to &quot;卸载&quot;">​</a></h3><p><strong>Java虚拟机将结束生命周期的几种情况</strong></p><ul><li>执行了System.exit()方法</li><li>程序正常执行结束</li><li>程序在执行过程中遇到了异常或错误而异常终止</li><li>由于操作系统出现错误而导致Java虚拟机进程终止</li></ul><h2 id="类加载器-jvm类加载机制" tabindex="-1">类加载器， JVM类加载机制 <a class="header-anchor" href="#类加载器-jvm类加载机制" aria-label="Permalink to &quot;类加载器， JVM类加载机制&quot;">​</a></h2><h3 id="类加载器的层次" tabindex="-1">类加载器的层次 <a class="header-anchor" href="#类加载器的层次" aria-label="Permalink to &quot;类加载器的层次&quot;">​</a></h3><p><img src="'+n+`" alt="error.图片加载失败"></p><blockquote><p>注意: 这里父类加载器并不是通过继承关系来实现的，而是采用组合实现的。</p></blockquote><blockquote><p>站在Java虚拟机的角度来讲，只存在两种不同的类加载器: 启动类加载器: 它使用C++实现(这里仅限于<code>Hotspot</code>，也就是JDK1.5之后默认的虚拟机，有很多其他的虚拟机是用Java语言实现的)，是虚拟机自身的一部分；所有其他的类加载器: 这些类加载器都由Java语言实现，独立于虚拟机之外，并且全部继承自抽象类<code>java.lang.ClassLoader</code>，这些类加载器需要由启动类加载器加载到内存中之后才能去加载其他的类。</p></blockquote><p><strong>站在Java开发人员的角度来看，类加载器可以大致划分为以下三类</strong> :</p><p><code>启动类加载器</code>: Bootstrap ClassLoader，负责加载存放在JDK\\jre\\lib(JDK代表JDK的安装目录，下同)下，或被-Xbootclasspath参数指定的路径中的，并且能被虚拟机识别的类库(如rt.jar，所有的java.*开头的类均被Bootstrap ClassLoader加载)。启动类加载器是无法被Java程序直接引用的。</p><p><code>扩展类加载器</code>: Extension ClassLoader，该加载器由<code>sun.misc.Launcher$ExtClassLoader</code>实现，它负责加载JDK\\jre\\lib\\ext目录中，或者由java.ext.dirs系统变量指定的路径中的所有类库(如javax.*开头的类)，开发者可以直接使用扩展类加载器。</p><p><code>应用程序类加载器</code>: Application ClassLoader，该类加载器由<code>sun.misc.Launcher$AppClassLoader</code>来实现，它负责加载用户类路径(ClassPath)所指定的类，开发者可以直接使用该类加载器，如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。</p><p>应用程序都是由这三种类加载器互相配合进行加载的，如果有必要，我们还可以加入自定义的类加载器。因为JVM自带的ClassLoader只是懂得从本地文件系统加载标准的java class文件，因此如果编写了自己的ClassLoader，便可以做到如下几点:</p><ul><li>在执行非置信代码之前，自动验证数字签名。</li><li>动态地创建符合用户特定需要的定制化构建类。</li><li>从特定的场所取得java class，例如数据库中和网络中。</li></ul><h3 id="寻找类加载器" tabindex="-1">寻找类加载器 <a class="header-anchor" href="#寻找类加载器" aria-label="Permalink to &quot;寻找类加载器&quot;">​</a></h3><p>寻找类加载器小例子如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.pdai.jvm.classloader;</span></span>
<span class="line"><span>public class ClassLoaderTest {</span></span>
<span class="line"><span>     public static void main(String[] args) {</span></span>
<span class="line"><span>        ClassLoader loader = Thread.currentThread().getContextClassLoader();</span></span>
<span class="line"><span>        System.out.println(loader);</span></span>
<span class="line"><span>        System.out.println(loader.getParent());</span></span>
<span class="line"><span>        System.out.println(loader.getParent().getParent());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结果如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sun.misc.Launcher$AppClassLoader@64fef26a</span></span>
<span class="line"><span>sun.misc.Launcher$ExtClassLoader@1ddd40f3</span></span>
<span class="line"><span>null</span></span></code></pre></div><p>从上面的结果可以看出，并没有获取到<code>ExtClassLoader</code>的父Loader，原因是<code>BootstrapLoader</code>(引导类加载器)是用C语言实现的，找不到一个确定的返回父Loader的方式，于是就返回<code>null</code>。</p><h3 id="类的加载" tabindex="-1">类的加载 <a class="header-anchor" href="#类的加载" aria-label="Permalink to &quot;类的加载&quot;">​</a></h3><p>类加载有三种方式:</p><p>1、命令行启动应用时候由JVM初始化加载</p><p>2、通过Class.forName()方法动态加载</p><p>3、通过ClassLoader.loadClass()方法动态加载</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.pdai.jvm.classloader;</span></span>
<span class="line"><span>public class loaderTest { </span></span>
<span class="line"><span>        public static void main(String[] args) throws ClassNotFoundException { </span></span>
<span class="line"><span>                ClassLoader loader = HelloWorld.class.getClassLoader(); </span></span>
<span class="line"><span>                System.out.println(loader); </span></span>
<span class="line"><span>                //使用ClassLoader.loadClass()来加载类，不会执行初始化块 </span></span>
<span class="line"><span>                loader.loadClass(&quot;Test2&quot;); </span></span>
<span class="line"><span>                //使用Class.forName()来加载类，默认会执行初始化块 </span></span>
<span class="line"><span>//                Class.forName(&quot;Test2&quot;); </span></span>
<span class="line"><span>                //使用Class.forName()来加载类，并指定ClassLoader，初始化时不执行静态块 </span></span>
<span class="line"><span>//                Class.forName(&quot;Test2&quot;, false, loader); </span></span>
<span class="line"><span>        } </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test2 { </span></span>
<span class="line"><span>        static { </span></span>
<span class="line"><span>                System.out.println(&quot;静态初始化块执行了！&quot;); </span></span>
<span class="line"><span>        } </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>分别切换加载方式，会有不同的输出结果。</p><blockquote><p>Class.forName()和ClassLoader.loadClass()区别?</p></blockquote><ul><li>Class.forName(): 将类的.class文件加载到jvm中之外，还会对类进行解释，执行类中的static块；</li><li>ClassLoader.loadClass(): 只干一件事情，就是将.class文件加载到jvm中，不会执行static中的内容,只有在newInstance才会去执行static块。</li><li>Class.forName(name, initialize, loader)带参函数也可控制是否加载static块。并且只有调用了newInstance()方法采用调用构造函数，创建类的对象 。</li></ul><h2 id="jvm类加载机制" tabindex="-1">JVM类加载机制 <a class="header-anchor" href="#jvm类加载机制" aria-label="Permalink to &quot;JVM类加载机制&quot;">​</a></h2><ul><li><p><code>全盘负责</code>，当一个类加载器负责加载某个Class时，该Class所依赖的和引用的其他Class也将由该类加载器负责载入，除非显示使用另外一个类加载器来载入</p></li><li><p><code>父类委托</code>，先让父类加载器试图加载该类，只有在父类加载器无法加载该类时才尝试从自己的类路径中加载该类</p></li><li><p><code>缓存机制</code>，缓存机制将会保证所有加载过的Class都会被缓存，当程序中需要使用某个Class时，类加载器先从缓存区寻找该Class，只有缓存区不存在，系统才会读取该类对应的二进制数据，并将其转换成Class对象，存入缓存区。这就是为什么修改了Class后，必须重启JVM，程序的修改才会生效</p></li><li><p><code>双亲委派机制</code>, 如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把请求委托给父加载器去完成，依次向上，因此，所有的类加载请求最终都应该被传递到顶层的启动类加载器中，只有当父加载器在它的搜索范围中没有找到所需的类时，即无法完成该加载，子加载器才会尝试自己去加载该类。</p></li></ul><p><strong>双亲委派机制过程？</strong></p><ol><li>当AppClassLoader加载一个class时，它首先不会自己去尝试加载这个类，而是把类加载请求委派给父类加载器ExtClassLoader去完成。</li><li>当ExtClassLoader加载一个class时，它首先也不会自己去尝试加载这个类，而是把类加载请求委派给BootStrapClassLoader去完成。</li><li>如果BootStrapClassLoader加载失败(例如在$JAVA_HOME/jre/lib里未查找到该class)，会使用ExtClassLoader来尝试加载；</li><li>若ExtClassLoader也加载失败，则会使用AppClassLoader来加载，如果AppClassLoader也加载失败，则会报出异常ClassNotFoundException。</li></ol><p><strong>双亲委派代码实现</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Class&lt;?&gt; loadClass(String name)throws ClassNotFoundException {</span></span>
<span class="line"><span>            return loadClass(name, false);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    protected synchronized Class&lt;?&gt; loadClass(String name, boolean resolve)throws ClassNotFoundException {</span></span>
<span class="line"><span>            // 首先判断该类型是否已经被加载</span></span>
<span class="line"><span>            Class c = findLoadedClass(name);</span></span>
<span class="line"><span>            if (c == null) {</span></span>
<span class="line"><span>                //如果没有被加载，就委托给父类加载或者委派给启动类加载器加载</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    if (parent != null) {</span></span>
<span class="line"><span>                         //如果存在父类加载器，就委派给父类加载器加载</span></span>
<span class="line"><span>                        c = parent.loadClass(name, false);</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                    //如果不存在父类加载器，就检查是否是由启动类加载器加载的类，通过调用本地方法native Class findBootstrapClass(String name)</span></span>
<span class="line"><span>                        c = findBootstrapClass0(name);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>                 // 如果父类加载器和启动类加载器都不能完成加载任务，才调用自身的加载功能</span></span>
<span class="line"><span>                    c = findClass(name);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (resolve) {</span></span>
<span class="line"><span>                resolveClass(c);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return c;</span></span>
<span class="line"><span>        }</span></span></code></pre></div><p><strong>双亲委派优势</strong></p><ul><li>系统类防止内存中出现多份同样的字节码</li><li>保证Java程序安全稳定运行</li></ul><h2 id="自定义类加载器" tabindex="-1">自定义类加载器 <a class="header-anchor" href="#自定义类加载器" aria-label="Permalink to &quot;自定义类加载器&quot;">​</a></h2><p>通常情况下，我们都是直接使用系统类加载器。但是，有的时候，我们也需要自定义类加载器。比如应用是通过网络来传输 Java 类的字节码，为保证安全性，这些字节码经过了加密处理，这时系统类加载器就无法对其进行加载，这样则需要自定义类加载器来实现。自定义类加载器一般都是继承自 ClassLoader 类，从上面对 loadClass 方法来分析来看，我们只需要重写 findClass 方法即可。下面我们通过一个示例来演示自定义类加载器的流程:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.pdai.jvm.classloader;</span></span>
<span class="line"><span>import java.io.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyClassLoader extends ClassLoader {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String root;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected Class&lt;?&gt; findClass(String name) throws ClassNotFoundException {</span></span>
<span class="line"><span>        byte[] classData = loadClassData(name);</span></span>
<span class="line"><span>        if (classData == null) {</span></span>
<span class="line"><span>            throw new ClassNotFoundException();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return defineClass(name, classData, 0, classData.length);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private byte[] loadClassData(String className) {</span></span>
<span class="line"><span>        String fileName = root + File.separatorChar</span></span>
<span class="line"><span>                + className.replace(&#39;.&#39;, File.separatorChar) + &quot;.class&quot;;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            InputStream ins = new FileInputStream(fileName);</span></span>
<span class="line"><span>            ByteArrayOutputStream baos = new ByteArrayOutputStream();</span></span>
<span class="line"><span>            int bufferSize = 1024;</span></span>
<span class="line"><span>            byte[] buffer = new byte[bufferSize];</span></span>
<span class="line"><span>            int length = 0;</span></span>
<span class="line"><span>            while ((length = ins.read(buffer)) != -1) {</span></span>
<span class="line"><span>                baos.write(buffer, 0, length);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return baos.toByteArray();</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getRoot() {</span></span>
<span class="line"><span>        return root;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setRoot(String root) {</span></span>
<span class="line"><span>        this.root = root;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args)  {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        MyClassLoader classLoader = new MyClassLoader();</span></span>
<span class="line"><span>        classLoader.setRoot(&quot;D:\\\\temp&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Class&lt;?&gt; testClass = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            testClass = classLoader.loadClass(&quot;com.pdai.jvm.classloader.Test2&quot;);</span></span>
<span class="line"><span>            Object object = testClass.newInstance();</span></span>
<span class="line"><span>            System.out.println(object.getClass().getClassLoader());</span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (InstantiationException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (IllegalAccessException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>自定义类加载器的核心在于对字节码文件的获取，如果是加密的字节码则需要在该类中对文件进行解密。由于这里只是演示，我并未对class文件进行加密，因此没有解密的过程。</p><p><strong>这里有几点需要注意</strong> :</p><p>1、这里传递的文件名需要是类的全限定性名称，即<code>com.pdai.jvm.classloader.Test2</code>格式的，因为 defineClass 方法是按这种格式进行处理的。</p><p>2、最好不要重写loadClass方法，因为这样容易破坏双亲委托模式。</p><p>3、这类Test 类本身可以被 AppClassLoader 类加载，因此我们不能把com/pdai/jvm/classloader/Test2.class 放在类路径下。否则，由于双亲委托机制的存在，会直接导致该类由 AppClassLoader 加载，而不会通过我们自定义类加载器来加载。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p><a href="http://www.cnblogs.com/ityouknow/p/5603287.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/ityouknow/p/5603287.html</a></p></li><li><p><a href="http://blog.csdn.net/ns%5C_code/article/details/17881581" target="_blank" rel="noreferrer">http://blog.csdn.net/ns\\_code/article/details/17881581</a></p></li><li><p><a href="https://segmentfault.com/a/1190000005608960" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000005608960</a></p></li><li><p><a href="http://www.importnew.com/18548.html" target="_blank" rel="noreferrer">http://www.importnew.com/18548.html</a></p></li><li><p><a href="http://zyjustin9.iteye.com/blog/2092131" target="_blank" rel="noreferrer">http://zyjustin9.iteye.com/blog/2092131</a></p></li><li><p><a href="http://www.codeceo.com/article/java-class-loader-learn.html" target="_blank" rel="noreferrer">http://www.codeceo.com/article/java-class-loader-learn.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,84)]))}const f=l(i,[["render",c]]);export{g as __pageData,f as default};
