import{_ as n}from"./chunks/java_jvm_classload_2.DG-F-PhB.js";import{_ as a}from"./chunks/java-basic-reflection-3.B5R8nDmN.js";import{_ as p,c as e,ai as l,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/java/java-basic-reflection-1.png",C=JSON.parse('{"title":"Java 基础 - 反射机制详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/basic/java-basic-x-reflection.md","filePath":"java/basic/java-basic-x-reflection.md","lastUpdated":1737706346000}'),c={name:"java/basic/java-basic-x-reflection.md"};function o(r,s,d,u,g,m){return t(),e("div",null,s[0]||(s[0]=[l(`<h1 id="java-基础-反射机制详解" tabindex="-1">Java 基础 - 反射机制详解 <a class="header-anchor" href="#java-基础-反射机制详解" aria-label="Permalink to &quot;Java 基础 - 反射机制详解&quot;">​</a></h1><blockquote><p>JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。Java反射机制在框架设计中极为广泛，需要深入理解。本文综合多篇文章后，总结了Java 反射的相关知识，希望可以提升你对Java中反射的认知效率。@pdai</p></blockquote><h2 id="反射基础" tabindex="-1">反射基础 <a class="header-anchor" href="#反射基础" aria-label="Permalink to &quot;反射基础&quot;">​</a></h2><p>RTTI（Run-Time Type Identification）运行时类型识别。在《Thinking in Java》一书第十四章中有提到，其作用是在运行时识别一个对象的类型和类的信息。主要有两种方式：一种是“传统的”RTTI，它假定我们在编译时已经知道了所有的类型；另一种是“反射”机制，它允许我们在运行时发现和使用类的信息。</p><p>反射就是把java类中的各种成分映射成一个个的Java对象</p><p>例如：一个类有：成员变量、方法、构造方法、包等等信息，利用反射技术可以对一个类进行解剖，把个个组成部分映射成一个个对象。</p><blockquote><p>这里我们首先需要理解 Class类，以及类的加载机制； 然后基于此我们如何通过反射获取Class类以及类中的成员变量、方法、构造方法等。</p></blockquote><h3 id="class类" tabindex="-1">Class类 <a class="header-anchor" href="#class类" aria-label="Permalink to &quot;Class类&quot;">​</a></h3><p>Class类，Class类也是一个实实在在的类，存在于JDK的java.lang包中。Class类的实例表示java应用运行时的类(class ans enum)或接口(interface and annotation)（每个java类运行时都在JVM里表现为一个class对象，可通过类名.class、类型.getClass()、Class.forName(&quot;类名&quot;)等方法获取class对象）。数组同样也被映射为class 对象的一个类，所有具有相同元素类型和维数的数组都共享该 Class 对象。基本类型boolean，byte，char，short，int，long，float，double和关键字void同样表现为 class 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Class&lt;T&gt; implements java.io.Serializable,</span></span>
<span class="line"><span>                              GenericDeclaration,</span></span>
<span class="line"><span>                              Type,</span></span>
<span class="line"><span>                              AnnotatedElement {</span></span>
<span class="line"><span>    private static final int ANNOTATION= 0x00002000;</span></span>
<span class="line"><span>    private static final int ENUM      = 0x00004000;</span></span>
<span class="line"><span>    private static final int SYNTHETIC = 0x00001000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static native void registerNatives();</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        registerNatives();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Private constructor. Only the Java Virtual Machine creates Class objects.   //私有构造器，只有JVM才能调用创建Class对象</span></span>
<span class="line"><span>     * This constructor is not used and prevents the default constructor being</span></span>
<span class="line"><span>     * generated.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Class(ClassLoader loader) {</span></span>
<span class="line"><span>        // Initialize final field for classLoader.  The initialization value of non-null</span></span>
<span class="line"><span>        // prevents future JIT optimizations from assuming this final field is null.</span></span>
<span class="line"><span>        classLoader = loader;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>到这我们也就可以得出以下几点信息：</p><ul><li><p>Class类也是类的一种，与class关键字是不一样的。</p></li><li><p>手动编写的类被编译后会产生一个Class对象，其表示的是创建的类的类型信息，而且这个Class对象保存在同名.class的文件中(字节码文件)</p></li><li><p>每个通过关键字class标识的类，在内存中有且只有一个与之对应的Class对象来描述其类型信息，无论创建多少个实例对象，其依据的都是用一个Class对象。</p></li><li><p>Class类只存私有构造函数，因此对应Class对象只能有JVM创建和加载</p></li><li><p>Class类的对象作用是运行时提供或获得某个对象的类型信息，这点对于反射技术很重要(关于反射稍后分析)。</p></li></ul><h3 id="类加载" tabindex="-1">类加载 <a class="header-anchor" href="#类加载" aria-label="Permalink to &quot;类加载&quot;">​</a></h3><p>类加载机制和类字节码技术可以参考如下两篇文章：</p><ul><li><a href="https://pdai.tech/md/java/jvm/java-jvm-class.html" target="_blank" rel="noreferrer">JVM基础 - 类字节码详解</a><ul><li>源代码通过编译器编译为字节码，再通过类加载子系统进行加载到JVM中运行</li></ul></li><li><a href="https://pdai.tech/md/java/jvm/java-jvm-classload.html" target="_blank" rel="noreferrer">JVM基础 - Java 类加载机制</a><ul><li>这篇文章将带你深入理解Java 类加载机制</li></ul></li></ul><p>其中，这里我们需要回顾的是：</p><ol><li>类加载机制流程</li></ol><p><img src="`+n+'" alt="error.图片加载失败"></p><ol start="2"><li>类的加载</li></ol><p><img src="'+a+`" alt="error.图片加载失败"></p><h2 id="反射的使用" tabindex="-1">反射的使用 <a class="header-anchor" href="#反射的使用" aria-label="Permalink to &quot;反射的使用&quot;">​</a></h2><p>提示</p><p>基于此我们如何通过反射获取Class类对象以及类中的成员变量、方法、构造方法等</p><p>在Java中，Class类与java.lang.reflect类库一起对反射技术进行了全力的支持。在反射包中，我们常用的类主要有Constructor类表示的是Class 对象所表示的类的构造方法，利用它可以在运行时动态创建对象、Field表示Class对象所表示的类的成员变量，通过它可以在运行时动态修改成员变量的属性值(包含private)、Method表示Class对象所表示的类的成员方法，通过它可以动态调用对象的方法(包含private)，下面将对这几个重要类进行分别说明。</p><h3 id="class类对象的获取" tabindex="-1">Class类对象的获取 <a class="header-anchor" href="#class类对象的获取" aria-label="Permalink to &quot;Class类对象的获取&quot;">​</a></h3><p>在类加载的时候，jvm会创建一个class对象</p><p>class对象是可以说是反射中最常用的，获取class对象的方式的主要有三种</p><ul><li>根据类名：类名.class</li><li>根据对象：对象.getClass()</li><li>根据全限定类名：Class.forName(全限定类名)</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void classTest() throws Exception {</span></span>
<span class="line"><span>        // 获取Class对象的三种方式</span></span>
<span class="line"><span>        logger.info(&quot;根据类名:  \\t&quot; + User.class);</span></span>
<span class="line"><span>        logger.info(&quot;根据对象:  \\t&quot; + new User().getClass());</span></span>
<span class="line"><span>        logger.info(&quot;根据全限定类名:\\t&quot; + Class.forName(&quot;com.test.User&quot;));</span></span>
<span class="line"><span>        // 常用的方法</span></span>
<span class="line"><span>        logger.info(&quot;获取全限定类名:\\t&quot; + userClass.getName());</span></span>
<span class="line"><span>        logger.info(&quot;获取类名:\\t&quot; + userClass.getSimpleName());</span></span>
<span class="line"><span>        logger.info(&quot;实例化:\\t&quot; + userClass.newInstance());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    package com.test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public class User {</span></span>
<span class="line"><span>        private String name = &quot;init&quot;;</span></span>
<span class="line"><span>        private int age;</span></span>
<span class="line"><span>        public User() {}</span></span>
<span class="line"><span>        public User(String name, int age) {</span></span>
<span class="line"><span>            super();</span></span>
<span class="line"><span>            this.name = name;</span></span>
<span class="line"><span>            this.age = age;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        private String getName() {</span></span>
<span class="line"><span>            return name;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        private void setName(String name) {</span></span>
<span class="line"><span>            this.name = name;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        public int getAge() {</span></span>
<span class="line"><span>            return age;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        public void setAge(int age) {</span></span>
<span class="line"><span>            this.age = age;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public String toString() {</span></span>
<span class="line"><span>            return &quot;User [name=&quot; + name + &quot;, age=&quot; + age + &quot;]&quot;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>根据类名:  	class com.test.User</span></span>
<span class="line"><span>根据对象:  	class com.test.User</span></span>
<span class="line"><span>根据全限定类名:	class com.test.User</span></span>
<span class="line"><span>获取全限定类名:	com.test.User</span></span>
<span class="line"><span>获取类名:	User</span></span>
<span class="line"><span>实例化:	User [name=init, age=0]</span></span></code></pre></div><ul><li>再来看看 <strong>Class类的方法</strong></li></ul><table tabindex="0"><thead><tr><th>方法名</th><th>说明</th></tr></thead><tbody><tr><td>forName()</td><td>(1)获取Class对象的一个引用，但引用的类还没有加载(该类的第一个对象没有生成)就加载了这个类。</td></tr><tr><td>(2)为了产生Class引用，forName()立即就进行了初始化。</td><td></td></tr><tr><td>Object-getClass()</td><td>获取Class对象的一个引用，返回表示该对象的实际类型的Class引用。</td></tr><tr><td>getName()</td><td>取全限定的类名(包括包名)，即类的完整名字。</td></tr><tr><td>getSimpleName()</td><td>获取类名(不包括包名)</td></tr><tr><td>getCanonicalName()</td><td>获取全限定的类名(包括包名)</td></tr><tr><td>isInterface()</td><td>判断Class对象是否是表示一个接口</td></tr><tr><td>getInterfaces()</td><td>返回Class对象数组，表示Class对象所引用的类所实现的所有接口。</td></tr><tr><td>getSupercalss()</td><td>返回Class对象，表示Class对象所引用的类所继承的直接基类。应用该方法可在运行时发现一个对象完整的继承结构。</td></tr><tr><td>newInstance()</td><td>返回一个Oject对象，是实现“虚拟构造器”的一种途径。使用该方法创建的类，必须带有无参的构造器。</td></tr><tr><td>getFields()</td><td>获得某个类的所有的公共（public）的字段，包括继承自父类的所有公共字段。 类似的还有getMethods和getConstructors。</td></tr><tr><td>getDeclaredFields</td><td>获得某个类的自己声明的字段，即包括public、private和proteced，默认但是不包括父类声明的任何字段。类似的还有getDeclaredMethods和getDeclaredConstructors。</td></tr></tbody></table><p>简单测试下（这里例子源于<a href="https://blog.csdn.net/mcryeasy/article/details/52344729%EF%BC%89" target="_blank" rel="noreferrer">https://blog.csdn.net/mcryeasy/article/details/52344729）</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.cry;</span></span>
<span class="line"><span>import java.lang.reflect.Field;</span></span>
<span class="line"><span>interface I1 {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>interface I2 {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Cell{</span></span>
<span class="line"><span>    public int mCellPublic;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Animal extends  Cell{</span></span>
<span class="line"><span>    private int mAnimalPrivate;</span></span>
<span class="line"><span>    protected int mAnimalProtected;</span></span>
<span class="line"><span>    int mAnimalDefault;</span></span>
<span class="line"><span>    public int mAnimalPublic;</span></span>
<span class="line"><span>    private static int sAnimalPrivate;</span></span>
<span class="line"><span>    protected static int sAnimalProtected;</span></span>
<span class="line"><span>    static int sAnimalDefault;</span></span>
<span class="line"><span>    public static int sAnimalPublic;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Dog extends Animal implements I1, I2 {</span></span>
<span class="line"><span>    private int mDogPrivate;</span></span>
<span class="line"><span>    public int mDogPublic;</span></span>
<span class="line"><span>    protected int mDogProtected;</span></span>
<span class="line"><span>    private int mDogDefault;</span></span>
<span class="line"><span>    private static int sDogPrivate;</span></span>
<span class="line"><span>    protected static int sDogProtected;</span></span>
<span class="line"><span>    static int sDogDefault;</span></span>
<span class="line"><span>    public static int sDogPublic;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>    public static void main(String[] args) throws IllegalAccessException, InstantiationException {</span></span>
<span class="line"><span>        Class&lt;Dog&gt; dog = Dog.class;</span></span>
<span class="line"><span>        //类名打印</span></span>
<span class="line"><span>        System.out.println(dog.getName()); //com.cry.Dog</span></span>
<span class="line"><span>        System.out.println(dog.getSimpleName()); //Dog</span></span>
<span class="line"><span>        System.out.println(dog.getCanonicalName());//com.cry.Dog</span></span>
<span class="line"><span>        //接口</span></span>
<span class="line"><span>        System.out.println(dog.isInterface()); //false</span></span>
<span class="line"><span>        for (Class iI : dog.getInterfaces()) {</span></span>
<span class="line"><span>            System.out.println(iI);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>         /*</span></span>
<span class="line"><span>          interface com.cry.I1</span></span>
<span class="line"><span>          interface com.cry.I2</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //父类</span></span>
<span class="line"><span>        System.out.println(dog.getSuperclass());//class com.cry.Animal</span></span>
<span class="line"><span>        //创建对象</span></span>
<span class="line"><span>        Dog d = dog.newInstance();</span></span>
<span class="line"><span>        //字段</span></span>
<span class="line"><span>        for (Field f : dog.getFields()) {</span></span>
<span class="line"><span>            System.out.println(f.getName());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            mDogPublic</span></span>
<span class="line"><span>            sDogPublic</span></span>
<span class="line"><span>            mAnimalPublic</span></span>
<span class="line"><span>            sAnimalPublic</span></span>
<span class="line"><span>            mCellPublic  //父类的父类的公共字段也打印出来了</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span>        System.out.println(&quot;---------&quot;);</span></span>
<span class="line"><span>        for (Field f : dog.getDeclaredFields()) {</span></span>
<span class="line"><span>            System.out.println(f.getName());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        /** 只有自己类声明的字段</span></span>
<span class="line"><span>         mDogPrivate</span></span>
<span class="line"><span>         mDogPublic</span></span>
<span class="line"><span>         mDogProtected</span></span>
<span class="line"><span>         mDogDefault</span></span>
<span class="line"><span>         sDogPrivate</span></span>
<span class="line"><span>         sDogProtected</span></span>
<span class="line"><span>         sDogDefault</span></span>
<span class="line"><span>         sDogPublic</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>getName、getCanonicalName与getSimpleName的区别</strong>：</p><ul><li>getSimpleName：只获取类名</li><li>getName：类的全限定名，jvm中Class的表示，可以用于动态加载Class对象，例如Class.forName。</li><li>getCanonicalName：返回更容易理解的表示，主要用于输出（toString）或log打印，大多数情况下和getName一样，但是在内部类、数组等类型的表示形式就不同了。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.cry;</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>    private  class inner{</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public static void main(String[] args) throws ClassNotFoundException {</span></span>
<span class="line"><span>        //普通类</span></span>
<span class="line"><span>        System.out.println(Test.class.getSimpleName()); //Test</span></span>
<span class="line"><span>        System.out.println(Test.class.getName()); //com.cry.Test</span></span>
<span class="line"><span>        System.out.println(Test.class.getCanonicalName()); //com.cry.Test</span></span>
<span class="line"><span>        //内部类</span></span>
<span class="line"><span>        System.out.println(inner.class.getSimpleName()); //inner</span></span>
<span class="line"><span>        System.out.println(inner.class.getName()); //com.cry.Test$inner</span></span>
<span class="line"><span>        System.out.println(inner.class.getCanonicalName()); //com.cry.Test.inner</span></span>
<span class="line"><span>        //数组</span></span>
<span class="line"><span>        System.out.println(args.getClass().getSimpleName()); //String[]</span></span>
<span class="line"><span>        System.out.println(args.getClass().getName()); //[Ljava.lang.String;</span></span>
<span class="line"><span>        System.out.println(args.getClass().getCanonicalName()); //java.lang.String[]</span></span>
<span class="line"><span>        //我们不能用getCanonicalName去加载类对象，必须用getName</span></span>
<span class="line"><span>        //Class.forName(inner.class.getCanonicalName()); 报错</span></span>
<span class="line"><span>        Class.forName(inner.class.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="constructor类及其用法" tabindex="-1">Constructor类及其用法 <a class="header-anchor" href="#constructor类及其用法" aria-label="Permalink to &quot;Constructor类及其用法&quot;">​</a></h3><blockquote><p>Constructor类存在于反射包(java.lang.reflect)中，反映的是Class 对象所表示的类的构造方法。</p></blockquote><p>获取Constructor对象是通过Class类中的方法获取的，Class类与Constructor相关的主要方法如下：</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>static Class&lt;?&gt;</td><td>forName(String className)</td><td>返回与带有给定字符串名的类或接口相关联的 Class 对象。</td></tr><tr><td>Constructor</td><td>getConstructor(Class&lt;?&gt;... parameterTypes)</td><td>返回指定参数类型、具有public访问权限的构造函数对象</td></tr><tr><td>Constructor&lt;?&gt;[]</td><td>getConstructors()</td><td>返回所有具有public访问权限的构造函数的Constructor对象数组</td></tr><tr><td>Constructor</td><td>getDeclaredConstructor(Class&lt;?&gt;... parameterTypes)</td><td>返回指定参数类型、所有声明的（包括private）构造函数对象</td></tr><tr><td>Constructor&lt;?&gt;[]</td><td>getDeclaredConstructors()</td><td>返回所有声明的（包括private）构造函数对象</td></tr><tr><td>T</td><td>newInstance()</td><td>调用无参构造器创建此 Class 对象所表示的类的一个新实例。</td></tr></tbody></table><p>下面看一个简单例子来了解Constructor对象的使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConstructionTest implements Serializable {</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Class&lt;?&gt; clazz = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取Class对象的引用</span></span>
<span class="line"><span>        clazz = Class.forName(&quot;com.example.javabase.User&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //第一种方法，实例化默认构造方法，User必须无参构造函数,否则将抛异常</span></span>
<span class="line"><span>        User user = (User) clazz.newInstance();</span></span>
<span class="line"><span>        user.setAge(20);</span></span>
<span class="line"><span>        user.setName(&quot;Jack&quot;);</span></span>
<span class="line"><span>        System.out.println(user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;--------------------------------------------&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取带String参数的public构造函数</span></span>
<span class="line"><span>        Constructor cs1 =clazz.getConstructor(String.class);</span></span>
<span class="line"><span>        //创建User</span></span>
<span class="line"><span>        User user1= (User) cs1.newInstance(&quot;hiway&quot;);</span></span>
<span class="line"><span>        user1.setAge(22);</span></span>
<span class="line"><span>        System.out.println(&quot;user1:&quot;+user1.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;--------------------------------------------&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //取得指定带int和String参数构造函数,该方法是私有构造private</span></span>
<span class="line"><span>        Constructor cs2=clazz.getDeclaredConstructor(int.class,String.class);</span></span>
<span class="line"><span>        //由于是private必须设置可访问</span></span>
<span class="line"><span>        cs2.setAccessible(true);</span></span>
<span class="line"><span>        //创建user对象</span></span>
<span class="line"><span>        User user2= (User) cs2.newInstance(25,&quot;hiway2&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;user2:&quot;+user2.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;--------------------------------------------&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取所有构造包含private</span></span>
<span class="line"><span>        Constructor&lt;?&gt; cons[] = clazz.getDeclaredConstructors();</span></span>
<span class="line"><span>        // 查看每个构造方法需要的参数</span></span>
<span class="line"><span>        for (int i = 0; i &lt; cons.length; i++) {</span></span>
<span class="line"><span>            //获取构造函数参数类型</span></span>
<span class="line"><span>            Class&lt;?&gt; clazzs[] = cons[i].getParameterTypes();</span></span>
<span class="line"><span>            System.out.println(&quot;构造函数[&quot;+i+&quot;]:&quot;+cons[i].toString() );</span></span>
<span class="line"><span>            System.out.print(&quot;参数类型[&quot;+i+&quot;]:(&quot;);</span></span>
<span class="line"><span>            for (int j = 0; j &lt; clazzs.length; j++) {</span></span>
<span class="line"><span>                if (j == clazzs.length - 1)</span></span>
<span class="line"><span>                    System.out.print(clazzs[j].getName());</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    System.out.print(clazzs[j].getName() + &quot;,&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.println(&quot;)&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class User {</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    public User() {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public User(String name) {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 私有构造</span></span>
<span class="line"><span>     * @param age</span></span>
<span class="line"><span>     * @param name</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private User(int age, String name) {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getAge() {</span></span>
<span class="line"><span>        return age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setAge(int age) {</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;User{&quot; +</span></span>
<span class="line"><span>                &quot;age=&quot; + age +</span></span>
<span class="line"><span>                &quot;, name=&#39;&quot; + name + &#39;\\&#39;&#39; +</span></span>
<span class="line"><span>                &#39;}&#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* output </span></span>
<span class="line"><span>User{age=20, name=&#39;Jack&#39;}</span></span>
<span class="line"><span>--------------------------------------------</span></span>
<span class="line"><span>user1:User{age=22, name=&#39;hiway&#39;}</span></span>
<span class="line"><span>--------------------------------------------</span></span>
<span class="line"><span>user2:User{age=25, name=&#39;hiway2&#39;}</span></span>
<span class="line"><span>--------------------------------------------</span></span>
<span class="line"><span>构造函数[0]:private com.example.javabase.User(int,java.lang.String)</span></span>
<span class="line"><span>参数类型[0]:(int,java.lang.String)</span></span>
<span class="line"><span>构造函数[1]:public com.example.javabase.User(java.lang.String)</span></span>
<span class="line"><span>参数类型[1]:(java.lang.String)</span></span>
<span class="line"><span>构造函数[2]:public com.example.javabase.User()</span></span>
<span class="line"><span>参数类型[2]:()</span></span></code></pre></div><p>关于<strong>Constructor类本身一些常用方法</strong>如下(仅部分，其他可查API)</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>Class</td><td>getDeclaringClass()</td><td>返回 Class 对象，该对象表示声明由此 Constructor 对象表示的构造方法的类,其实就是返回真实类型（不包含参数）</td></tr><tr><td>Type[]</td><td>getGenericParameterTypes()</td><td>按照声明顺序返回一组 Type 对象，返回的就是 Constructor对象构造函数的形参类型。</td></tr><tr><td>String</td><td>getName()</td><td>以字符串形式返回此构造方法的名称。</td></tr><tr><td>Class&lt;?&gt;[]</td><td>getParameterTypes()</td><td>按照声明顺序返回一组 Class 对象，即返回Constructor 对象所表示构造方法的形参类型</td></tr><tr><td>T</td><td>newInstance(Object... initargs)</td><td>使用此 Constructor对象表示的构造函数来创建新实例</td></tr><tr><td>String</td><td>toGenericString()</td><td>返回描述此 Constructor 的字符串，其中包括类型参数。</td></tr></tbody></table><p>代码演示如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Constructor cs3 = clazz.getDeclaredConstructor(int.class,String.class);</span></span>
<span class="line"><span>System.out.println(&quot;-----getDeclaringClass-----&quot;);</span></span>
<span class="line"><span>Class uclazz=cs3.getDeclaringClass();</span></span>
<span class="line"><span>//Constructor对象表示的构造方法的类</span></span>
<span class="line"><span>System.out.println(&quot;构造方法的类:&quot;+uclazz.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(&quot;-----getGenericParameterTypes-----&quot;);</span></span>
<span class="line"><span>//对象表示此 Constructor 对象所表示的方法的形参类型</span></span>
<span class="line"><span>Type[] tps=cs3.getGenericParameterTypes();</span></span>
<span class="line"><span>for (Type tp:tps) {</span></span>
<span class="line"><span>    System.out.println(&quot;参数名称tp:&quot;+tp);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>System.out.println(&quot;-----getParameterTypes-----&quot;);</span></span>
<span class="line"><span>//获取构造函数参数类型</span></span>
<span class="line"><span>Class&lt;?&gt; clazzs[] = cs3.getParameterTypes();</span></span>
<span class="line"><span>for (Class claz:clazzs) {</span></span>
<span class="line"><span>    System.out.println(&quot;参数名称:&quot;+claz.getName());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>System.out.println(&quot;-----getName-----&quot;);</span></span>
<span class="line"><span>//以字符串形式返回此构造方法的名称</span></span>
<span class="line"><span>System.out.println(&quot;getName:&quot;+cs3.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(&quot;-----getoGenericString-----&quot;);</span></span>
<span class="line"><span>//返回描述此 Constructor 的字符串，其中包括类型参数。</span></span>
<span class="line"><span>System.out.println(&quot;getoGenericString():&quot;+cs3.toGenericString());</span></span></code></pre></div><p>输出结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-----getDeclaringClass-----</span></span>
<span class="line"><span>构造方法的类:com.example.javabase.User</span></span>
<span class="line"><span>-----getGenericParameterTypes-----</span></span>
<span class="line"><span>参数名称tp:int</span></span>
<span class="line"><span>参数名称tp:class java.lang.String</span></span>
<span class="line"><span>-----getParameterTypes-----</span></span>
<span class="line"><span>参数名称:int</span></span>
<span class="line"><span>参数名称:java.lang.String</span></span>
<span class="line"><span>-----getName-----</span></span>
<span class="line"><span>getName:com.example.javabase.User</span></span>
<span class="line"><span>-----getoGenericString-----</span></span>
<span class="line"><span>getoGenericString():private com.example.javabase.User(int,java.lang.String)</span></span></code></pre></div><h3 id="field类及其用法" tabindex="-1">Field类及其用法 <a class="header-anchor" href="#field类及其用法" aria-label="Permalink to &quot;Field类及其用法&quot;">​</a></h3><blockquote><p>Field 提供有关类或接口的单个字段的信息，以及对它的动态访问权限。反射的字段可能是一个类（静态）字段或实例字段。</p></blockquote><p>同样的道理，我们可以通过Class类的提供的方法来获取代表字段信息的Field对象，Class类与Field对象相关方法如下：</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>Field</td><td>getDeclaredField(String name)</td><td>获取指定name名称的(包含private修饰的)字段，不包括继承的字段</td></tr><tr><td>Field[]</td><td>getDeclaredFields()</td><td>获取Class对象所表示的类或接口的所有(包含private修饰的)字段,不包括继承的字段</td></tr><tr><td>Field</td><td>getField(String name)</td><td>获取指定name名称、具有public修饰的字段，包含继承字段</td></tr><tr><td>Field[]</td><td>getFields()</td><td>获取修饰符为public的字段，包含继承字段</td></tr></tbody></table><p>下面的代码演示了上述方法的使用过程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReflectField {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {</span></span>
<span class="line"><span>        Class&lt;?&gt; clazz = Class.forName(&quot;reflect.Student&quot;);</span></span>
<span class="line"><span>        //获取指定字段名称的Field类,注意字段修饰符必须为public而且存在该字段,</span></span>
<span class="line"><span>        // 否则抛NoSuchFieldException</span></span>
<span class="line"><span>        Field field = clazz.getField(&quot;age&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;field:&quot;+field);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取所有修饰符为public的字段,包含父类字段,注意修饰符为public才会获取</span></span>
<span class="line"><span>        Field fields[] = clazz.getFields();</span></span>
<span class="line"><span>        for (Field f:fields) {</span></span>
<span class="line"><span>            System.out.println(&quot;f:&quot;+f.getDeclaringClass());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;================getDeclaredFields====================&quot;);</span></span>
<span class="line"><span>        //获取当前类所字段(包含private字段),注意不包含父类的字段</span></span>
<span class="line"><span>        Field fields2[] = clazz.getDeclaredFields();</span></span>
<span class="line"><span>        for (Field f:fields2) {</span></span>
<span class="line"><span>            System.out.println(&quot;f2:&quot;+f.getDeclaringClass());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //获取指定字段名称的Field类,可以是任意修饰符的自动,注意不包含父类的字段</span></span>
<span class="line"><span>        Field field2 = clazz.getDeclaredField(&quot;desc&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;field2:&quot;+field2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>      输出结果: </span></span>
<span class="line"><span>     field:public int reflect.Person.age</span></span>
<span class="line"><span>     f:public java.lang.String reflect.Student.desc</span></span>
<span class="line"><span>     f:public int reflect.Person.age</span></span>
<span class="line"><span>     f:public java.lang.String reflect.Person.name</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     ================getDeclaredFields====================</span></span>
<span class="line"><span>     f2:public java.lang.String reflect.Student.desc</span></span>
<span class="line"><span>     f2:private int reflect.Student.score</span></span>
<span class="line"><span>     field2:public java.lang.String reflect.Student.desc</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Person{</span></span>
<span class="line"><span>    public int age;</span></span>
<span class="line"><span>    public String name;</span></span>
<span class="line"><span>    //省略set和get方法</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Student extends Person{</span></span>
<span class="line"><span>    public String desc;</span></span>
<span class="line"><span>    private int score;</span></span>
<span class="line"><span>    //省略set和get方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述方法需要注意的是，如果我们不期望获取其父类的字段，则需使用Class类的getDeclaredField/getDeclaredFields方法来获取字段即可，倘若需要连带获取到父类的字段，那么请使用Class类的getField/getFields，但是也只能获取到public修饰的的字段，无法获取父类的私有字段。下面将通过Field类本身的方法对指定类属性赋值，代码演示如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//获取Class对象引用</span></span>
<span class="line"><span>Class&lt;?&gt; clazz = Class.forName(&quot;reflect.Student&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Student st= (Student) clazz.newInstance();</span></span>
<span class="line"><span>//获取父类public字段并赋值</span></span>
<span class="line"><span>Field ageField = clazz.getField(&quot;age&quot;);</span></span>
<span class="line"><span>ageField.set(st,18);</span></span>
<span class="line"><span>Field nameField = clazz.getField(&quot;name&quot;);</span></span>
<span class="line"><span>nameField.set(st,&quot;Lily&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//只获取当前类的字段,不获取父类的字段</span></span>
<span class="line"><span>Field descField = clazz.getDeclaredField(&quot;desc&quot;);</span></span>
<span class="line"><span>descField.set(st,&quot;I am student&quot;);</span></span>
<span class="line"><span>Field scoreField = clazz.getDeclaredField(&quot;score&quot;);</span></span>
<span class="line"><span>//设置可访问，score是private的</span></span>
<span class="line"><span>scoreField.setAccessible(true);</span></span>
<span class="line"><span>scoreField.set(st,88);</span></span>
<span class="line"><span>System.out.println(st.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//输出结果：Student{age=18, name=&#39;Lily ,desc=&#39;I am student&#39;, score=88} </span></span>
<span class="line"><span></span></span>
<span class="line"><span>//获取字段值</span></span>
<span class="line"><span>System.out.println(scoreField.get(st));</span></span>
<span class="line"><span>// 88</span></span></code></pre></div><p>其中的set(Object obj, Object value)方法是Field类本身的方法，用于设置字段的值，而get(Object obj)则是获取字段的值，当然关于Field类还有其他常用的方法如下：</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>void</td><td>set(Object obj, Object value)</td><td>将指定对象变量上此 Field 对象表示的字段设置为指定的新值。</td></tr><tr><td>Object</td><td>get(Object obj)</td><td>返回指定对象上此 Field 表示的字段的值</td></tr><tr><td>Class&lt;?&gt;</td><td>getType()</td><td>返回一个 Class 对象，它标识了此Field 对象所表示字段的声明类型。</td></tr><tr><td>boolean</td><td>isEnumConstant()</td><td>如果此字段表示枚举类型的元素则返回 true；否则返回 false</td></tr><tr><td>String</td><td>toGenericString()</td><td>返回一个描述此 Field（包括其一般类型）的字符串</td></tr><tr><td>String</td><td>getName()</td><td>返回此 Field 对象表示的字段的名称</td></tr><tr><td>Class&lt;?&gt;</td><td>getDeclaringClass()</td><td>返回表示类或接口的 Class 对象，该类或接口声明由此 Field 对象表示的字段</td></tr><tr><td>void</td><td>setAccessible(boolean flag)</td><td>将此对象的 accessible 标志设置为指示的布尔值,即设置其可访问性</td></tr></tbody></table><p>上述方法可能是较为常用的，事实上在设置值的方法上，Field类还提供了专门针对基本数据类型的方法，如<code>setInt()/getInt()</code>、<code>setBoolean()/getBoolean</code>、<code>setChar()/getChar()</code>等等方法，这里就不全部列出了，需要时查API文档即可。需要特别注意的是被final关键字修饰的Field字段是安全的，在运行时可以接收任何修改，但最终其实际值是不会发生改变的。</p><h3 id="method类及其用法" tabindex="-1">Method类及其用法 <a class="header-anchor" href="#method类及其用法" aria-label="Permalink to &quot;Method类及其用法&quot;">​</a></h3><blockquote><p>Method 提供关于类或接口上单独某个方法（以及如何访问该方法）的信息，所反映的方法可能是类方法或实例方法（包括抽象方法）。</p></blockquote><p>下面是Class类获取Method对象相关的方法：</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>Method</td><td>getDeclaredMethod(String name, Class&lt;?&gt;... parameterTypes)</td><td>返回一个指定参数的Method对象，该对象反映此 Class 对象所表示的类或接口的指定已声明方法。</td></tr><tr><td>Method[]</td><td>getDeclaredMethods()</td><td>返回 Method 对象的一个数组，这些对象反映此 Class 对象表示的类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括继承的方法。</td></tr><tr><td>Method</td><td>getMethod(String name, Class&lt;?&gt;... parameterTypes)</td><td>返回一个 Method 对象，它反映此 Class 对象所表示的类或接口的指定公共成员方法。</td></tr><tr><td>Method[]</td><td>getMethods()</td><td>返回一个包含某些 Method 对象的数组，这些对象反映此 Class 对象所表示的类或接口（包括那些由该类或接口声明的以及从超类和超接口继承的那些的类或接口）的公共 member 方法。</td></tr></tbody></table><p>同样通过案例演示上述方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ReflectMethod  {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Class clazz = Class.forName(&quot;reflect.Circle&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //根据参数获取public的Method,包含继承自父类的方法</span></span>
<span class="line"><span>        Method method = clazz.getMethod(&quot;draw&quot;,int.class,String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;method:&quot;+method);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取所有public的方法:</span></span>
<span class="line"><span>        Method[] methods =clazz.getMethods();</span></span>
<span class="line"><span>        for (Method m:methods){</span></span>
<span class="line"><span>            System.out.println(&quot;m::&quot;+m);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;=========================================&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //获取当前类的方法包含private,该方法无法获取继承自父类的method</span></span>
<span class="line"><span>        Method method1 = clazz.getDeclaredMethod(&quot;drawCircle&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;method1::&quot;+method1);</span></span>
<span class="line"><span>        //获取当前类的所有方法包含private,该方法无法获取继承自父类的method</span></span>
<span class="line"><span>        Method[] methods1=clazz.getDeclaredMethods();</span></span>
<span class="line"><span>        for (Method m:methods1){</span></span>
<span class="line"><span>            System.out.println(&quot;m1::&quot;+m);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Shape {</span></span>
<span class="line"><span>    public void draw(){</span></span>
<span class="line"><span>        System.out.println(&quot;draw&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void draw(int count , String name){</span></span>
<span class="line"><span>        System.out.println(&quot;draw &quot;+ name +&quot;,count=&quot;+count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Circle extends Shape{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void drawCircle(){</span></span>
<span class="line"><span>        System.out.println(&quot;drawCircle&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public int getAllCount(){</span></span>
<span class="line"><span>        return 100;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>method:public void reflect.Shape.draw(int,java.lang.String)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>m::public int reflect.Circle.getAllCount()</span></span>
<span class="line"><span>m::public void reflect.Shape.draw()</span></span>
<span class="line"><span>m::public void reflect.Shape.draw(int,java.lang.String)</span></span>
<span class="line"><span>m::public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException</span></span>
<span class="line"><span>m::public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException</span></span>
<span class="line"><span>m::public final void java.lang.Object.wait() throws java.lang.InterruptedException</span></span>
<span class="line"><span>m::public boolean java.lang.Object.equals(java.lang.Object)</span></span>
<span class="line"><span>m::public java.lang.String java.lang.Object.toString()</span></span>
<span class="line"><span>m::public native int java.lang.Object.hashCode()</span></span>
<span class="line"><span>m::public final native java.lang.Class java.lang.Object.getClass()</span></span>
<span class="line"><span>m::public final native void java.lang.Object.notify()</span></span>
<span class="line"><span>m::public final native void java.lang.Object.notifyAll()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=========================================</span></span>
<span class="line"><span>method1::private void reflect.Circle.drawCircle()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>m1::public int reflect.Circle.getAllCount()</span></span>
<span class="line"><span>m1::private void reflect.Circle.drawCircle()</span></span></code></pre></div><p>在通过getMethods方法获取Method对象时，会把父类的方法也获取到，如上的输出结果，把Object类的方法都打印出来了。而<code>getDeclaredMethod/getDeclaredMethods</code>方法都只能获取当前类的方法。我们在使用时根据情况选择即可。下面将演示通过Method对象调用指定类的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Class clazz = Class.forName(&quot;reflect.Circle&quot;);</span></span>
<span class="line"><span>//创建对象</span></span>
<span class="line"><span>Circle circle = (Circle) clazz.newInstance();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//获取指定参数的方法对象Method</span></span>
<span class="line"><span>Method method = clazz.getMethod(&quot;draw&quot;,int.class,String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//通过Method对象的invoke(Object obj,Object... args)方法调用</span></span>
<span class="line"><span>method.invoke(circle,15,&quot;圈圈&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//对私有无参方法的操作</span></span>
<span class="line"><span>Method method1 = clazz.getDeclaredMethod(&quot;drawCircle&quot;);</span></span>
<span class="line"><span>//修改私有方法的访问标识</span></span>
<span class="line"><span>method1.setAccessible(true);</span></span>
<span class="line"><span>method1.invoke(circle);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//对有返回值得方法操作</span></span>
<span class="line"><span>Method method2 =clazz.getDeclaredMethod(&quot;getAllCount&quot;);</span></span>
<span class="line"><span>Integer count = (Integer) method2.invoke(circle);</span></span>
<span class="line"><span>System.out.println(&quot;count:&quot;+count);</span></span></code></pre></div><p>输出结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>draw 圈圈,count=15</span></span>
<span class="line"><span>drawCircle</span></span>
<span class="line"><span>count:100</span></span></code></pre></div><p>在上述代码中调用方法，使用了Method类的<code>invoke(Object obj,Object... args)</code>第一个参数代表调用的对象，第二个参数传递的调用方法的参数。这样就完成了类方法的动态调用。</p><table tabindex="0"><thead><tr><th>方法返回值</th><th>方法名称</th><th>方法说明</th></tr></thead><tbody><tr><td>Object</td><td>invoke(Object obj, Object... args)</td><td>对带有指定参数的指定对象调用由此 Method 对象表示的底层方法。</td></tr><tr><td>Class&lt;?&gt;</td><td>getReturnType()</td><td>返回一个 Class 对象，该对象描述了此 Method 对象所表示的方法的正式返回类型,即方法的返回类型</td></tr><tr><td>Type</td><td>getGenericReturnType()</td><td>返回表示由此 Method 对象所表示方法的正式返回类型的 Type 对象，也是方法的返回类型。</td></tr><tr><td>Class&lt;?&gt;[]</td><td>getParameterTypes()</td><td>按照声明顺序返回 Class 对象的数组，这些对象描述了此 Method 对象所表示的方法的形参类型。即返回方法的参数类型组成的数组</td></tr><tr><td>Type[]</td><td>getGenericParameterTypes()</td><td>按照声明顺序返回 Type 对象的数组，这些对象描述了此 Method 对象所表示的方法的形参类型的，也是返回方法的参数类型</td></tr><tr><td>String</td><td>getName()</td><td>以 String 形式返回此 Method 对象表示的方法名称，即返回方法的名称</td></tr><tr><td>boolean</td><td>isVarArgs()</td><td>判断方法是否带可变参数，如果将此方法声明为带有可变数量的参数，则返回 true；否则，返回 false。</td></tr><tr><td>String</td><td>toGenericString()</td><td>返回描述此 Method 的字符串，包括类型参数。</td></tr></tbody></table><p><code>getReturnType方法/getGenericReturnType方法</code>都是获取Method对象表示的方法的返回类型，只不过前者返回的Class类型后者返回的Type(前面已分析过)，Type就是一个接口而已，在Java8中新增一个默认的方法实现，返回的就参数类型信息</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Type {</span></span>
<span class="line"><span>    //1.8新增</span></span>
<span class="line"><span>    default String getTypeName() {</span></span>
<span class="line"><span>        return toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而<code>getParameterTypes/getGenericParameterTypes</code>也是同样的道理，都是获取Method对象所表示的方法的参数类型，其他方法与前面的Field和Constructor是类似的。</p><h2 id="反射机制执行的流程" tabindex="-1">反射机制执行的流程 <a class="header-anchor" href="#反射机制执行的流程" aria-label="Permalink to &quot;反射机制执行的流程&quot;">​</a></h2><blockquote><p>这部分主要参考自<a href="https://www.cnblogs.com/yougewe/p/10125073.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/yougewe/p/10125073.html</a></p></blockquote><p><strong>先看个例子</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HelloReflect {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 1. 使用外部配置的实现，进行动态加载类</span></span>
<span class="line"><span>            TempFunctionTest test = (TempFunctionTest)Class.forName(&quot;com.tester.HelloReflect&quot;).newInstance();</span></span>
<span class="line"><span>            test.sayHello(&quot;call directly&quot;);</span></span>
<span class="line"><span>            // 2. 根据配置的函数名，进行方法调用（不需要通用的接口抽象）</span></span>
<span class="line"><span>            Object t2 = new TempFunctionTest();</span></span>
<span class="line"><span>            Method method = t2.getClass().getDeclaredMethod(&quot;sayHello&quot;, String.class);</span></span>
<span class="line"><span>            method.invoke(test, &quot;method invoke&quot;);</span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (InstantiationException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (IllegalAccessException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (NoSuchMethodException e ) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } catch (InvocationTargetException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void sayHello(String word) {</span></span>
<span class="line"><span>        System.out.println(&quot;hello,&quot; + word);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>来看执行流程</strong></p><p><img src="`+i+`" alt="error.图片加载失败"></p><h3 id="反射获取类实例" tabindex="-1">反射获取类实例 <a class="header-anchor" href="#反射获取类实例" aria-label="Permalink to &quot;反射获取类实例&quot;">​</a></h3><p>首先调用了 java.lang.Class 的静态方法，获取类信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @CallerSensitive</span></span>
<span class="line"><span>    public static Class&lt;?&gt; forName(String className)</span></span>
<span class="line"><span>                throws ClassNotFoundException {</span></span>
<span class="line"><span>        // 先通过反射，获取调用进来的类信息，从而获取当前的 classLoader</span></span>
<span class="line"><span>        Class&lt;?&gt; caller = Reflection.getCallerClass();</span></span>
<span class="line"><span>        // 调用native方法进行获取class信息</span></span>
<span class="line"><span>        return forName0(className, true, ClassLoader.getClassLoader(caller), caller);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>forName()反射获取类信息，并没有将实现留给了java,而是交给了jvm去加载。</p><p>主要是先获取 ClassLoader, 然后调用 native 方法，获取信息，加载类则是回调 java.lang.ClassLoader.</p><p>最后，jvm又会回调 ClassLoader 进类加载。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    // </span></span>
<span class="line"><span>    public Class&lt;?&gt; loadClass(String name) throws ClassNotFoundException {</span></span>
<span class="line"><span>        return loadClass(name, false);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        // sun.misc.Launcher</span></span>
<span class="line"><span>        public Class&lt;?&gt; loadClass(String var1, boolean var2) throws ClassNotFoundException {</span></span>
<span class="line"><span>            int var3 = var1.lastIndexOf(46);</span></span>
<span class="line"><span>            if(var3 != -1) {</span></span>
<span class="line"><span>                SecurityManager var4 = System.getSecurityManager();</span></span>
<span class="line"><span>                if(var4 != null) {</span></span>
<span class="line"><span>                    var4.checkPackageAccess(var1.substring(0, var3));</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if(this.ucp.knownToNotExist(var1)) {</span></span>
<span class="line"><span>                Class var5 = this.findLoadedClass(var1);</span></span>
<span class="line"><span>                if(var5 != null) {</span></span>
<span class="line"><span>                    if(var2) {</span></span>
<span class="line"><span>                        this.resolveClass(var5);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    return var5;</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    throw new ClassNotFoundException(var1);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                return super.loadClass(var1, var2);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    // java.lang.ClassLoader</span></span>
<span class="line"><span>    protected Class&lt;?&gt; loadClass(String name, boolean resolve)</span></span>
<span class="line"><span>        throws ClassNotFoundException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 先获取锁</span></span>
<span class="line"><span>        synchronized (getClassLoadingLock(name)) {</span></span>
<span class="line"><span>            // First, check if the class has already been loaded</span></span>
<span class="line"><span>            // 如果已经加载了的话，就不用再加载了</span></span>
<span class="line"><span>            Class&lt;?&gt; c = findLoadedClass(name);</span></span>
<span class="line"><span>            if (c == null) {</span></span>
<span class="line"><span>                long t0 = System.nanoTime();</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    // 双亲委托加载</span></span>
<span class="line"><span>                    if (parent != null) {</span></span>
<span class="line"><span>                        c = parent.loadClass(name, false);</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        c = findBootstrapClassOrNull(name);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>                    // ClassNotFoundException thrown if class not found</span></span>
<span class="line"><span>                    // from the non-null parent class loader</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // 父类没有加载到时，再自己加载</span></span>
<span class="line"><span>                if (c == null) {</span></span>
<span class="line"><span>                    // If still not found, then invoke findClass in order</span></span>
<span class="line"><span>                    // to find the class.</span></span>
<span class="line"><span>                    long t1 = System.nanoTime();</span></span>
<span class="line"><span>                    c = findClass(name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // this is the defining class loader; record the stats</span></span>
<span class="line"><span>                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);</span></span>
<span class="line"><span>                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);</span></span>
<span class="line"><span>                    sun.misc.PerfCounter.getFindClasses().increment();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (resolve) {</span></span>
<span class="line"><span>                resolveClass(c);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return c;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    protected Object getClassLoadingLock(String className) {</span></span>
<span class="line"><span>        Object lock = this;</span></span>
<span class="line"><span>        if (parallelLockMap != null) {</span></span>
<span class="line"><span>            // 使用 ConcurrentHashMap来保存锁</span></span>
<span class="line"><span>            Object newLock = new Object();</span></span>
<span class="line"><span>            lock = parallelLockMap.putIfAbsent(className, newLock);</span></span>
<span class="line"><span>            if (lock == null) {</span></span>
<span class="line"><span>                lock = newLock;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return lock;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    protected final Class&lt;?&gt; findLoadedClass(String name) {</span></span>
<span class="line"><span>        if (!checkName(name))</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        return findLoadedClass0(name);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>下面来看一下 newInstance() 的实现方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // 首先肯定是 Class.newInstance</span></span>
<span class="line"><span>    @CallerSensitive</span></span>
<span class="line"><span>    public T newInstance()</span></span>
<span class="line"><span>        throws InstantiationException, IllegalAccessException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (System.getSecurityManager() != null) {</span></span>
<span class="line"><span>            checkMemberAccess(Member.PUBLIC, Reflection.getCallerClass(), false);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // NOTE: the following code may not be strictly correct under</span></span>
<span class="line"><span>        // the current Java memory model.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Constructor lookup</span></span>
<span class="line"><span>        // newInstance() 其实相当于调用类的无参构造函数，所以，首先要找到其无参构造器</span></span>
<span class="line"><span>        if (cachedConstructor == null) {</span></span>
<span class="line"><span>            if (this == Class.class) {</span></span>
<span class="line"><span>                // 不允许调用 Class 的 newInstance() 方法</span></span>
<span class="line"><span>                throw new IllegalAccessException(</span></span>
<span class="line"><span>                    &quot;Can not call newInstance() on the Class for java.lang.Class&quot;</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                // 获取无参构造器</span></span>
<span class="line"><span>                Class&lt;?&gt;[] empty = {};</span></span>
<span class="line"><span>                final Constructor&lt;T&gt; c = getConstructor0(empty, Member.DECLARED);</span></span>
<span class="line"><span>                // Disable accessibility checks on the constructor</span></span>
<span class="line"><span>                // since we have to do the security check here anyway</span></span>
<span class="line"><span>                // (the stack depth is wrong for the Constructor&#39;s</span></span>
<span class="line"><span>                // security check to work)</span></span>
<span class="line"><span>                java.security.AccessController.doPrivileged(</span></span>
<span class="line"><span>                    new java.security.PrivilegedAction&lt;Void&gt;() {</span></span>
<span class="line"><span>                        public Void run() {</span></span>
<span class="line"><span>                                c.setAccessible(true);</span></span>
<span class="line"><span>                                return null;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        });</span></span>
<span class="line"><span>                cachedConstructor = c;</span></span>
<span class="line"><span>            } catch (NoSuchMethodException e) {</span></span>
<span class="line"><span>                throw (InstantiationException)</span></span>
<span class="line"><span>                    new InstantiationException(getName()).initCause(e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Constructor&lt;T&gt; tmpConstructor = cachedConstructor;</span></span>
<span class="line"><span>        // Security check (same as in java.lang.reflect.Constructor)</span></span>
<span class="line"><span>        int modifiers = tmpConstructor.getModifiers();</span></span>
<span class="line"><span>        if (!Reflection.quickCheckMemberAccess(this, modifiers)) {</span></span>
<span class="line"><span>            Class&lt;?&gt; caller = Reflection.getCallerClass();</span></span>
<span class="line"><span>            if (newInstanceCallerCache != caller) {</span></span>
<span class="line"><span>                Reflection.ensureMemberAccess(caller, this, null, modifiers);</span></span>
<span class="line"><span>                newInstanceCallerCache = caller;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // Run constructor</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 调用无参构造器</span></span>
<span class="line"><span>            return tmpConstructor.newInstance((Object[])null);</span></span>
<span class="line"><span>        } catch (InvocationTargetException e) {</span></span>
<span class="line"><span>            Unsafe.getUnsafe().throwException(e.getTargetException());</span></span>
<span class="line"><span>            // Not reached</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>newInstance() 主要做了三件事：</p><ul><li><ol><li>权限检测，如果不通过直接抛出异常；</li></ol></li><li><ol start="2"><li>查找无参构造器，并将其缓存起来；</li></ol></li><li><ol start="3"><li>调用具体方法的无参构造方法，生成实例并返回；</li></ol></li></ul><p>下面是获取构造器的过程：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    private Constructor&lt;T&gt; getConstructor0(Class&lt;?&gt;[] parameterTypes,</span></span>
<span class="line"><span>                                        int which) throws NoSuchMethodException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 获取所有构造器</span></span>
<span class="line"><span>        Constructor&lt;T&gt;[] constructors = privateGetDeclaredConstructors((which == Member.PUBLIC));</span></span>
<span class="line"><span>        for (Constructor&lt;T&gt; constructor : constructors) {</span></span>
<span class="line"><span>            if (arrayContentsEq(parameterTypes,</span></span>
<span class="line"><span>                                constructor.getParameterTypes())) {</span></span>
<span class="line"><span>                return getReflectionFactory().copyConstructor(constructor);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new NoSuchMethodException(getName() + &quot;.&lt;init&gt;&quot; + argumentTypesToString(parameterTypes));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>getConstructor0() 为获取匹配的构造方器；分三步：</p><ul><li><ol><li>先获取所有的constructors, 然后通过进行参数类型比较；</li></ol></li><li><ol start="2"><li>找到匹配后，通过 ReflectionFactory copy一份constructor返回；</li></ol></li><li><ol start="3"><li>否则抛出 NoSuchMethodException;</li></ol></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    // 获取当前类所有的构造方法，通过jvm或者缓存</span></span>
<span class="line"><span>    // Returns an array of &quot;root&quot; constructors. These Constructor</span></span>
<span class="line"><span>    // objects must NOT be propagated to the outside world, but must</span></span>
<span class="line"><span>    // instead be copied via ReflectionFactory.copyConstructor.</span></span>
<span class="line"><span>    private Constructor&lt;T&gt;[] privateGetDeclaredConstructors(boolean publicOnly) {</span></span>
<span class="line"><span>        checkInitted();</span></span>
<span class="line"><span>        Constructor&lt;T&gt;[] res;</span></span>
<span class="line"><span>        // 调用 reflectionData(), 获取保存的信息，使用软引用保存，从而使内存不够可以回收</span></span>
<span class="line"><span>        ReflectionData&lt;T&gt; rd = reflectionData();</span></span>
<span class="line"><span>        if (rd != null) {</span></span>
<span class="line"><span>            res = publicOnly ? rd.publicConstructors : rd.declaredConstructors;</span></span>
<span class="line"><span>            // 存在缓存，则直接返回</span></span>
<span class="line"><span>            if (res != null) return res;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // No cached value available; request value from VM</span></span>
<span class="line"><span>        if (isInterface()) {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>            Constructor&lt;T&gt;[] temporaryRes = (Constructor&lt;T&gt;[]) new Constructor&lt;?&gt;[0];</span></span>
<span class="line"><span>            res = temporaryRes;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // 使用native方法从jvm获取构造器</span></span>
<span class="line"><span>            res = getDeclaredConstructors0(publicOnly);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (rd != null) {</span></span>
<span class="line"><span>            // 最后，将从jvm中读取的内容，存入缓存</span></span>
<span class="line"><span>            if (publicOnly) {</span></span>
<span class="line"><span>                rd.publicConstructors = res;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                rd.declaredConstructors = res;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return res;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Lazily create and cache ReflectionData</span></span>
<span class="line"><span>    private ReflectionData&lt;T&gt; reflectionData() {</span></span>
<span class="line"><span>        SoftReference&lt;ReflectionData&lt;T&gt;&gt; reflectionData = this.reflectionData;</span></span>
<span class="line"><span>        int classRedefinedCount = this.classRedefinedCount;</span></span>
<span class="line"><span>        ReflectionData&lt;T&gt; rd;</span></span>
<span class="line"><span>        if (useCaches &amp;&amp;</span></span>
<span class="line"><span>            reflectionData != null &amp;&amp;</span></span>
<span class="line"><span>            (rd = reflectionData.get()) != null &amp;&amp;</span></span>
<span class="line"><span>            rd.redefinedCount == classRedefinedCount) {</span></span>
<span class="line"><span>            return rd;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // else no SoftReference or cleared SoftReference or stale ReflectionData</span></span>
<span class="line"><span>        // -&gt; create and replace new instance</span></span>
<span class="line"><span>        return newReflectionData(reflectionData, classRedefinedCount);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 新创建缓存，保存反射信息</span></span>
<span class="line"><span>    private ReflectionData&lt;T&gt; newReflectionData(SoftReference&lt;ReflectionData&lt;T&gt;&gt; oldReflectionData,</span></span>
<span class="line"><span>                                                int classRedefinedCount) {</span></span>
<span class="line"><span>        if (!useCaches) return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 使用cas保证更新的线程安全性，所以反射是保证线程安全的</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>            ReflectionData&lt;T&gt; rd = new ReflectionData&lt;&gt;(classRedefinedCount);</span></span>
<span class="line"><span>            // try to CAS it...</span></span>
<span class="line"><span>            if (Atomic.casReflectionData(this, oldReflectionData, new SoftReference&lt;&gt;(rd))) {</span></span>
<span class="line"><span>                return rd;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 先使用CAS更新，如果更新成功，则立即返回，否则测查当前已被其他线程更新的情况，如果和自己想要更新的状态一致，则也算是成功了</span></span>
<span class="line"><span>            oldReflectionData = this.reflectionData;</span></span>
<span class="line"><span>            classRedefinedCount = this.classRedefinedCount;</span></span>
<span class="line"><span>            if (oldReflectionData != null &amp;&amp;</span></span>
<span class="line"><span>                (rd = oldReflectionData.get()) != null &amp;&amp;</span></span>
<span class="line"><span>                rd.redefinedCount == classRedefinedCount) {</span></span>
<span class="line"><span>                return rd;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>如上，privateGetDeclaredConstructors(), 获取所有的构造器主要步骤；</p><ul><li><ol><li>先尝试从缓存中获取；</li></ol></li><li><ol start="2"><li>如果缓存没有，则从jvm中重新获取，并存入缓存，缓存使用软引用进行保存，保证内存可用；</li></ol></li></ul><p>另外，使用 relactionData() 进行缓存保存；ReflectionData 的数据结构如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    // reflection data that might get invalidated when JVM TI RedefineClasses() is called</span></span>
<span class="line"><span>    private static class ReflectionData&lt;T&gt; {</span></span>
<span class="line"><span>        volatile Field[] declaredFields;</span></span>
<span class="line"><span>        volatile Field[] publicFields;</span></span>
<span class="line"><span>        volatile Method[] declaredMethods;</span></span>
<span class="line"><span>        volatile Method[] publicMethods;</span></span>
<span class="line"><span>        volatile Constructor&lt;T&gt;[] declaredConstructors;</span></span>
<span class="line"><span>        volatile Constructor&lt;T&gt;[] publicConstructors;</span></span>
<span class="line"><span>        // Intermediate results for getFields and getMethods</span></span>
<span class="line"><span>        volatile Field[] declaredPublicFields;</span></span>
<span class="line"><span>        volatile Method[] declaredPublicMethods;</span></span>
<span class="line"><span>        volatile Class&lt;?&gt;[] interfaces;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Value of classRedefinedCount when we created this ReflectionData instance</span></span>
<span class="line"><span>        final int redefinedCount;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ReflectionData(int redefinedCount) {</span></span>
<span class="line"><span>            this.redefinedCount = redefinedCount;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>其中，还有一个点，就是如何比较构造是否是要查找构造器，其实就是比较类型完成相等就完了，有一个不相等则返回false。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    private static boolean arrayContentsEq(Object[] a1, Object[] a2) {</span></span>
<span class="line"><span>        if (a1 == null) {</span></span>
<span class="line"><span>            return a2 == null || a2.length == 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (a2 == null) {</span></span>
<span class="line"><span>            return a1.length == 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (a1.length != a2.length) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; a1.length; i++) {</span></span>
<span class="line"><span>            if (a1[i] != a2[i]) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // sun.reflect.ReflectionFactory</span></span>
<span class="line"><span>    /** Makes a copy of the passed constructor. The returned</span></span>
<span class="line"><span>        constructor is a &quot;child&quot; of the passed one; see the comments</span></span>
<span class="line"><span>        in Constructor.java for details. */</span></span>
<span class="line"><span>    public &lt;T&gt; Constructor&lt;T&gt; copyConstructor(Constructor&lt;T&gt; arg) {</span></span>
<span class="line"><span>        return langReflectAccess().copyConstructor(arg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // java.lang.reflect.Constructor, copy 其实就是新new一个 Constructor 出来</span></span>
<span class="line"><span>    Constructor&lt;T&gt; copy() {</span></span>
<span class="line"><span>        // This routine enables sharing of ConstructorAccessor objects</span></span>
<span class="line"><span>        // among Constructor objects which refer to the same underlying</span></span>
<span class="line"><span>        // method in the VM. (All of this contortion is only necessary</span></span>
<span class="line"><span>        // because of the &quot;accessibility&quot; bit in AccessibleObject,</span></span>
<span class="line"><span>        // which implicitly requires that new java.lang.reflect</span></span>
<span class="line"><span>        // objects be fabricated for each reflective call on Class</span></span>
<span class="line"><span>        // objects.)</span></span>
<span class="line"><span>        if (this.root != null)</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Can not copy a non-root Constructor&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Constructor&lt;T&gt; res = new Constructor&lt;&gt;(clazz,</span></span>
<span class="line"><span>                                               parameterTypes,</span></span>
<span class="line"><span>                                               exceptionTypes, modifiers, slot,</span></span>
<span class="line"><span>                                               signature,</span></span>
<span class="line"><span>                                               annotations,</span></span>
<span class="line"><span>                                               parameterAnnotations);</span></span>
<span class="line"><span>        // root 指向当前 constructor</span></span>
<span class="line"><span>        res.root = this;</span></span>
<span class="line"><span>        // Might as well eagerly propagate this if already present</span></span>
<span class="line"><span>        res.constructorAccessor = constructorAccessor;</span></span>
<span class="line"><span>        return res;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>通过上面，获取到 Constructor 了。</p><p>接下来就只需调用其相应构造器的 newInstance()，即返回实例了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // return tmpConstructor.newInstance((Object[])null); </span></span>
<span class="line"><span>    // java.lang.reflect.Constructor</span></span>
<span class="line"><span>    @CallerSensitive</span></span>
<span class="line"><span>    public T newInstance(Object ... initargs)</span></span>
<span class="line"><span>        throws InstantiationException, IllegalAccessException,</span></span>
<span class="line"><span>               IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (!override) {</span></span>
<span class="line"><span>            if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {</span></span>
<span class="line"><span>                Class&lt;?&gt; caller = Reflection.getCallerClass();</span></span>
<span class="line"><span>                checkAccess(caller, clazz, null, modifiers);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if ((clazz.getModifiers() &amp; Modifier.ENUM) != 0)</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Cannot reflectively create enum objects&quot;);</span></span>
<span class="line"><span>        ConstructorAccessor ca = constructorAccessor;   // read volatile</span></span>
<span class="line"><span>        if (ca == null) {</span></span>
<span class="line"><span>            ca = acquireConstructorAccessor();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>        T inst = (T) ca.newInstance(initargs);</span></span>
<span class="line"><span>        return inst;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // sun.reflect.DelegatingConstructorAccessorImpl</span></span>
<span class="line"><span>    public Object newInstance(Object[] args)</span></span>
<span class="line"><span>      throws InstantiationException,</span></span>
<span class="line"><span>             IllegalArgumentException,</span></span>
<span class="line"><span>             InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return delegate.newInstance(args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // sun.reflect.NativeConstructorAccessorImpl</span></span>
<span class="line"><span>    public Object newInstance(Object[] args)</span></span>
<span class="line"><span>        throws InstantiationException,</span></span>
<span class="line"><span>               IllegalArgumentException,</span></span>
<span class="line"><span>               InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // We can&#39;t inflate a constructor belonging to a vm-anonymous class</span></span>
<span class="line"><span>        // because that kind of class can&#39;t be referred to by name, hence can&#39;t</span></span>
<span class="line"><span>        // be found from the generated bytecode.</span></span>
<span class="line"><span>        if (++numInvocations &gt; ReflectionFactory.inflationThreshold()</span></span>
<span class="line"><span>                &amp;&amp; !ReflectUtil.isVMAnonymousClass(c.getDeclaringClass())) {</span></span>
<span class="line"><span>            ConstructorAccessorImpl acc = (ConstructorAccessorImpl)</span></span>
<span class="line"><span>                new MethodAccessorGenerator().</span></span>
<span class="line"><span>                    generateConstructor(c.getDeclaringClass(),</span></span>
<span class="line"><span>                                        c.getParameterTypes(),</span></span>
<span class="line"><span>                                        c.getExceptionTypes(),</span></span>
<span class="line"><span>                                        c.getModifiers());</span></span>
<span class="line"><span>            parent.setDelegate(acc);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 调用native方法，进行调用 constructor</span></span>
<span class="line"><span>        return newInstance0(c, args);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>返回构造器的实例后，可以根据外部进行进行类型转换，从而使用接口或方法进行调用实例功能了。</p><h3 id="反射获取方法" tabindex="-1">反射获取方法 <a class="header-anchor" href="#反射获取方法" aria-label="Permalink to &quot;反射获取方法&quot;">​</a></h3><ul><li><strong>第一步，先获取 Method</strong>;</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // java.lang.Class</span></span>
<span class="line"><span>    @CallerSensitive</span></span>
<span class="line"><span>    public Method getDeclaredMethod(String name, Class&lt;?&gt;... parameterTypes)</span></span>
<span class="line"><span>        throws NoSuchMethodException, SecurityException {</span></span>
<span class="line"><span>        checkMemberAccess(Member.DECLARED, Reflection.getCallerClass(), true);</span></span>
<span class="line"><span>        Method method = searchMethods(privateGetDeclaredMethods(false), name, parameterTypes);</span></span>
<span class="line"><span>        if (method == null) {</span></span>
<span class="line"><span>            throw new NoSuchMethodException(getName() + &quot;.&quot; + name + argumentTypesToString(parameterTypes));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return method;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>忽略第一个检查权限，剩下就只有两个动作了。</p><ul><li><ol><li>获取所有方法列表；</li></ol></li><li><ol start="2"><li>根据方法名称和方法列表，选出符合要求的方法；</li></ol></li><li><ol start="3"><li>如果没有找到相应方法，抛出异常，否则返回对应方法；</li></ol></li></ul><p>所以，先看一下怎样获取类声明的所有方法？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // Returns an array of &quot;root&quot; methods. These Method objects must NOT</span></span>
<span class="line"><span>    // be propagated to the outside world, but must instead be copied</span></span>
<span class="line"><span>    // via ReflectionFactory.copyMethod.</span></span>
<span class="line"><span>    private Method[] privateGetDeclaredMethods(boolean publicOnly) {</span></span>
<span class="line"><span>        checkInitted();</span></span>
<span class="line"><span>        Method[] res;</span></span>
<span class="line"><span>        ReflectionData&lt;T&gt; rd = reflectionData();</span></span>
<span class="line"><span>        if (rd != null) {</span></span>
<span class="line"><span>            res = publicOnly ? rd.declaredPublicMethods : rd.declaredMethods;</span></span>
<span class="line"><span>            if (res != null) return res;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // No cached value available; request value from VM</span></span>
<span class="line"><span>        res = Reflection.filterMethods(this, getDeclaredMethods0(publicOnly));</span></span>
<span class="line"><span>        if (rd != null) {</span></span>
<span class="line"><span>            if (publicOnly) {</span></span>
<span class="line"><span>                rd.declaredPublicMethods = res;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                rd.declaredMethods = res;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return res;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>很相似，和获取所有构造器的方法很相似，都是先从缓存中获取方法，如果没有，则从jvm中获取。</p><p>不同的是，方法列表需要进行过滤 Reflection.filterMethods;当然后面看来，这个方法我们一般不会派上用场。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    // sun.misc.Reflection</span></span>
<span class="line"><span>    public static Method[] filterMethods(Class&lt;?&gt; containingClass, Method[] methods) {</span></span>
<span class="line"><span>        if (methodFilterMap == null) {</span></span>
<span class="line"><span>            // Bootstrapping</span></span>
<span class="line"><span>            return methods;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return (Method[])filter(methods, methodFilterMap.get(containingClass));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 可以过滤指定的方法，一般为空，如果要指定过滤，可以调用 registerMethodsToFilter(), 或者...</span></span>
<span class="line"><span>    private static Member[] filter(Member[] members, String[] filteredNames) {</span></span>
<span class="line"><span>        if ((filteredNames == null) || (members.length == 0)) {</span></span>
<span class="line"><span>            return members;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int numNewMembers = 0;</span></span>
<span class="line"><span>        for (Member member : members) {</span></span>
<span class="line"><span>            boolean shouldSkip = false;</span></span>
<span class="line"><span>            for (String filteredName : filteredNames) {</span></span>
<span class="line"><span>                if (member.getName() == filteredName) {</span></span>
<span class="line"><span>                    shouldSkip = true;</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (!shouldSkip) {</span></span>
<span class="line"><span>                ++numNewMembers;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Member[] newMembers =</span></span>
<span class="line"><span>            (Member[])Array.newInstance(members[0].getClass(), numNewMembers);</span></span>
<span class="line"><span>        int destIdx = 0;</span></span>
<span class="line"><span>        for (Member member : members) {</span></span>
<span class="line"><span>            boolean shouldSkip = false;</span></span>
<span class="line"><span>            for (String filteredName : filteredNames) {</span></span>
<span class="line"><span>                if (member.getName() == filteredName) {</span></span>
<span class="line"><span>                    shouldSkip = true;</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (!shouldSkip) {</span></span>
<span class="line"><span>                newMembers[destIdx++] = member;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return newMembers;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li><strong>第二步，根据方法名和参数类型过滤指定方法返回</strong>：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    private static Method searchMethods(Method[] methods,</span></span>
<span class="line"><span>                                        String name,</span></span>
<span class="line"><span>                                        Class&lt;?&gt;[] parameterTypes)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Method res = null;</span></span>
<span class="line"><span>        // 使用常量池，避免重复创建String</span></span>
<span class="line"><span>        String internedName = name.intern();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; methods.length; i++) {</span></span>
<span class="line"><span>            Method m = methods[i];</span></span>
<span class="line"><span>            if (m.getName() == internedName</span></span>
<span class="line"><span>                &amp;&amp; arrayContentsEq(parameterTypes, m.getParameterTypes())</span></span>
<span class="line"><span>                &amp;&amp; (res == null</span></span>
<span class="line"><span>                    || res.getReturnType().isAssignableFrom(m.getReturnType())))</span></span>
<span class="line"><span>                res = m;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return (res == null ? res : getReflectionFactory().copyMethod(res));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>大概意思看得明白，就是匹配到方法名，然后参数类型匹配，才可以。</p><ul><li>但是可以看到，匹配到一个方法，并没有退出for循环，而是继续进行匹配。</li><li>这里是匹配最精确的子类进行返回（最优匹配）</li><li>最后，还是通过 ReflectionFactory, copy 方法后返回。</li></ul><h3 id="调用-method-invoke-方法" tabindex="-1">调用 method.invoke() 方法 <a class="header-anchor" href="#调用-method-invoke-方法" aria-label="Permalink to &quot;调用 method.invoke() 方法&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @CallerSensitive</span></span>
<span class="line"><span>    public Object invoke(Object obj, Object... args)</span></span>
<span class="line"><span>        throws IllegalAccessException, IllegalArgumentException,</span></span>
<span class="line"><span>           InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (!override) {</span></span>
<span class="line"><span>            if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {</span></span>
<span class="line"><span>                Class&lt;?&gt; caller = Reflection.getCallerClass();</span></span>
<span class="line"><span>                checkAccess(caller, clazz, obj, modifiers);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        MethodAccessor ma = methodAccessor;             // read volatile</span></span>
<span class="line"><span>        if (ma == null) {</span></span>
<span class="line"><span>            ma = acquireMethodAccessor();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return ma.invoke(obj, args);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>invoke时，是通过 MethodAccessor 进行调用的，而 MethodAccessor 是个接口，在第一次时调用 acquireMethodAccessor() 进行新创建。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // probably make the implementation more scalable.</span></span>
<span class="line"><span>    private MethodAccessor acquireMethodAccessor() {</span></span>
<span class="line"><span>        // First check to see if one has been created yet, and take it</span></span>
<span class="line"><span>        // if so</span></span>
<span class="line"><span>        MethodAccessor tmp = null;</span></span>
<span class="line"><span>        if (root != null) tmp = root.getMethodAccessor();</span></span>
<span class="line"><span>        if (tmp != null) {</span></span>
<span class="line"><span>            // 存在缓存时，存入 methodAccessor，否则调用 ReflectionFactory 创建新的 MethodAccessor</span></span>
<span class="line"><span>            methodAccessor = tmp;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // Otherwise fabricate one and propagate it up to the root</span></span>
<span class="line"><span>            tmp = reflectionFactory.newMethodAccessor(this);</span></span>
<span class="line"><span>            setMethodAccessor(tmp);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return tmp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // sun.reflect.ReflectionFactory</span></span>
<span class="line"><span>    public MethodAccessor newMethodAccessor(Method method) {</span></span>
<span class="line"><span>        checkInitted();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (noInflation &amp;&amp; !ReflectUtil.isVMAnonymousClass(method.getDeclaringClass())) {</span></span>
<span class="line"><span>            return new MethodAccessorGenerator().</span></span>
<span class="line"><span>                generateMethod(method.getDeclaringClass(),</span></span>
<span class="line"><span>                               method.getName(),</span></span>
<span class="line"><span>                               method.getParameterTypes(),</span></span>
<span class="line"><span>                               method.getReturnType(),</span></span>
<span class="line"><span>                               method.getExceptionTypes(),</span></span>
<span class="line"><span>                               method.getModifiers());</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            NativeMethodAccessorImpl acc =</span></span>
<span class="line"><span>                new NativeMethodAccessorImpl(method);</span></span>
<span class="line"><span>            DelegatingMethodAccessorImpl res =</span></span>
<span class="line"><span>                new DelegatingMethodAccessorImpl(acc);</span></span>
<span class="line"><span>            acc.setParent(res);</span></span>
<span class="line"><span>            return res;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>两个Accessor详情：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>//     NativeMethodAccessorImpl / DelegatingMethodAccessorImpl</span></span>
<span class="line"><span>class NativeMethodAccessorImpl extends MethodAccessorImpl {</span></span>
<span class="line"><span>    private final Method method;</span></span>
<span class="line"><span>    private DelegatingMethodAccessorImpl parent;</span></span>
<span class="line"><span>    private int numInvocations;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    NativeMethodAccessorImpl(Method method) {</span></span>
<span class="line"><span>        this.method = method;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object invoke(Object obj, Object[] args)</span></span>
<span class="line"><span>        throws IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // We can&#39;t inflate methods belonging to vm-anonymous classes because</span></span>
<span class="line"><span>        // that kind of class can&#39;t be referred to by name, hence can&#39;t be</span></span>
<span class="line"><span>        // found from the generated bytecode.</span></span>
<span class="line"><span>        if (++numInvocations &gt; ReflectionFactory.inflationThreshold()</span></span>
<span class="line"><span>                &amp;&amp; !ReflectUtil.isVMAnonymousClass(method.getDeclaringClass())) {</span></span>
<span class="line"><span>            MethodAccessorImpl acc = (MethodAccessorImpl)</span></span>
<span class="line"><span>                new MethodAccessorGenerator().</span></span>
<span class="line"><span>                    generateMethod(method.getDeclaringClass(),</span></span>
<span class="line"><span>                                   method.getName(),</span></span>
<span class="line"><span>                                   method.getParameterTypes(),</span></span>
<span class="line"><span>                                   method.getReturnType(),</span></span>
<span class="line"><span>                                   method.getExceptionTypes(),</span></span>
<span class="line"><span>                                   method.getModifiers());</span></span>
<span class="line"><span>            parent.setDelegate(acc);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return invoke0(method, obj, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setParent(DelegatingMethodAccessorImpl parent) {</span></span>
<span class="line"><span>        this.parent = parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static native Object invoke0(Method m, Object obj, Object[] args);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class DelegatingMethodAccessorImpl extends MethodAccessorImpl {</span></span>
<span class="line"><span>    private MethodAccessorImpl delegate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DelegatingMethodAccessorImpl(MethodAccessorImpl delegate) {</span></span>
<span class="line"><span>        setDelegate(delegate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object invoke(Object obj, Object[] args)</span></span>
<span class="line"><span>        throws IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return delegate.invoke(obj, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setDelegate(MethodAccessorImpl delegate) {</span></span>
<span class="line"><span>        this.delegate = delegate;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>进行 ma.invoke(obj, args); 调用时，调用 DelegatingMethodAccessorImpl.invoke();</p><p>最后被委托到 NativeMethodAccessorImpl.invoke(), 即：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    public Object invoke(Object obj, Object[] args)</span></span>
<span class="line"><span>        throws IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // We can&#39;t inflate methods belonging to vm-anonymous classes because</span></span>
<span class="line"><span>        // that kind of class can&#39;t be referred to by name, hence can&#39;t be</span></span>
<span class="line"><span>        // found from the generated bytecode.</span></span>
<span class="line"><span>        if (++numInvocations &gt; ReflectionFactory.inflationThreshold()</span></span>
<span class="line"><span>                &amp;&amp; !ReflectUtil.isVMAnonymousClass(method.getDeclaringClass())) {</span></span>
<span class="line"><span>            MethodAccessorImpl acc = (MethodAccessorImpl)</span></span>
<span class="line"><span>                new MethodAccessorGenerator().</span></span>
<span class="line"><span>                    generateMethod(method.getDeclaringClass(),</span></span>
<span class="line"><span>                                   method.getName(),</span></span>
<span class="line"><span>                                   method.getParameterTypes(),</span></span>
<span class="line"><span>                                   method.getReturnType(),</span></span>
<span class="line"><span>                                   method.getExceptionTypes(),</span></span>
<span class="line"><span>                                   method.getModifiers());</span></span>
<span class="line"><span>            parent.setDelegate(acc);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // invoke0 是个 native 方法，由jvm进行调用业务方法。从而完成反射调用功能。</span></span>
<span class="line"><span>        return invoke0(method, obj, args);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>其中， generateMethod() 是生成具体类的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /** This routine is not thread-safe */</span></span>
<span class="line"><span>    public MethodAccessor generateMethod(Class&lt;?&gt; declaringClass,</span></span>
<span class="line"><span>                                         String   name,</span></span>
<span class="line"><span>                                         Class&lt;?&gt;[] parameterTypes,</span></span>
<span class="line"><span>                                         Class&lt;?&gt;   returnType,</span></span>
<span class="line"><span>                                         Class&lt;?&gt;[] checkedExceptions,</span></span>
<span class="line"><span>                                         int modifiers)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return (MethodAccessor) generate(declaringClass,</span></span>
<span class="line"><span>                                         name,</span></span>
<span class="line"><span>                                         parameterTypes,</span></span>
<span class="line"><span>                                         returnType,</span></span>
<span class="line"><span>                                         checkedExceptions,</span></span>
<span class="line"><span>                                         modifiers,</span></span>
<span class="line"><span>                                         false,</span></span>
<span class="line"><span>                                         false,</span></span>
<span class="line"><span>                                         null);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>generate() 戳详情。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /** This routine is not thread-safe */</span></span>
<span class="line"><span>    private MagicAccessorImpl generate(final Class&lt;?&gt; declaringClass,</span></span>
<span class="line"><span>                                       String name,</span></span>
<span class="line"><span>                                       Class&lt;?&gt;[] parameterTypes,</span></span>
<span class="line"><span>                                       Class&lt;?&gt;   returnType,</span></span>
<span class="line"><span>                                       Class&lt;?&gt;[] checkedExceptions,</span></span>
<span class="line"><span>                                       int modifiers,</span></span>
<span class="line"><span>                                       boolean isConstructor,</span></span>
<span class="line"><span>                                       boolean forSerialization,</span></span>
<span class="line"><span>                                       Class&lt;?&gt; serializationTargetClass)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ByteVector vec = ByteVectorFactory.create();</span></span>
<span class="line"><span>        asm = new ClassFileAssembler(vec);</span></span>
<span class="line"><span>        this.declaringClass = declaringClass;</span></span>
<span class="line"><span>        this.parameterTypes = parameterTypes;</span></span>
<span class="line"><span>        this.returnType = returnType;</span></span>
<span class="line"><span>        this.modifiers = modifiers;</span></span>
<span class="line"><span>        this.isConstructor = isConstructor;</span></span>
<span class="line"><span>        this.forSerialization = forSerialization;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asm.emitMagicAndVersion();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Constant pool entries:</span></span>
<span class="line"><span>        // ( * = Boxing information: optional)</span></span>
<span class="line"><span>        // (+  = Shared entries provided by AccessorGenerator)</span></span>
<span class="line"><span>        // (^  = Only present if generating SerializationConstructorAccessor)</span></span>
<span class="line"><span>        //     [UTF-8] [This class&#39;s name]</span></span>
<span class="line"><span>        //     [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //     [UTF-8] &quot;sun/reflect/{MethodAccessorImpl,ConstructorAccessorImpl,SerializationConstructorAccessorImpl}&quot;</span></span>
<span class="line"><span>        //     [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //     [UTF-8] [Target class&#39;s name]</span></span>
<span class="line"><span>        //     [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // ^   [UTF-8] [Serialization: Class&#39;s name in which to invoke constructor]</span></span>
<span class="line"><span>        // ^   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //     [UTF-8] target method or constructor name</span></span>
<span class="line"><span>        //     [UTF-8] target method or constructor signature</span></span>
<span class="line"><span>        //     [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //     [CONSTANT_Methodref_info or CONSTANT_InterfaceMethodref_info] for target method</span></span>
<span class="line"><span>        //     [UTF-8] &quot;invoke&quot; or &quot;newInstance&quot;</span></span>
<span class="line"><span>        //     [UTF-8] invoke or newInstance descriptor</span></span>
<span class="line"><span>        //     [UTF-8] descriptor for type of non-primitive parameter 1</span></span>
<span class="line"><span>        //     [CONSTANT_Class_info] for type of non-primitive parameter 1</span></span>
<span class="line"><span>        //     ...</span></span>
<span class="line"><span>        //     [UTF-8] descriptor for type of non-primitive parameter n</span></span>
<span class="line"><span>        //     [CONSTANT_Class_info] for type of non-primitive parameter n</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/Exception&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/ClassCastException&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/NullPointerException&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/IllegalArgumentException&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/InvocationTargetException&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;&lt;init&gt;&quot;</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;()V&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for NullPointerException&#39;s constructor</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for IllegalArgumentException&#39;s constructor</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;(Ljava/lang/String;)V&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_NameAndType_info] for &quot;&lt;init&gt;(Ljava/lang/String;)V&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for IllegalArgumentException&#39;s constructor taking a String</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;(Ljava/lang/Throwable;)V&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_NameAndType_info] for &quot;&lt;init&gt;(Ljava/lang/Throwable;)V&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for InvocationTargetException&#39;s constructor</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for &quot;super()&quot;</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;java/lang/Object&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;toString&quot;</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;()Ljava/lang/String;&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_NameAndType_info] for &quot;toString()Ljava/lang/String;&quot;</span></span>
<span class="line"><span>        // +   [CONSTANT_Methodref_info] for Object&#39;s toString method</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;Code&quot;</span></span>
<span class="line"><span>        // +   [UTF-8] &quot;Exceptions&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Boolean&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(Z)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;booleanValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()Z&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Byte&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(B)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;byteValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()B&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Character&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(C)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;charValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()C&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Double&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(D)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;doubleValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()D&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Float&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(F)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;floatValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()F&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Integer&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(I)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;intValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()I&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Long&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(J)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;longValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()J&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;java/lang/Short&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_Class_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;(S)V&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;shortValue&quot;</span></span>
<span class="line"><span>        //  *  [UTF-8] &quot;()S&quot;</span></span>
<span class="line"><span>        //  *  [CONSTANT_NameAndType_info] for above</span></span>
<span class="line"><span>        //  *  [CONSTANT_Methodref_info] for above</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        short numCPEntries = NUM_BASE_CPOOL_ENTRIES + NUM_COMMON_CPOOL_ENTRIES;</span></span>
<span class="line"><span>        boolean usesPrimitives = usesPrimitiveTypes();</span></span>
<span class="line"><span>        if (usesPrimitives) {</span></span>
<span class="line"><span>            numCPEntries += NUM_BOXING_CPOOL_ENTRIES;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (forSerialization) {</span></span>
<span class="line"><span>            numCPEntries += NUM_SERIALIZATION_CPOOL_ENTRIES;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Add in variable-length number of entries to be able to describe</span></span>
<span class="line"><span>        // non-primitive parameter types and checked exceptions.</span></span>
<span class="line"><span>        numCPEntries += (short) (2 * numNonPrimitiveParameterTypes());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asm.emitShort(add(numCPEntries, S1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        final String generatedName = generateName(isConstructor, forSerialization);</span></span>
<span class="line"><span>        asm.emitConstantPoolUTF8(generatedName);</span></span>
<span class="line"><span>        asm.emitConstantPoolClass(asm.cpi());</span></span>
<span class="line"><span>        thisClass = asm.cpi();</span></span>
<span class="line"><span>        if (isConstructor) {</span></span>
<span class="line"><span>            if (forSerialization) {</span></span>
<span class="line"><span>                asm.emitConstantPoolUTF8</span></span>
<span class="line"><span>                    (&quot;sun/reflect/SerializationConstructorAccessorImpl&quot;);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                asm.emitConstantPoolUTF8(&quot;sun/reflect/ConstructorAccessorImpl&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8(&quot;sun/reflect/MethodAccessorImpl&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        asm.emitConstantPoolClass(asm.cpi());</span></span>
<span class="line"><span>        superClass = asm.cpi();</span></span>
<span class="line"><span>        asm.emitConstantPoolUTF8(getClassName(declaringClass, false));</span></span>
<span class="line"><span>        asm.emitConstantPoolClass(asm.cpi());</span></span>
<span class="line"><span>        targetClass = asm.cpi();</span></span>
<span class="line"><span>        short serializationTargetClassIdx = (short) 0;</span></span>
<span class="line"><span>        if (forSerialization) {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8(getClassName(serializationTargetClass, false));</span></span>
<span class="line"><span>            asm.emitConstantPoolClass(asm.cpi());</span></span>
<span class="line"><span>            serializationTargetClassIdx = asm.cpi();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        asm.emitConstantPoolUTF8(name);</span></span>
<span class="line"><span>        asm.emitConstantPoolUTF8(buildInternalSignature());</span></span>
<span class="line"><span>        asm.emitConstantPoolNameAndType(sub(asm.cpi(), S1), asm.cpi());</span></span>
<span class="line"><span>        if (isInterface()) {</span></span>
<span class="line"><span>            asm.emitConstantPoolInterfaceMethodref(targetClass, asm.cpi());</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            if (forSerialization) {</span></span>
<span class="line"><span>                asm.emitConstantPoolMethodref(serializationTargetClassIdx, asm.cpi());</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                asm.emitConstantPoolMethodref(targetClass, asm.cpi());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        targetMethodRef = asm.cpi();</span></span>
<span class="line"><span>        if (isConstructor) {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8(&quot;newInstance&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8(&quot;invoke&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        invokeIdx = asm.cpi();</span></span>
<span class="line"><span>        if (isConstructor) {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8(&quot;([Ljava/lang/Object;)Ljava/lang/Object;&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            asm.emitConstantPoolUTF8</span></span>
<span class="line"><span>                (&quot;(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        invokeDescriptorIdx = asm.cpi();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Output class information for non-primitive parameter types</span></span>
<span class="line"><span>        nonPrimitiveParametersBaseIdx = add(asm.cpi(), S2);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; parameterTypes.length; i++) {</span></span>
<span class="line"><span>            Class&lt;?&gt; c = parameterTypes[i];</span></span>
<span class="line"><span>            if (!isPrimitive(c)) {</span></span>
<span class="line"><span>                asm.emitConstantPoolUTF8(getClassName(c, false));</span></span>
<span class="line"><span>                asm.emitConstantPoolClass(asm.cpi());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Entries common to FieldAccessor, MethodAccessor and ConstructorAccessor</span></span>
<span class="line"><span>        emitCommonConstantPoolEntries();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Boxing entries</span></span>
<span class="line"><span>        if (usesPrimitives) {</span></span>
<span class="line"><span>            emitBoxingContantPoolEntries();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (asm.cpi() != numCPEntries) {</span></span>
<span class="line"><span>            throw new InternalError(&quot;Adjust this code (cpi = &quot; + asm.cpi() +</span></span>
<span class="line"><span>                                    &quot;, numCPEntries = &quot; + numCPEntries + &quot;)&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Access flags</span></span>
<span class="line"><span>        asm.emitShort(ACC_PUBLIC);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // This class</span></span>
<span class="line"><span>        asm.emitShort(thisClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Superclass</span></span>
<span class="line"><span>        asm.emitShort(superClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Interfaces count and interfaces</span></span>
<span class="line"><span>        asm.emitShort(S0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Fields count and fields</span></span>
<span class="line"><span>        asm.emitShort(S0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Methods count and methods</span></span>
<span class="line"><span>        asm.emitShort(NUM_METHODS);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        emitConstructor();</span></span>
<span class="line"><span>        emitInvoke();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Additional attributes (none)</span></span>
<span class="line"><span>        asm.emitShort(S0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Load class</span></span>
<span class="line"><span>        vec.trim();</span></span>
<span class="line"><span>        final byte[] bytes = vec.getData();</span></span>
<span class="line"><span>        // Note: the class loader is the only thing that really matters</span></span>
<span class="line"><span>        // here -- it&#39;s important to get the generated code into the</span></span>
<span class="line"><span>        // same namespace as the target class. Since the generated code</span></span>
<span class="line"><span>        // is privileged anyway, the protection domain probably doesn&#39;t</span></span>
<span class="line"><span>        // matter.</span></span>
<span class="line"><span>        return AccessController.doPrivileged(</span></span>
<span class="line"><span>            new PrivilegedAction&lt;MagicAccessorImpl&gt;() {</span></span>
<span class="line"><span>                public MagicAccessorImpl run() {</span></span>
<span class="line"><span>                        try {</span></span>
<span class="line"><span>                        return (MagicAccessorImpl)</span></span>
<span class="line"><span>                        ClassDefiner.defineClass</span></span>
<span class="line"><span>                                (generatedName,</span></span>
<span class="line"><span>                                 bytes,</span></span>
<span class="line"><span>                                 0,</span></span>
<span class="line"><span>                                 bytes.length,</span></span>
<span class="line"><span>                                 declaringClass.getClassLoader()).newInstance();</span></span>
<span class="line"><span>                        } catch (InstantiationException | IllegalAccessException e) {</span></span>
<span class="line"><span>                            throw new InternalError(e);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>咱们主要看这一句：<code>ClassDefiner.defineClass(xx, declaringClass.getClassLoader()).newInstance()</code>;</p><p>在<code>ClassDefiner.defineClass</code>方法实现中，每被调用一次都会生成一个DelegatingClassLoader类加载器对象 ，这里每次都生成新的类加载器，是为了性能考虑，在某些情况下可以卸载这些生成的类，因为类的卸载是只有在类加载器可以被回收的情况下才会被回收的，如果用了原来的类加载器，那可能导致这些新创建的类一直无法被卸载。</p><p>而反射生成的类，有时候可能用了就可以卸载了，所以使用其独立的类加载器，从而使得更容易控制反射类的生命周期。</p><h3 id="反射调用流程小结" tabindex="-1">反射调用流程小结 <a class="header-anchor" href="#反射调用流程小结" aria-label="Permalink to &quot;反射调用流程小结&quot;">​</a></h3><p>最后，用几句话总结反射的实现原理：</p><ol><li><p>反射类及反射方法的获取，都是通过从列表中搜寻查找匹配的方法，所以查找性能会随类的大小方法多少而变化；</p></li><li><p>每个类都会有一个与之对应的Class实例，从而每个类都可以获取method反射方法，并作用到其他实例身上；</p></li><li><p>反射也是考虑了线程安全的，放心使用；</p></li><li><p>反射使用软引用relectionData缓存class信息，避免每次重新从jvm获取带来的开销；</p></li><li><p>反射调用多次生成新代理Accessor, 而通过字节码生存的则考虑了卸载功能，所以会使用独立的类加载器；</p></li><li><p>当找到需要的方法，都会copy一份出来，而不是使用原来的实例，从而保证数据隔离；</p></li><li><p>调度反射方法，最终是由jvm执行invoke0()执行；</p></li></ol><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.codercto.com/a/46094.html" target="_blank" rel="noreferrer">https://www.codercto.com/a/46094.html</a></li><li><a href="https://blog.csdn.net/sinat%5C_38259539/article/details/71799078" target="_blank" rel="noreferrer">https://blog.csdn.net/sinat\\_38259539/article/details/71799078</a></li><li><a href="https://blog.csdn.net/qq%5C_40896997/article/details/94483820" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_40896997/article/details/94483820</a></li><li><a href="https://www.cnblogs.com/zhaoguhong/p/6937364.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/zhaoguhong/p/6937364.html</a></li><li><a href="https://juejin.im/post/5c160420e51d452a60684431" target="_blank" rel="noreferrer">https://juejin.im/post/5c160420e51d452a60684431</a></li><li><a href="https://blog.csdn.net/mcryeasy/java/article/details/52344729" target="_blank" rel="noreferrer">https://blog.csdn.net/mcryeasy/java/article/details/52344729</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,148)]))}const v=p(c,[["render",o]]);export{C as __pageData,v as default};
