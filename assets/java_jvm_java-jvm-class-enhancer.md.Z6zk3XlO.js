import{_ as a,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/jvm/java-class-enhancer-1.png",i="/vitepress-blog-template/images/jvm/java-class-enhancer-2.png",l="/vitepress-blog-template/images/jvm/java-class-enhancer-3.png",o="/vitepress-blog-template/images/jvm/java-class-enhancer-4.png",r="/vitepress-blog-template/images/jvm/java-class-enhancer-5.png",c="/vitepress-blog-template/images/jvm/java-class-enhancer-6.png",u="/vitepress-blog-template/images/jvm/java-class-enhancer-7.png",d="/vitepress-blog-template/images/jvm/java-class-enhancer-8.png",C=JSON.parse('{"title":"JVM 基础 - 字节码的增强技术","description":"","frontmatter":{},"headers":[],"relativePath":"java/jvm/java-jvm-class-enhancer.md","filePath":"java/jvm/java-jvm-class-enhancer.md","lastUpdated":1737706346000}'),m={name:"java/jvm/java-jvm-class-enhancer.md"};function h(v,s,g,M,b,A){return p(),n("div",null,s[0]||(s[0]=[e('<h1 id="jvm-基础-字节码的增强技术" tabindex="-1">JVM 基础 - 字节码的增强技术 <a class="header-anchor" href="#jvm-基础-字节码的增强技术" aria-label="Permalink to &quot;JVM 基础 - 字节码的增强技术&quot;">​</a></h1><blockquote><p>在上文中，着重介绍了字节码的结构，这为我们了解字节码增强技术的实现打下了基础。字节码增强技术就是一类对现有字节码进行修改或者动态生成全新字节码文件的技术。接下来，我们将从最直接操纵字节码的实现方式开始深入进行剖析。@pdai</p></blockquote><h2 id="字节码增强技术" tabindex="-1">字节码增强技术 <a class="header-anchor" href="#字节码增强技术" aria-label="Permalink to &quot;字节码增强技术&quot;">​</a></h2><p>在上文中，着重介绍了字节码的结构，这为我们了解字节码增强技术的实现打下了基础。字节码增强技术就是一类对现有字节码进行修改或者动态生成全新字节码文件的技术。接下来，我们将从最直接操纵字节码的实现方式开始深入进行剖析</p><p><img src="'+t+'" alt="error.图片加载失败"></p><h3 id="asm" tabindex="-1">ASM <a class="header-anchor" href="#asm" aria-label="Permalink to &quot;ASM&quot;">​</a></h3><p>对于需要手动操纵字节码的需求，可以使用ASM，它可以直接生产 .class字节码文件，也可以在类被加载入JVM之前动态修改类行为（如下图17所示）。ASM的应用场景有AOP（Cglib就是基于ASM）、热部署、修改其他jar包中的类等。当然，涉及到如此底层的步骤，实现起来也比较麻烦。接下来，本文将介绍ASM的两种API，并用ASM来实现一个比较粗糙的AOP。但在此之前，为了让大家更快地理解ASM的处理流程，强烈建议读者先对访问者模式进行了解。简单来说，访问者模式主要用于修改或操作一些数据结构比较稳定的数据，而通过第一章，我们知道字节码文件的结构是由JVM固定的，所以很适合利用访问者模式对字节码文件进行修改。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><h4 id="asm-api" tabindex="-1">ASM API <a class="header-anchor" href="#asm-api" aria-label="Permalink to &quot;ASM API&quot;">​</a></h4><h5 id="核心api" tabindex="-1">核心API <a class="header-anchor" href="#核心api" aria-label="Permalink to &quot;核心API&quot;">​</a></h5><p>ASM Core API可以类比解析XML文件中的SAX方式，不需要把这个类的整个结构读取进来，就可以用流式的方法来处理字节码文件。好处是非常节约内存，但是编程难度较大。然而出于性能考虑，一般情况下编程都使用Core API。在Core API中有以下几个关键类：</p><ul><li>ClassReader：用于读取已经编译好的.class文件。</li><li>ClassWriter：用于重新构建编译后的类，如修改类名、属性以及方法，也可以生成新的类的字节码文件。</li><li>各种Visitor类：如上所述，CoreAPI根据字节码从上到下依次处理，对于字节码文件中不同的区域有不同的Visitor，比如用于访问方法的MethodVisitor、用于访问类变量的FieldVisitor、用于访问注解的AnnotationVisitor等。为了实现AOP，重点要使用的是MethodVisitor。</li></ul><h5 id="树形api" tabindex="-1">树形API <a class="header-anchor" href="#树形api" aria-label="Permalink to &quot;树形API&quot;">​</a></h5><p>ASM Tree API可以类比解析XML文件中的DOM方式，把整个类的结构读取到内存中，缺点是消耗内存多，但是编程比较简单。TreeApi不同于CoreAPI，TreeAPI通过各种Node类来映射字节码的各个区域，类比DOM节点，就可以很好地理解这种编程方式。</p><h4 id="直接利用asm实现aop" tabindex="-1">直接利用ASM实现AOP <a class="header-anchor" href="#直接利用asm实现aop" aria-label="Permalink to &quot;直接利用ASM实现AOP&quot;">​</a></h4><p>利用ASM的CoreAPI来增强类。这里不纠结于AOP的专业名词如切片、通知，只实现在方法调用前、后增加逻辑，通俗易懂且方便理解。首先定义需要被增强的Base类：其中只包含一个process()方法，方法内输出一行“process”。增强后，我们期望的是，方法执行前输出“start”，之后输出”end”。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Base {</span></span>
<span class="line"><span>    public void process(){</span></span>
<span class="line"><span>        System.out.println(&quot;process&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了利用ASM实现AOP，需要定义两个类：一个是MyClassVisitor类，用于对字节码的visit以及修改；另一个是Generator类，在这个类中定义ClassReader和ClassWriter，其中的逻辑是，classReader读取字节码，然后交给MyClassVisitor类处理，处理完成后由ClassWriter写字节码并将旧的字节码替换掉。Generator类较简单，我们先看一下它的实现，如下所示，然后重点解释MyClassVisitor类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.objectweb.asm.ClassReader;</span></span>
<span class="line"><span>import org.objectweb.asm.ClassVisitor;</span></span>
<span class="line"><span>import org.objectweb.asm.ClassWriter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Generator {</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>		//读取</span></span>
<span class="line"><span>        ClassReader classReader = new ClassReader(&quot;meituan/bytecode/asm/Base&quot;);</span></span>
<span class="line"><span>        ClassWriter classWriter = new ClassWriter(ClassWriter.COMPUTE_MAXS);</span></span>
<span class="line"><span>        //处理</span></span>
<span class="line"><span>        ClassVisitor classVisitor = new MyClassVisitor(classWriter);</span></span>
<span class="line"><span>        classReader.accept(classVisitor, ClassReader.SKIP_DEBUG);</span></span>
<span class="line"><span>        byte[] data = classWriter.toByteArray();</span></span>
<span class="line"><span>        //输出</span></span>
<span class="line"><span>        File f = new File(&quot;operation-server/target/classes/meituan/bytecode/asm/Base.class&quot;);</span></span>
<span class="line"><span>        FileOutputStream fout = new FileOutputStream(f);</span></span>
<span class="line"><span>        fout.write(data);</span></span>
<span class="line"><span>        fout.close();</span></span>
<span class="line"><span>        System.out.println(&quot;now generator cc success!!!!!&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>MyClassVisitor继承自ClassVisitor，用于对字节码的观察。它还包含一个内部类MyMethodVisitor，继承自MethodVisitor用于对类内方法的观察，它的整体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.objectweb.asm.ClassVisitor;</span></span>
<span class="line"><span>import org.objectweb.asm.MethodVisitor;</span></span>
<span class="line"><span>import org.objectweb.asm.Opcodes;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyClassVisitor extends ClassVisitor implements Opcodes {</span></span>
<span class="line"><span>    public MyClassVisitor(ClassVisitor cv) {</span></span>
<span class="line"><span>        super(ASM5, cv);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void visit(int version, int access, String name, String signature,</span></span>
<span class="line"><span>                      String superName, String[] interfaces) {</span></span>
<span class="line"><span>        cv.visit(version, access, name, signature, superName, interfaces);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {</span></span>
<span class="line"><span>        MethodVisitor mv = cv.visitMethod(access, name, desc, signature,</span></span>
<span class="line"><span>                exceptions);</span></span>
<span class="line"><span>        //Base类中有两个方法：无参构造以及process方法，这里不增强构造方法</span></span>
<span class="line"><span>        if (!name.equals(&quot;&lt;init&gt;&quot;) &amp;&amp; mv != null) {</span></span>
<span class="line"><span>            mv = new MyMethodVisitor(mv);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return mv;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    class MyMethodVisitor extends MethodVisitor implements Opcodes {</span></span>
<span class="line"><span>        public MyMethodVisitor(MethodVisitor mv) {</span></span>
<span class="line"><span>            super(Opcodes.ASM5, mv);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void visitCode() {</span></span>
<span class="line"><span>            super.visitCode();</span></span>
<span class="line"><span>            mv.visitFieldInsn(GETSTATIC, &quot;java/lang/System&quot;, &quot;out&quot;, &quot;Ljava/io/PrintStream;&quot;);</span></span>
<span class="line"><span>            mv.visitLdcInsn(&quot;start&quot;);</span></span>
<span class="line"><span>            mv.visitMethodInsn(INVOKEVIRTUAL, &quot;java/io/PrintStream&quot;, &quot;println&quot;, &quot;(Ljava/lang/String;)V&quot;, false);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void visitInsn(int opcode) {</span></span>
<span class="line"><span>            if ((opcode &gt;= Opcodes.IRETURN &amp;&amp; opcode &lt;= Opcodes.RETURN)</span></span>
<span class="line"><span>                    || opcode == Opcodes.ATHROW) {</span></span>
<span class="line"><span>                //方法在返回之前，打印&quot;end&quot;</span></span>
<span class="line"><span>                mv.visitFieldInsn(GETSTATIC, &quot;java/lang/System&quot;, &quot;out&quot;, &quot;Ljava/io/PrintStream;&quot;);</span></span>
<span class="line"><span>                mv.visitLdcInsn(&quot;end&quot;);</span></span>
<span class="line"><span>                mv.visitMethodInsn(INVOKEVIRTUAL, &quot;java/io/PrintStream&quot;, &quot;println&quot;, &quot;(Ljava/lang/String;)V&quot;, false);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            mv.visitInsn(opcode);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>利用这个类就可以实现对字节码的修改。详细解读其中的代码，对字节码做修改的步骤是：</p><ul><li>首先通过MyClassVisitor类中的visitMethod方法，判断当前字节码读到哪一个方法了。跳过构造方法 <code>&lt;init&gt;</code> 后，将需要被增强的方法交给内部类MyMethodVisitor来进行处理。</li><li>接下来，进入内部类MyMethodVisitor中的visitCode方法，它会在ASM开始访问某一个方法的Code区时被调用，重写visitCode方法，将AOP中的前置逻辑就放在这里。 MyMethodVisitor继续读取字节码指令，每当ASM访问到无参数指令时，都会调用MyMethodVisitor中的visitInsn方法。我们判断了当前指令是否为无参数的“return”指令，如果是就在它的前面添加一些指令，也就是将AOP的后置逻辑放在该方法中。</li><li>综上，重写MyMethodVisitor中的两个方法，就可以实现AOP了，而重写方法时就需要用ASM的写法，手动写入或者修改字节码。通过调用methodVisitor的visitXXXXInsn()方法就可以实现字节码的插入，XXXX对应相应的操作码助记符类型，比如mv.visitLdcInsn(“end”)对应的操作码就是ldc “end”，即将字符串“end”压入栈。 完成这两个visitor类后，运行Generator中的main方法完成对Base类的字节码增强，增强后的结果可以在编译后的target文件夹中找到Base.class文件进行查看，可以看到反编译后的代码已经改变了。然后写一个测试类MyTest，在其中new Base()，并调用base.process()方法，可以看到下图右侧所示的AOP实现效果：</li></ul><p><img src="`+l+'" alt="error.图片加载失败"></p><h4 id="asm工具" tabindex="-1">ASM工具 <a class="header-anchor" href="#asm工具" aria-label="Permalink to &quot;ASM工具&quot;">​</a></h4><p>利用ASM手写字节码时，需要利用一系列visitXXXXInsn()方法来写对应的助记符，所以需要先将每一行源代码转化为一个个的助记符，然后通过ASM的语法转换为visitXXXXInsn()这种写法。第一步将源码转化为助记符就已经够麻烦了，不熟悉字节码操作集合的话，需要我们将代码编译后再反编译，才能得到源代码对应的助记符。第二步利用ASM写字节码时，如何传参也很令人头疼。ASM社区也知道这两个问题，所以提供了工具<a href="https://plugins.jetbrains.com/plugin/5918-asm-bytecode-outline" target="_blank" rel="noreferrer">ASM ByteCode Outline在新窗口打开</a>。</p><p>安装后，右键选择“Show Bytecode Outline”，在新标签页中选择“ASMified”这个tab，如图19所示，就可以看到这个类中的代码对应的ASM写法了。图中上下两个红框分别对应AOP中的前置逻辑于后置逻辑，将这两块直接复制到visitor中的visitMethod()以及visitInsn()方法中，就可以了。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h3 id="javassist" tabindex="-1">Javassist <a class="header-anchor" href="#javassist" aria-label="Permalink to &quot;Javassist&quot;">​</a></h3><p>ASM是在指令层次上操作字节码的，阅读上文后，我们的直观感受是在指令层次上操作字节码的框架实现起来比较晦涩。故除此之外，我们再简单介绍另外一类框架：强调源代码层次操作字节码的框架Javassist。</p><p>利用Javassist实现字节码增强时，可以无须关注字节码刻板的结构，其优点就在于编程简单。直接使用java编码的形式，而不需要了解虚拟机指令，就能动态改变类的结构或者动态生成类。其中最重要的是ClassPool、CtClass、CtMethod、CtField这四个类：</p><ul><li>CtClass（compile-time class）：编译时类信息，它是一个class文件在代码中的抽象表现形式，可以通过一个类的全限定名来获取一个CtClass对象，用来表示这个类文件。</li><li>ClassPool：从开发视角来看，ClassPool是一张保存CtClass信息的HashTable，key为类名，value为类名对应的CtClass对象。当我们需要对某个类进行修改时，就是通过pool.getCtClass(“className”)方法从pool中获取到相应的CtClass。</li><li>CtMethod、CtField：这两个比较好理解，对应的是类中的方法和属性。</li></ul><p>了解这四个类后，我们可以写一个小Demo来展示Javassist简单、快速的特点。我们依然是对Base中的process()方法做增强，在方法调用前后分别输出”start”和”end”，实现代码如下。我们需要做的就是从pool中获取到相应的CtClass对象和其中的方法，然后执行method.insertBefore和insertAfter方法，参数为要插入的Java代码，再以字符串的形式传入即可，实现起来也极为简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import com.meituan.mtrace.agent.javassist.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JavassistTest {</span></span>
<span class="line"><span>    public static void main(String[] args) throws NotFoundException, CannotCompileException, IllegalAccessException, InstantiationException, IOException {</span></span>
<span class="line"><span>        ClassPool cp = ClassPool.getDefault();</span></span>
<span class="line"><span>        CtClass cc = cp.get(&quot;meituan.bytecode.javassist.Base&quot;);</span></span>
<span class="line"><span>        CtMethod m = cc.getDeclaredMethod(&quot;process&quot;);</span></span>
<span class="line"><span>        m.insertBefore(&quot;{ System.out.println(\\&quot;start\\&quot;); }&quot;);</span></span>
<span class="line"><span>        m.insertAfter(&quot;{ System.out.println(\\&quot;end\\&quot;); }&quot;);</span></span>
<span class="line"><span>        Class c = cc.toClass();</span></span>
<span class="line"><span>        cc.writeFile(&quot;/Users/zen/projects&quot;);</span></span>
<span class="line"><span>        Base h = (Base)c.newInstance();</span></span>
<span class="line"><span>        h.process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="运行时类的重载" tabindex="-1">运行时类的重载 <a class="header-anchor" href="#运行时类的重载" aria-label="Permalink to &quot;运行时类的重载&quot;">​</a></h2><h3 id="问题引出" tabindex="-1">问题引出 <a class="header-anchor" href="#问题引出" aria-label="Permalink to &quot;问题引出&quot;">​</a></h3><p>上一章重点介绍了两种不同类型的字节码操作框架，且都利用它们实现了较为粗糙的AOP。其实，为了方便大家理解字节码增强技术，在上文中我们避重就轻将ASM实现AOP的过程分为了两个main方法：第一个是利用MyClassVisitor对已编译好的class文件进行修改，第二个是new对象并调用。这期间并不涉及到JVM运行时对类的重加载，而是在第一个main方法中，通过ASM对已编译类的字节码进行替换，在第二个main方法中，直接使用已替换好的新类信息。另外在Javassist的实现中，我们也只加载了一次Base类，也不涉及到运行时重加载类。</p><p>如果我们在一个JVM中，先加载了一个类，然后又对其进行字节码增强并重新加载会发生什么呢？模拟这种情况，只需要我们在上文中Javassist的Demo中main()方法的第一行添加Base b=new Base()，即在增强前就先让JVM加载Base类，然后在执行到c.toClass()方法时会抛出错误，如下图20所示。跟进c.toClass()方法中，我们会发现它是在最后调用了ClassLoader的native方法defineClass()时报错。也就是说，JVM是不允许在运行时动态重载一个类的。</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>显然，如果只能在类加载前对类进行强化，那字节码增强技术的使用场景就变得很窄了。我们期望的效果是：在一个持续运行并已经加载了所有类的JVM中，还能利用字节码增强技术对其中的类行为做替换并重新加载。为了模拟这种情况，我们将Base类做改写，在其中编写main方法，每五秒调用一次process()方法，在process()方法中输出一行“process”。</p><p>我们的目的就是，在JVM运行中的时候，将process()方法做替换，在其前后分别打印“start”和“end”。也就是在运行中时，每五秒打印的内容由”process”变为打印”start process end”。那如何解决JVM不允许运行时重加载类信息的问题呢？为了达到这个目的，我们接下来一一来介绍需要借助的Java类库。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.management.ManagementFactory;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Base {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        String name = ManagementFactory.getRuntimeMXBean().getName();</span></span>
<span class="line"><span>        String s = name.split(&quot;@&quot;)[0];</span></span>
<span class="line"><span>        //打印当前Pid</span></span>
<span class="line"><span>        System.out.println(&quot;pid:&quot;+s);</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(5000L);</span></span>
<span class="line"><span>            } catch (Exception e) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            process();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void process() {</span></span>
<span class="line"><span>        System.out.println(&quot;process&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="instrument" tabindex="-1">Instrument <a class="header-anchor" href="#instrument" aria-label="Permalink to &quot;Instrument&quot;">​</a></h3><p>instrument是JVM提供的一个可以修改已加载类的类库，专门为Java语言编写的插桩服务提供支持。它需要依赖JVMTI的Attach API机制实现，JVMTI这一部分，我们将在下一小节进行介绍。在JDK 1.6以前，instrument只能在JVM刚启动开始加载类时生效，而在JDK 1.6之后，instrument支持了在运行时对类定义的修改。要使用instrument的类修改功能，我们需要实现它提供的ClassFileTransformer接口，定义一个类文件转换器。接口中的transform()方法会在类文件被加载时调用，而在transform方法里，我们可以利用上文中的ASM或Javassist对传入的字节码进行改写或替换，生成新的字节码数组后返回。</p><p>我们定义一个实现了ClassFileTransformer接口的类TestTransformer，依然在其中利用Javassist对Base类中的process()方法进行增强，在前后分别打印“start”和“end”，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.instrument.ClassFileTransformer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TestTransformer implements ClassFileTransformer {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined, ProtectionDomain protectionDomain, byte[] classfileBuffer) {</span></span>
<span class="line"><span>        System.out.println(&quot;Transforming &quot; + className);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            ClassPool cp = ClassPool.getDefault();</span></span>
<span class="line"><span>            CtClass cc = cp.get(&quot;meituan.bytecode.jvmti.Base&quot;);</span></span>
<span class="line"><span>            CtMethod m = cc.getDeclaredMethod(&quot;process&quot;);</span></span>
<span class="line"><span>            m.insertBefore(&quot;{ System.out.println(\\&quot;start\\&quot;); }&quot;);</span></span>
<span class="line"><span>            m.insertAfter(&quot;{ System.out.println(\\&quot;end\\&quot;); }&quot;);</span></span>
<span class="line"><span>            return cc.toBytecode();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在有了Transformer，那么它要如何注入到正在运行的JVM呢？还需要定义一个Agent，借助Agent的能力将Instrument注入到JVM中。我们将在下一小节介绍Agent，现在要介绍的是Agent中用到的另一个类Instrumentation。在JDK 1.6之后，Instrumentation可以做启动后的Instrument、本地代码（Native Code）的Instrument，以及动态改变Classpath等等。我们可以向Instrumentation中添加上文中定义的Transformer，并指定要被重加载的类，代码如下所示。这样，当Agent被Attach到一个JVM中时，就会执行类字节码替换并重载入JVM的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.instrument.Instrumentation;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TestAgent {</span></span>
<span class="line"><span>    public static void agentmain(String args, Instrumentation inst) {</span></span>
<span class="line"><span>        //指定我们自己定义的Transformer，在其中利用Javassist做字节码替换</span></span>
<span class="line"><span>        inst.addTransformer(new TestTransformer(), true);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //重定义类并载入新的字节码</span></span>
<span class="line"><span>            inst.retransformClasses(Base.class);</span></span>
<span class="line"><span>            System.out.println(&quot;Agent Load Done.&quot;);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(&quot;agent load failed!&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="jvmti-agent-attach-api" tabindex="-1">JVMTI &amp; Agent &amp; Attach API <a class="header-anchor" href="#jvmti-agent-attach-api" aria-label="Permalink to &quot;JVMTI &amp; Agent &amp; Attach API&quot;">​</a></h3><p>上一小节中，我们给出了Agent类的代码，追根溯源需要先介绍JPDA（Java Platform Debugger Architecture）。如果JVM启动时开启了JPDA，那么类是允许被重新加载的。在这种情况下，已被加载的旧版本类信息可以被卸载，然后重新加载新版本的类。正如JDPA名称中的Debugger，JDPA其实是一套用于调试Java程序的标准，任何JDK都必须实现该标准。</p><p>JPDA定义了一整套完整的体系，它将调试体系分为三部分，并规定了三者之间的通信接口。三部分由低到高分别是Java 虚拟机工具接口（JVMTI），Java 调试协议（JDWP）以及 Java 调试接口（JDI），三者之间的关系如下图所示：</p><p><img src="`+c+'" alt="error.图片加载失败"></p><p>现在回到正题，我们可以借助JVMTI的一部分能力，帮助动态重载类信息。JVM TI（JVM TOOL INTERFACE，JVM工具接口）是JVM提供的一套对JVM进行操作的工具接口。通过JVMTI，可以实现对JVM的多种操作，它通过接口注册各种事件勾子，在JVM事件触发时，同时触发预定义的勾子，以实现对各个JVM事件的响应，事件包括类文件加载、异常产生与捕获、线程启动和结束、进入和退出临界区、成员变量修改、GC开始和结束、方法调用进入和退出、临界区竞争与等待、VM启动与退出等等。</p><p>而Agent就是JVMTI的一种实现，Agent有两种启动方式，一是随Java进程启动而启动，经常见到的java -agentlib就是这种方式；二是运行时载入，通过attach API，将模块（jar包）动态地Attach到指定进程id的Java进程内。</p><p>Attach API 的作用是提供JVM进程间通信的能力，比如说我们为了让另外一个JVM进程把线上服务的线程Dump出来，会运行jstack或jmap的进程，并传递pid的参数，告诉它要对哪个进程进行线程Dump，这就是Attach API做的事情。在下面，我们将通过Attach API的loadAgent()方法，将打包好的Agent jar包动态Attach到目标JVM上。具体实现起来的步骤如下：</p><ul><li>定义Agent，并在其中实现AgentMain方法，如上一小节中定义的代码块7中的TestAgent类；</li><li>然后将TestAgent类打成一个包含MANIFEST.MF的jar包，其中MANIFEST.MF文件中将Agent-Class属性指定为TestAgent的全限定名，如下图所示；</li></ul><p><img src="'+u+`" alt="error.图片加载失败"></p><ul><li>最后利用Attach API，将我们打包好的jar包Attach到指定的JVM pid上，代码如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import com.sun.tools.attach.VirtualMachine;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Attacher {</span></span>
<span class="line"><span>    public static void main(String[] args) throws AttachNotSupportedException, IOException, AgentLoadException, AgentInitializationException {</span></span>
<span class="line"><span>        // 传入目标 JVM pid</span></span>
<span class="line"><span>        VirtualMachine vm = VirtualMachine.attach(&quot;39333&quot;);</span></span>
<span class="line"><span>        vm.loadAgent(&quot;/Users/zen/operation_server_jar/operation-server.jar&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>由于在MANIFEST.MF中指定了Agent-Class，所以在Attach后，目标JVM在运行时会走到TestAgent类中定义的agentmain()方法，而在这个方法中，我们利用Instrumentation，将指定类的字节码通过定义的类转化器TestTransformer做了Base类的字节码替换（通过javassist），并完成了类的重新加载。由此，我们达成了“在JVM运行时，改变类的字节码并重新载入类信息”的目的。</li></ul><p>以下为运行时重新载入类的效果：先运行Base中的main()方法，启动一个JVM，可以在控制台看到每隔五秒输出一次”process”。接着执行Attacher中的main()方法，并将上一个JVM的pid传入。此时回到上一个main()方法的控制台，可以看到现在每隔五秒输出”process”前后会分别输出”start”和”end”，也就是说完成了运行时的字节码增强，并重新载入了这个类。</p><p><img src="`+d+'" alt="error.图片加载失败"></p><h3 id="使用场景" tabindex="-1">使用场景 <a class="header-anchor" href="#使用场景" aria-label="Permalink to &quot;使用场景&quot;">​</a></h3><p>至此，字节码增强技术的可使用范围就不再局限于JVM加载类前了。通过上述几个类库，我们可以在运行时对JVM中的类进行修改并重载了。通过这种手段，可以做的事情就变得很多了：</p><ul><li>热部署：不部署服务而对线上服务做修改，可以做打点、增加日志等操作。</li><li>Mock：测试时候对某些服务做Mock。</li><li>性能诊断工具：比如bTrace就是利用Instrument，实现无侵入地跟踪一个正在运行的JVM，监控到类和方法级别的状态信息。</li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>字节码增强技术相当于是一把打开运行时JVM的钥匙，利用它可以动态地对运行中的程序做修改，也可以跟踪JVM运行中程序的状态。此外，我们平时使用的动态代理、AOP也与字节码增强密切相关，它们实质上还是利用各种手段生成符合规范的字节码文件。综上所述，掌握字节码增强后可以高效地定位并快速修复一些棘手的问题（如线上性能问题、方法出现不可控的出入参需要紧急加日志等问题），也可以在开发中减少冗余代码，大大提高开发效率。</p><h2 id="参考文献" tabindex="-1">参考文献 <a class="header-anchor" href="#参考文献" aria-label="Permalink to &quot;参考文献&quot;">​</a></h2><ul><li>《ASM4-Guide》</li><li>Oracle:The class File Format</li><li>Oracle:The Java Virtual Machine Instruction Set</li><li>javassist tutorial</li><li>JVM Tool Interface - Version 1.2</li></ul><h2 id="作者简介" tabindex="-1">作者简介 <a class="header-anchor" href="#作者简介" aria-label="Permalink to &quot;作者简介&quot;">​</a></h2><p>泽恩，美团点评研发工程师。</p><p>文章来源：</p><ul><li>美团技术团队</li><li><a href="https://tech.meituan.com/2019/09/05/java-bytecode-enhancement.html" target="_blank" rel="noreferrer">https://tech.meituan.com/2019/09/05/java-bytecode-enhancement.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',74)]))}const V=a(m,[["render",h]]);export{C as __pageData,V as default};
