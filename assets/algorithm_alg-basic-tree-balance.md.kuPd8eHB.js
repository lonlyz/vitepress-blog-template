import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-tree-avl-1.jpg",t="/vitepress-blog-template/images/alg/alg-tree-avl-0.png",i="/vitepress-blog-template/images/alg/alg-tree-avl-2.jpg",r="/vitepress-blog-template/images/alg/alg-tree-avl-3.jpg",c="/vitepress-blog-template/images/alg/alg-tree-avl-4.jpg",o="/vitepress-blog-template/images/alg/alg-tree-avl-5.jpg",g="/vitepress-blog-template/images/alg/alg-tree-avl-6.jpg",h="/vitepress-blog-template/images/alg/alg-tree-avl-7.jpg",u="/vitepress-blog-template/images/alg/alg-tree-avl-test-1.jpg",d="/vitepress-blog-template/images/alg/alg-tree-avl-test-2.jpg",m="/vitepress-blog-template/images/alg/alg-tree-avl-test-3.jpg",L="/vitepress-blog-template/images/alg/alg-tree-avl-test-4.jpg",k="/vitepress-blog-template/images/alg/alg-tree-avl-test-5.jpg",f="/vitepress-blog-template/images/alg/alg-tree-avl-test-6.jpg",q="/vitepress-blog-template/images/alg/alg-tree-avl-test-7.jpg",T="/vitepress-blog-template/images/alg/alg-tree-avl-test-8.jpg",A="/vitepress-blog-template/images/alg/alg-tree-avl-test-9.jpg",v="/vitepress-blog-template/images/alg/alg-tree-avl-test-10.jpg",V="/vitepress-blog-template/images/alg/alg-tree-avl-test-11.jpg",b="/vitepress-blog-template/images/alg/alg-tree-avl-test-12.jpg",R="/vitepress-blog-template/images/alg/alg-tree-avl-test-13.jpg",y="/vitepress-blog-template/images/alg/alg-tree-avl-test-14.jpg",x="/vitepress-blog-template/images/alg/alg-tree-avl-test-15.jpg",N="/vitepress-blog-template/images/alg/alg-tree-avl-test-16.jpg",_="/vitepress-blog-template/images/alg/alg-tree-avl-test-17.jpg",B=JSON.parse('{"title":"树 - 平衡二叉树(AVL)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-tree-balance.md","filePath":"algorithm/alg-basic-tree-balance.md","lastUpdated":1737706346000}'),C={name:"algorithm/alg-basic-tree-balance.md"};function S(j,s,P,E,O,z){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="树-平衡二叉树-avl" tabindex="-1">树 - 平衡二叉树(AVL) <a class="header-anchor" href="#树-平衡二叉树-avl" aria-label="Permalink to &quot;树 - 平衡二叉树(AVL)&quot;">​</a></h1><blockquote><p>平衡二叉树（Balanced Binary Tree）具有以下性质：它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。平衡二叉树的常用实现方法有红黑树、AVL、替罪羊树、Treap、伸展树等。 最小二叉平衡树的节点的公式如下 F(n)=F(n-1)+F(n-2)+1 这个类似于一个递归的数列，可以参考Fibonacci数列，1是根节点，F(n-1)是左子树的节点数量，F(n-2)是右子树的节点数量。@pdai</p></blockquote><h2 id="什么是avl树" tabindex="-1">什么是AVL树 <a class="header-anchor" href="#什么是avl树" aria-label="Permalink to &quot;什么是AVL树&quot;">​</a></h2><p>AVL树是高度平衡的二叉树。它的特点是: AVL树中任何节点的两个子树的高度最大差别为1。</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>上面的两张图片，左边的是AVL树，它的任何节点的两个子树的高度差别都&lt;=1；而右边的不是AVL树，因为7的两颗子树的高度相差为2(以2为根节点的树的高度是3，而以8为根节点的树的高度是1)。</p><blockquote><p>动画效果请参考 <a href="https://www.cs.usfca.edu/~galles/visualization/AVLtree.html" target="_blank" rel="noreferrer">AVL Tree在新窗口打开</a></p></blockquote><p><img src="'+t+`" alt="error.图片加载失败"></p><h2 id="avl树的实现" tabindex="-1">AVL树的实现 <a class="header-anchor" href="#avl树的实现" aria-label="Permalink to &quot;AVL树的实现&quot;">​</a></h2><h3 id="节点" tabindex="-1">节点 <a class="header-anchor" href="#节点" aria-label="Permalink to &quot;节点&quot;">​</a></h3><h4 id="节点定义" tabindex="-1">节点定义 <a class="header-anchor" href="#节点定义" aria-label="Permalink to &quot;节点定义&quot;">​</a></h4><p>AVLTree是AVL树对应的类，而AVLTreeNode是AVL树节点，它是AVLTree的内部类。AVLTree包含了AVL树的根节点，AVL树的基本操作也定义在AVL树中。AVLTreeNode包括的几个组成对象:</p><ul><li>key -- 是关键字，是用来对AVL树的节点进行排序的。</li><li>left -- 是左孩子。</li><li>right -- 是右孩子。</li><li>height -- 是高度。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AVLTree&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; mRoot;    // 根结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // AVL树的节点(内部类)</span></span>
<span class="line"><span>    class AVLTreeNode&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>        T key;                // 关键字(键值)</span></span>
<span class="line"><span>        int height;         // 高度</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; left;    // 左孩子</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; right;    // 右孩子</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public AVLTreeNode(T key, AVLTreeNode&lt;T&gt; left, AVLTreeNode&lt;T&gt; right) {</span></span>
<span class="line"><span>            this.key = key;</span></span>
<span class="line"><span>            this.left = left;</span></span>
<span class="line"><span>            this.right = right;</span></span>
<span class="line"><span>            this.height = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="树的高度" tabindex="-1">树的高度 <a class="header-anchor" href="#树的高度" aria-label="Permalink to &quot;树的高度&quot;">​</a></h4><p>关于高度，有的地方将&quot;空二叉树的高度是-1&quot;，而本文采用维基百科上的定义: 树的高度为最大层次。即空的二叉树的高度是0，非空树的高度等于它的最大层次(根的层次为1，根的子节点为第2层，依次类推)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * 获取树的高度</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private int height(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if (tree != null)</span></span>
<span class="line"><span>        return tree.height;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int height() {</span></span>
<span class="line"><span>    return height(mRoot);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="比较大小" tabindex="-1">比较大小 <a class="header-anchor" href="#比较大小" aria-label="Permalink to &quot;比较大小&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * 比较两个值的大小</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private int max(int a, int b) {</span></span>
<span class="line"><span>    return a&gt;b ? a : b;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="旋转" tabindex="-1">旋转 <a class="header-anchor" href="#旋转" aria-label="Permalink to &quot;旋转&quot;">​</a></h3><p>如果在AVL树中进行插入或删除节点后，可能导致AVL树失去平衡。这种失去平衡的可以概括为4种姿态: LL(左左)，LR(左右)，RR(右右)和RL(右左)。下面给出它们的示意图:</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>上图中的4棵树都是&quot;失去平衡的AVL树&quot;，从左往右的情况依次是: LL、LR、RL、RR。除了上面的情况之外，还有其它的失去平衡的AVL树，如下图:</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>上面的两张图都是为了便于理解，而列举的关于&quot;失去平衡的AVL树&quot;的例子。总的来说，AVL树失去平衡时的情况一定是LL、LR、RL、RR这4种之一，它们都由各自的定义:</p><p>(1) LL: LeftLeft，也称为&quot;左左&quot;。插入或删除一个节点后，根节点的左子树的左子树还有非空子节点，导致&quot;根的左子树的高度&quot;比&quot;根的右子树的高度&quot;大2，导致AVL树失去了平衡。 例如，在上面LL情况中，由于&quot;根节点(8)的左子树(4)的左子树(2)还有非空子节点&quot;，而&quot;根节点(8)的右子树(12)没有子节点&quot;；导致&quot;根节点(8)的左子树(4)高度&quot;比&quot;根节点(8)的右子树(12)&quot;高2。</p><p>(2) LR: LeftRight，也称为&quot;左右&quot;。插入或删除一个节点后，根节点的左子树的右子树还有非空子节点，导致&quot;根的左子树的高度&quot;比&quot;根的右子树的高度&quot;大2，导致AVL树失去了平衡。 例如，在上面LR情况中，由于&quot;根节点(8)的左子树(4)的左子树(6)还有非空子节点&quot;，而&quot;根节点(8)的右子树(12)没有子节点&quot;；导致&quot;根节点(8)的左子树(4)高度&quot;比&quot;根节点(8)的右子树(12)&quot;高2。</p><p>(3) RL: RightLeft，称为&quot;右左&quot;。插入或删除一个节点后，根节点的右子树的左子树还有非空子节点，导致&quot;根的右子树的高度&quot;比&quot;根的左子树的高度&quot;大2，导致AVL树失去了平衡。 例如，在上面RL情况中，由于&quot;根节点(8)的右子树(12)的左子树(10)还有非空子节点&quot;，而&quot;根节点(8)的左子树(4)没有子节点&quot;；导致&quot;根节点(8)的右子树(12)高度&quot;比&quot;根节点(8)的左子树(4)&quot;高2。</p><p>(4) RR: RightRight，称为&quot;右右&quot;。插入或删除一个节点后，根节点的右子树的右子树还有非空子节点，导致&quot;根的右子树的高度&quot;比&quot;根的左子树的高度&quot;大2，导致AVL树失去了平衡。 例如，在上面RR情况中，由于&quot;根节点(8)的右子树(12)的右子树(14)还有非空子节点&quot;，而&quot;根节点(8)的左子树(4)没有子节点&quot;；导致&quot;根节点(8)的右子树(12)高度&quot;比&quot;根节点(8)的左子树(4)&quot;高2。</p><p>如果在AVL树中进行插入或删除节点后，可能导致AVL树失去平衡。AVL失去平衡之后，可以通过旋转使其恢复平衡，下面分别介绍&quot;LL(左左)，LR(左右)，RR(右右)和RL(右左)&quot;这4种情况对应的旋转方法。</p><h4 id="ll的旋转" tabindex="-1">LL的旋转 <a class="header-anchor" href="#ll的旋转" aria-label="Permalink to &quot;LL的旋转&quot;">​</a></h4><p>LL失去平衡的情况，可以通过一次旋转让AVL树恢复平衡。如下图:</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>图中左边是旋转之前的树，右边是旋转之后的树。从中可以发现，旋转之后的树又变成了AVL树，而且该旋转只需要一次即可完成。 对于LL旋转，你可以这样理解为: LL旋转是围绕&quot;失去平衡的AVL根节点&quot;进行的，也就是节点k2；而且由于是LL情况，即左左情况，就用手抓着&quot;左孩子，即k1&quot;使劲摇。将k1变成根节点，k2变成k1的右子树，&quot;k1的右子树&quot;变成&quot;k2的左子树&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * LL: 左左对应的情况(左单旋转)。</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 返回值: 旋转后的根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; leftLeftRotation(AVLTreeNode&lt;T&gt; k2) {</span></span>
<span class="line"><span>    AVLTreeNode&lt;T&gt; k1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    k1 = k2.left;</span></span>
<span class="line"><span>    k2.left = k1.right;</span></span>
<span class="line"><span>    k1.right = k2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    k2.height = max( height(k2.left), height(k2.right)) + 1;</span></span>
<span class="line"><span>    k1.height = max( height(k1.left), k2.height) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return k1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="rr的旋转" tabindex="-1">RR的旋转 <a class="header-anchor" href="#rr的旋转" aria-label="Permalink to &quot;RR的旋转&quot;">​</a></h4><p>理解了LL之后，RR就相当容易理解了。RR是与LL对称的情况！RR恢复平衡的旋转方法如下:</p><p><img src="`+o+`" alt="error.图片加载失败"></p><p>图中左边是旋转之前的树，右边是旋转之后的树。RR旋转也只需要一次即可完成。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * RR: 右右对应的情况(右单旋转)。</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 返回值: 旋转后的根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; rightRightRotation(AVLTreeNode&lt;T&gt; k1) {</span></span>
<span class="line"><span>    AVLTreeNode&lt;T&gt; k2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    k2 = k1.right;</span></span>
<span class="line"><span>    k1.right = k2.left;</span></span>
<span class="line"><span>    k2.left = k1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    k1.height = max( height(k1.left), height(k1.right)) + 1;</span></span>
<span class="line"><span>    k2.height = max( height(k2.right), k1.height) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return k2;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="lr的旋转" tabindex="-1">LR的旋转 <a class="header-anchor" href="#lr的旋转" aria-label="Permalink to &quot;LR的旋转&quot;">​</a></h4><p>LR失去平衡的情况，需要经过两次旋转才能让AVL树恢复平衡。如下图:</p><p><img src="`+g+`" alt="error.图片加载失败"></p><p>第一次旋转是围绕&quot;k1&quot;进行的&quot;RR旋转&quot;，第二次是围绕&quot;k3&quot;进行的&quot;LL旋转&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * LR: 左右对应的情况(左双旋转)。</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 返回值: 旋转后的根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; leftRightRotation(AVLTreeNode&lt;T&gt; k3) {</span></span>
<span class="line"><span>    k3.left = rightRightRotation(k3.left);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return leftLeftRotation(k3);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="rl的旋转" tabindex="-1">RL的旋转 <a class="header-anchor" href="#rl的旋转" aria-label="Permalink to &quot;RL的旋转&quot;">​</a></h4><p>RL是与LR的对称情况！RL恢复平衡的旋转方法如下:</p><p><img src="`+h+`" alt="error.图片加载失败"></p><p>第一次旋转是围绕&quot;k3&quot;进行的&quot;LL旋转&quot;，第二次是围绕&quot;k1&quot;进行的&quot;RR旋转&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * RL: 右左对应的情况(右双旋转)。</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 返回值: 旋转后的根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; rightLeftRotation(AVLTreeNode&lt;T&gt; k1) {</span></span>
<span class="line"><span>    k1.right = leftLeftRotation(k1.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return rightRightRotation(k1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="插入" tabindex="-1">插入 <a class="header-anchor" href="#插入" aria-label="Permalink to &quot;插入&quot;">​</a></h3><p>插入节点的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 将结点插入到AVL树中，并返回根节点</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     tree AVL树的根结点</span></span>
<span class="line"><span> *     key 插入的结点的键值</span></span>
<span class="line"><span> * 返回值: </span></span>
<span class="line"><span> *     根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; insert(AVLTreeNode&lt;T&gt; tree, T key) {</span></span>
<span class="line"><span>    if (tree == null) {</span></span>
<span class="line"><span>        // 新建节点</span></span>
<span class="line"><span>        tree = new AVLTreeNode&lt;T&gt;(key, null, null);</span></span>
<span class="line"><span>        if (tree==null) {</span></span>
<span class="line"><span>            System.out.println(&quot;ERROR: create avltree node failed!&quot;);</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        int cmp = key.compareTo(tree.key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>           if (cmp &lt; 0) {    // 应该将key插入到&quot;tree的左子树&quot;的情况</span></span>
<span class="line"><span>            tree.left = insert(tree.left, key);</span></span>
<span class="line"><span>            // 插入节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>            if (height(tree.left) - height(tree.right) == 2) {</span></span>
<span class="line"><span>                if (key.compareTo(tree.left.key) &lt; 0)</span></span>
<span class="line"><span>                    tree = leftLeftRotation(tree);</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    tree = leftRightRotation(tree);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if (cmp &gt; 0) {    // 应该将key插入到&quot;tree的右子树&quot;的情况</span></span>
<span class="line"><span>            tree.right = insert(tree.right, key);</span></span>
<span class="line"><span>            // 插入节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>            if (height(tree.right) - height(tree.left) == 2) {</span></span>
<span class="line"><span>                if (key.compareTo(tree.right.key) &gt; 0)</span></span>
<span class="line"><span>                    tree = rightRightRotation(tree);</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    tree = rightLeftRotation(tree);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {    // cmp==0</span></span>
<span class="line"><span>            System.out.println(&quot;添加失败: 不允许添加相同的节点！&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tree.height = max( height(tree.left), height(tree.right)) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return tree;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void insert(T key) {</span></span>
<span class="line"><span>    mRoot = insert(mRoot, key);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="删除" tabindex="-1">删除 <a class="header-anchor" href="#删除" aria-label="Permalink to &quot;删除&quot;">​</a></h3><p>删除节点的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 删除结点(z)，返回根节点</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     tree AVL树的根结点</span></span>
<span class="line"><span> *     z 待删除的结点</span></span>
<span class="line"><span> * 返回值: </span></span>
<span class="line"><span> *     根节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private AVLTreeNode&lt;T&gt; remove(AVLTreeNode&lt;T&gt; tree, AVLTreeNode&lt;T&gt; z) {</span></span>
<span class="line"><span>    // 根为空 或者 没有要删除的节点，直接返回null。</span></span>
<span class="line"><span>    if (tree==null || z==null)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int cmp = z.key.compareTo(tree.key);</span></span>
<span class="line"><span>    if (cmp &lt; 0) {        // 待删除的节点在&quot;tree的左子树&quot;中</span></span>
<span class="line"><span>        tree.left = remove(tree.left, z);</span></span>
<span class="line"><span>        // 删除节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>        if (height(tree.right) - height(tree.left) == 2) {</span></span>
<span class="line"><span>            AVLTreeNode&lt;T&gt; r =  tree.right;</span></span>
<span class="line"><span>            if (height(r.left) &gt; height(r.right))</span></span>
<span class="line"><span>                tree = rightLeftRotation(tree);</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                tree = rightRightRotation(tree);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else if (cmp &gt; 0) {    // 待删除的节点在&quot;tree的右子树&quot;中</span></span>
<span class="line"><span>        tree.right = remove(tree.right, z);</span></span>
<span class="line"><span>        // 删除节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>        if (height(tree.left) - height(tree.right) == 2) {</span></span>
<span class="line"><span>            AVLTreeNode&lt;T&gt; l =  tree.left;</span></span>
<span class="line"><span>            if (height(l.right) &gt; height(l.left))</span></span>
<span class="line"><span>                tree = leftRightRotation(tree);</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                tree = leftLeftRotation(tree);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {    // tree是对应要删除的节点。</span></span>
<span class="line"><span>        // tree的左右孩子都非空</span></span>
<span class="line"><span>        if ((tree.left!=null) &amp;&amp; (tree.right!=null)) {</span></span>
<span class="line"><span>            if (height(tree.left) &gt; height(tree.right)) {</span></span>
<span class="line"><span>                // 如果tree的左子树比右子树高；</span></span>
<span class="line"><span>                // 则(01)找出tree的左子树中的最大节点</span></span>
<span class="line"><span>                //   (02)将该最大节点的值赋值给tree。</span></span>
<span class="line"><span>                //   (03)删除该最大节点。</span></span>
<span class="line"><span>                // 这类似于用&quot;tree的左子树中最大节点&quot;做&quot;tree&quot;的替身；</span></span>
<span class="line"><span>                // 采用这种方式的好处是: 删除&quot;tree的左子树中最大节点&quot;之后，AVL树仍然是平衡的。</span></span>
<span class="line"><span>                AVLTreeNode&lt;T&gt; max = maximum(tree.left);</span></span>
<span class="line"><span>                tree.key = max.key;</span></span>
<span class="line"><span>                tree.left = remove(tree.left, max);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                // 如果tree的左子树不比右子树高(即它们相等，或右子树比左子树高1)</span></span>
<span class="line"><span>                // 则(01)找出tree的右子树中的最小节点</span></span>
<span class="line"><span>                //   (02)将该最小节点的值赋值给tree。</span></span>
<span class="line"><span>                //   (03)删除该最小节点。</span></span>
<span class="line"><span>                // 这类似于用&quot;tree的右子树中最小节点&quot;做&quot;tree&quot;的替身；</span></span>
<span class="line"><span>                // 采用这种方式的好处是: 删除&quot;tree的右子树中最小节点&quot;之后，AVL树仍然是平衡的。</span></span>
<span class="line"><span>                AVLTreeNode&lt;T&gt; min = maximum(tree.right);</span></span>
<span class="line"><span>                tree.key = min.key;</span></span>
<span class="line"><span>                tree.right = remove(tree.right, min);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            AVLTreeNode&lt;T&gt; tmp = tree;</span></span>
<span class="line"><span>            tree = (tree.left!=null) ? tree.left : tree.right;</span></span>
<span class="line"><span>            tmp = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return tree;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void remove(T key) {</span></span>
<span class="line"><span>    AVLTreeNode&lt;T&gt; z; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((z = search(mRoot, key)) != null)</span></span>
<span class="line"><span>        mRoot = remove(mRoot, z);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="avl树测试" tabindex="-1">AVL树测试 <a class="header-anchor" href="#avl树测试" aria-label="Permalink to &quot;AVL树测试&quot;">​</a></h2><ol><li><p>新建AVL树</p></li><li><p>依次添加&quot;3,2,1,4,5,6,7,16,15,14,13,12,11,10,8,9&quot; 到AVL树中。</p></li></ol><p>2.01 添加3,2 添加3,2都不会破坏AVL树的平衡性。</p><p><img src="`+u+'" alt="error.图片加载失败"></p><p>2.02 添加1 添加1之后，AVL树失去平衡(LL)，此时需要对AVL树进行旋转(LL旋转)。旋转过程如下:</p><p><img src="'+d+'" alt="error.图片加载失败"></p><p>2.03 添加4 添加4不会破坏AVL树的平衡性。</p><p><img src="'+m+'" alt="error.图片加载失败"></p><p>2.04 添加5 添加5之后，AVL树失去平衡(RR)，此时需要对AVL树进行旋转(RR旋转)。旋转过程如下:</p><p><img src="'+L+'" alt="error.图片加载失败"></p><p>2.05 添加6 添加6之后，AVL树失去平衡(RR)，此时需要对AVL树进行旋转(RR旋转)。旋转过程如下:</p><p><img src="'+k+'" alt="error.图片加载失败"></p><p>2.06 添加7 添加7之后，AVL树失去平衡(RR)，此时需要对AVL树进行旋转(RR旋转)。旋转过程如下:</p><p><img src="'+f+'" alt="error.图片加载失败"></p><p>2.07 添加16 添加16不会破坏AVL树的平衡性。</p><p><img src="'+q+'" alt="error.图片加载失败"></p><p>2.08 添加15 添加15之后，AVL树失去平衡(RR)，此时需要对AVL树进行旋转(RR旋转)。旋转过程如下:</p><p><img src="'+T+'" alt="error.图片加载失败"></p><p>2.09 添加14 添加14之后，AVL树失去平衡(RL)，此时需要对AVL树进行旋转(RL旋转)。旋转过程如下:</p><p><img src="'+A+'" alt="error.图片加载失败"></p><p>2.10 添加13 添加13之后，AVL树失去平衡(RR)，此时需要对AVL树进行旋转(RR旋转)。旋转过程如下</p><p><img src="'+v+'" alt="error.图片加载失败"></p><p>2.11 添加12 添加12之后，AVL树失去平衡(LL)，此时需要对AVL树进行旋转(LL旋转)。旋转过程如下:</p><p><img src="'+V+'" alt="error.图片加载失败"></p><p>2.12 添加11 添加11之后，AVL树失去平衡(LL)，此时需要对AVL树进行旋转(LL旋转)。旋转过程如下:</p><p><img src="'+b+'" alt="error.图片加载失败"></p><p>2.13 添加10 添加10之后，AVL树失去平衡(LL)，此时需要对AVL树进行旋转(LL旋转)。旋转过程如下:</p><p><img src="'+R+'" alt="error.图片加载失败"></p><p>2.14 添加8 添加8不会破坏AVL树的平衡性。</p><p><img src="'+y+'" alt="error.图片加载失败"></p><p>2.15 添加9 但是添加9之后，AVL树失去平衡(LR)，此时需要对AVL树进行旋转(LR旋转)。旋转过程如下:</p><p><img src="'+x+'" alt="error.图片加载失败"></p><ol start="3"><li>打印树的信息</li></ol><p>输出下面树的信息:</p><p><img src="'+N+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>前序遍历: 7 4 2 1 3 6 5 13 11 9 8 10 12 15 14 16 </span></span>
<span class="line"><span>中序遍历: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 </span></span>
<span class="line"><span>后序遍历: 1 3 2 5 6 4 8 10 9 12 11 14 16 15 13 7 </span></span>
<span class="line"><span>高度: 5</span></span>
<span class="line"><span>最小值: 1</span></span>
<span class="line"><span>最大值: 16</span></span></code></pre></div><ol start="4"><li>删除节点8</li></ol><p>删除操作并不会造成AVL树的不平衡。</p><p><img src="`+_+`" alt="error.图片加载失败"></p><p>删除节点8之后，再打印该AVL树的信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>高度: 5</span></span>
<span class="line"><span>中序遍历: 1 2 3 4 5 6 7 9 10 11 12 13 14 15 16</span></span></code></pre></div><h2 id="完整实现和测试的代码" tabindex="-1">完整实现和测试的代码 <a class="header-anchor" href="#完整实现和测试的代码" aria-label="Permalink to &quot;完整实现和测试的代码&quot;">​</a></h2><h3 id="avl-完整实现代码" tabindex="-1">AVL 完整实现代码 <a class="header-anchor" href="#avl-完整实现代码" aria-label="Permalink to &quot;AVL 完整实现代码&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Java 语言: AVL树</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2013/11/07</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class AVLTree&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; mRoot;    // 根结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // AVL树的节点(内部类)</span></span>
<span class="line"><span>    class AVLTreeNode&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>        T key;                // 关键字(键值)</span></span>
<span class="line"><span>        int height;         // 高度</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; left;    // 左孩子</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; right;    // 右孩子</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public AVLTreeNode(T key, AVLTreeNode&lt;T&gt; left, AVLTreeNode&lt;T&gt; right) {</span></span>
<span class="line"><span>            this.key = key;</span></span>
<span class="line"><span>            this.left = left;</span></span>
<span class="line"><span>            this.right = right;</span></span>
<span class="line"><span>            this.height = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    public AVLTree() {</span></span>
<span class="line"><span>        mRoot = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 获取树的高度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int height(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree != null)</span></span>
<span class="line"><span>            return tree.height;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int height() {</span></span>
<span class="line"><span>        return height(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 比较两个值的大小</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int max(int a, int b) {</span></span>
<span class="line"><span>        return a&gt;b ? a : b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 前序遍历&quot;AVL树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void preOrder(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>            preOrder(tree.left);</span></span>
<span class="line"><span>            preOrder(tree.right);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void preOrder() {</span></span>
<span class="line"><span>        preOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 中序遍历&quot;AVL树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void inOrder(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            inOrder(tree.left);</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>            inOrder(tree.right);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void inOrder() {</span></span>
<span class="line"><span>        inOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 后序遍历&quot;AVL树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void postOrder(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span>            postOrder(tree.left);</span></span>
<span class="line"><span>            postOrder(tree.right);</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void postOrder() {</span></span>
<span class="line"><span>        postOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * (递归实现)查找&quot;AVL树x&quot;中键值为key的节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; search(AVLTreeNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>        if (x==null)</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0)</span></span>
<span class="line"><span>            return search(x.left, key);</span></span>
<span class="line"><span>        else if (cmp &gt; 0)</span></span>
<span class="line"><span>            return search(x.right, key);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AVLTreeNode&lt;T&gt; search(T key) {</span></span>
<span class="line"><span>        return search(mRoot, key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * (非递归实现)查找&quot;AVL树x&quot;中键值为key的节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; iterativeSearch(AVLTreeNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>        while (x!=null) {</span></span>
<span class="line"><span>            int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (cmp &lt; 0)</span></span>
<span class="line"><span>                x = x.left;</span></span>
<span class="line"><span>            else if (cmp &gt; 0)</span></span>
<span class="line"><span>                x = x.right;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                return x;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AVLTreeNode&lt;T&gt; iterativeSearch(T key) {</span></span>
<span class="line"><span>        return iterativeSearch(mRoot, key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 查找最小结点: 返回tree为根结点的AVL树的最小结点。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; minimum(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree == null)</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(tree.left != null)</span></span>
<span class="line"><span>            tree = tree.left;</span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T minimum() {</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; p = minimum(mRoot);</span></span>
<span class="line"><span>        if (p != null)</span></span>
<span class="line"><span>            return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 查找最大结点: 返回tree为根结点的AVL树的最大结点。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; maximum(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree == null)</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(tree.right != null)</span></span>
<span class="line"><span>            tree = tree.right;</span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T maximum() {</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; p = maximum(mRoot);</span></span>
<span class="line"><span>        if (p != null)</span></span>
<span class="line"><span>            return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * LL: 左左对应的情况(左单旋转)。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 返回值: 旋转后的根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; leftLeftRotation(AVLTreeNode&lt;T&gt; k2) {</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; k1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        k1 = k2.left;</span></span>
<span class="line"><span>        k2.left = k1.right;</span></span>
<span class="line"><span>        k1.right = k2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        k2.height = max( height(k2.left), height(k2.right)) + 1;</span></span>
<span class="line"><span>        k1.height = max( height(k1.left), k2.height) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return k1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * RR: 右右对应的情况(右单旋转)。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 返回值: 旋转后的根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; rightRightRotation(AVLTreeNode&lt;T&gt; k1) {</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; k2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        k2 = k1.right;</span></span>
<span class="line"><span>        k1.right = k2.left;</span></span>
<span class="line"><span>        k2.left = k1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        k1.height = max( height(k1.left), height(k1.right)) + 1;</span></span>
<span class="line"><span>        k2.height = max( height(k2.right), k1.height) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return k2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * LR: 左右对应的情况(左双旋转)。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 返回值: 旋转后的根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; leftRightRotation(AVLTreeNode&lt;T&gt; k3) {</span></span>
<span class="line"><span>        k3.left = rightRightRotation(k3.left);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return leftLeftRotation(k3);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * RL: 右左对应的情况(右双旋转)。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 返回值: 旋转后的根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; rightLeftRotation(AVLTreeNode&lt;T&gt; k1) {</span></span>
<span class="line"><span>        k1.right = leftLeftRotation(k1.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return rightRightRotation(k1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 将结点插入到AVL树中，并返回根节点</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     tree AVL树的根结点</span></span>
<span class="line"><span>     *     key 插入的结点的键值</span></span>
<span class="line"><span>     * 返回值: </span></span>
<span class="line"><span>     *     根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; insert(AVLTreeNode&lt;T&gt; tree, T key) {</span></span>
<span class="line"><span>        if (tree == null) {</span></span>
<span class="line"><span>            // 新建节点</span></span>
<span class="line"><span>            tree = new AVLTreeNode&lt;T&gt;(key, null, null);</span></span>
<span class="line"><span>            if (tree==null) {</span></span>
<span class="line"><span>                System.out.println(&quot;ERROR: create avltree node failed!&quot;);</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            int cmp = key.compareTo(tree.key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>               if (cmp &lt; 0) {    // 应该将key插入到&quot;tree的左子树&quot;的情况</span></span>
<span class="line"><span>                tree.left = insert(tree.left, key);</span></span>
<span class="line"><span>                // 插入节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>                if (height(tree.left) - height(tree.right) == 2) {</span></span>
<span class="line"><span>                    if (key.compareTo(tree.left.key) &lt; 0)</span></span>
<span class="line"><span>                        tree = leftLeftRotation(tree);</span></span>
<span class="line"><span>                    else</span></span>
<span class="line"><span>                        tree = leftRightRotation(tree);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else if (cmp &gt; 0) {    // 应该将key插入到&quot;tree的右子树&quot;的情况</span></span>
<span class="line"><span>                tree.right = insert(tree.right, key);</span></span>
<span class="line"><span>                // 插入节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>                if (height(tree.right) - height(tree.left) == 2) {</span></span>
<span class="line"><span>                    if (key.compareTo(tree.right.key) &gt; 0)</span></span>
<span class="line"><span>                        tree = rightRightRotation(tree);</span></span>
<span class="line"><span>                    else</span></span>
<span class="line"><span>                        tree = rightLeftRotation(tree);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else {    // cmp==0</span></span>
<span class="line"><span>                System.out.println(&quot;添加失败: 不允许添加相同的节点！&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        tree.height = max( height(tree.left), height(tree.right)) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void insert(T key) {</span></span>
<span class="line"><span>        mRoot = insert(mRoot, key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 删除结点(z)，返回根节点</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     tree AVL树的根结点</span></span>
<span class="line"><span>     *     z 待删除的结点</span></span>
<span class="line"><span>     * 返回值: </span></span>
<span class="line"><span>     *     根节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private AVLTreeNode&lt;T&gt; remove(AVLTreeNode&lt;T&gt; tree, AVLTreeNode&lt;T&gt; z) {</span></span>
<span class="line"><span>        // 根为空 或者 没有要删除的节点，直接返回null。</span></span>
<span class="line"><span>        if (tree==null || z==null)</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int cmp = z.key.compareTo(tree.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0) {        // 待删除的节点在&quot;tree的左子树&quot;中</span></span>
<span class="line"><span>            tree.left = remove(tree.left, z);</span></span>
<span class="line"><span>            // 删除节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>            if (height(tree.right) - height(tree.left) == 2) {</span></span>
<span class="line"><span>                AVLTreeNode&lt;T&gt; r =  tree.right;</span></span>
<span class="line"><span>                if (height(r.left) &gt; height(r.right))</span></span>
<span class="line"><span>                    tree = rightLeftRotation(tree);</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    tree = rightRightRotation(tree);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if (cmp &gt; 0) {    // 待删除的节点在&quot;tree的右子树&quot;中</span></span>
<span class="line"><span>            tree.right = remove(tree.right, z);</span></span>
<span class="line"><span>            // 删除节点后，若AVL树失去平衡，则进行相应的调节。</span></span>
<span class="line"><span>            if (height(tree.left) - height(tree.right) == 2) {</span></span>
<span class="line"><span>                AVLTreeNode&lt;T&gt; l =  tree.left;</span></span>
<span class="line"><span>                if (height(l.right) &gt; height(l.left))</span></span>
<span class="line"><span>                    tree = leftRightRotation(tree);</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    tree = leftLeftRotation(tree);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {    // tree是对应要删除的节点。</span></span>
<span class="line"><span>            // tree的左右孩子都非空</span></span>
<span class="line"><span>            if ((tree.left!=null) &amp;&amp; (tree.right!=null)) {</span></span>
<span class="line"><span>                if (height(tree.left) &gt; height(tree.right)) {</span></span>
<span class="line"><span>                    // 如果tree的左子树比右子树高；</span></span>
<span class="line"><span>                    // 则(01)找出tree的左子树中的最大节点</span></span>
<span class="line"><span>                    //   (02)将该最大节点的值赋值给tree。</span></span>
<span class="line"><span>                    //   (03)删除该最大节点。</span></span>
<span class="line"><span>                    // 这类似于用&quot;tree的左子树中最大节点&quot;做&quot;tree&quot;的替身；</span></span>
<span class="line"><span>                    // 采用这种方式的好处是: 删除&quot;tree的左子树中最大节点&quot;之后，AVL树仍然是平衡的。</span></span>
<span class="line"><span>                    AVLTreeNode&lt;T&gt; max = maximum(tree.left);</span></span>
<span class="line"><span>                    tree.key = max.key;</span></span>
<span class="line"><span>                    tree.left = remove(tree.left, max);</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    // 如果tree的左子树不比右子树高(即它们相等，或右子树比左子树高1)</span></span>
<span class="line"><span>                    // 则(01)找出tree的右子树中的最小节点</span></span>
<span class="line"><span>                    //   (02)将该最小节点的值赋值给tree。</span></span>
<span class="line"><span>                    //   (03)删除该最小节点。</span></span>
<span class="line"><span>                    // 这类似于用&quot;tree的右子树中最小节点&quot;做&quot;tree&quot;的替身；</span></span>
<span class="line"><span>                    // 采用这种方式的好处是: 删除&quot;tree的右子树中最小节点&quot;之后，AVL树仍然是平衡的。</span></span>
<span class="line"><span>                    AVLTreeNode&lt;T&gt; min = minimum(tree.right);</span></span>
<span class="line"><span>                    tree.key = min.key;</span></span>
<span class="line"><span>                    tree.right = remove(tree.right, min);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                AVLTreeNode&lt;T&gt; tmp = tree;</span></span>
<span class="line"><span>                tree = (tree.left!=null) ? tree.left : tree.right;</span></span>
<span class="line"><span>                tmp = null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        tree.height = max(height(tree.left), height(tree.right)) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void remove(T key) {</span></span>
<span class="line"><span>        AVLTreeNode&lt;T&gt; z; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if ((z = search(mRoot, key)) != null)</span></span>
<span class="line"><span>            mRoot = remove(mRoot, z);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 销毁AVL树</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void destroy(AVLTreeNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree==null)</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (tree.left != null)</span></span>
<span class="line"><span>            destroy(tree.left);</span></span>
<span class="line"><span>        if (tree.right != null)</span></span>
<span class="line"><span>            destroy(tree.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        tree = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void destroy() {</span></span>
<span class="line"><span>        destroy(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印&quot;二叉查找树&quot;</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * key        -- 节点的键值 </span></span>
<span class="line"><span>     * direction  --  0，表示该节点是根节点;</span></span>
<span class="line"><span>     *               -1，表示该节点是它的父结点的左孩子;</span></span>
<span class="line"><span>     *                1，表示该节点是它的父结点的右孩子。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void print(AVLTreeNode&lt;T&gt; tree, T key, int direction) {</span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span>            if(direction==0)    // tree是根节点</span></span>
<span class="line"><span>                System.out.printf(&quot;%2d is root\\n&quot;, tree.key, key);</span></span>
<span class="line"><span>            else                // tree是分支节点</span></span>
<span class="line"><span>                System.out.printf(&quot;%2d is %2d&#39;s %6s child\\n&quot;, tree.key, key, direction==1?&quot;right&quot; : &quot;left&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            print(tree.left, tree.key, -1);</span></span>
<span class="line"><span>            print(tree.right,tree.key,  1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        if (mRoot != null)</span></span>
<span class="line"><span>            print(mRoot, mRoot.key, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="avl-完整测试代码" tabindex="-1">AVL 完整测试代码 <a class="header-anchor" href="#avl-完整测试代码" aria-label="Permalink to &quot;AVL 完整测试代码&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Java 语言: AVL树</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2013/11/07</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class AVLTreeTest {</span></span>
<span class="line"><span>    private static int arr[]= {3,2,1,4,5,6,7,16,15,14,13,12,11,10,8,9};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        AVLTree&lt;Integer&gt; tree = new AVLTree&lt;Integer&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;== 依次添加: &quot;);</span></span>
<span class="line"><span>        for(i=0; i&lt;arr.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, arr[i]);</span></span>
<span class="line"><span>            tree.insert(arr[i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 前序遍历: &quot;);</span></span>
<span class="line"><span>        tree.preOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 中序遍历: &quot;);</span></span>
<span class="line"><span>        tree.inOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 后序遍历: &quot;);</span></span>
<span class="line"><span>        tree.postOrder();</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;== 高度: %d\\n&quot;, tree.height());</span></span>
<span class="line"><span>        System.out.printf(&quot;== 最小值: %d\\n&quot;, tree.minimum());</span></span>
<span class="line"><span>        System.out.printf(&quot;== 最大值: %d\\n&quot;, tree.maximum());</span></span>
<span class="line"><span>        System.out.printf(&quot;== 树的详细信息: \\n&quot;);</span></span>
<span class="line"><span>        tree.print();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        i = 8;</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 删除根节点: %d&quot;, i);</span></span>
<span class="line"><span>        tree.remove(i);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 高度: %d&quot;, tree.height());</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 中序遍历: &quot;);</span></span>
<span class="line"><span>        tree.inOrder();</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n== 树的详细信息: \\n&quot;);</span></span>
<span class="line"><span>        tree.print();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 销毁二叉树</span></span>
<span class="line"><span>        tree.destroy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="测试结果" tabindex="-1">测试结果 <a class="header-anchor" href="#测试结果" aria-label="Permalink to &quot;测试结果&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>== 依次添加: 3 2 1 4 5 6 7 16 15 14 13 12 11 10 8 9 </span></span>
<span class="line"><span>== 前序遍历: 7 4 2 1 3 6 5 13 11 9 8 10 12 15 14 16 </span></span>
<span class="line"><span>== 中序遍历: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 </span></span>
<span class="line"><span>== 后序遍历: 1 3 2 5 6 4 8 10 9 12 11 14 16 15 13 7 </span></span>
<span class="line"><span>== 高度: 5</span></span>
<span class="line"><span>== 最小值: 1</span></span>
<span class="line"><span>== 最大值: 16</span></span>
<span class="line"><span>== 树的详细信息: </span></span>
<span class="line"><span> 7 is root</span></span>
<span class="line"><span> 4 is  7&#39;s   left child</span></span>
<span class="line"><span> 2 is  4&#39;s   left child</span></span>
<span class="line"><span> 1 is  2&#39;s   left child</span></span>
<span class="line"><span> 3 is  2&#39;s  right child</span></span>
<span class="line"><span> 6 is  4&#39;s  right child</span></span>
<span class="line"><span> 5 is  6&#39;s   left child</span></span>
<span class="line"><span>13 is  7&#39;s  right child</span></span>
<span class="line"><span>11 is 13&#39;s   left child</span></span>
<span class="line"><span> 9 is 11&#39;s   left child</span></span>
<span class="line"><span> 8 is  9&#39;s   left child</span></span>
<span class="line"><span>10 is  9&#39;s  right child</span></span>
<span class="line"><span>12 is 11&#39;s  right child</span></span>
<span class="line"><span>15 is 13&#39;s  right child</span></span>
<span class="line"><span>14 is 15&#39;s   left child</span></span>
<span class="line"><span>16 is 15&#39;s  right child</span></span>
<span class="line"><span></span></span>
<span class="line"><span>== 删除根节点: 8</span></span>
<span class="line"><span>== 高度: 5</span></span>
<span class="line"><span>== 中序遍历: 1 2 3 4 5 6 7 9 10 11 12 13 14 15 16 </span></span>
<span class="line"><span>== 树的详细信息: </span></span>
<span class="line"><span> 7 is root</span></span>
<span class="line"><span> 4 is  7&#39;s   left child</span></span>
<span class="line"><span> 2 is  4&#39;s   left child</span></span>
<span class="line"><span> 1 is  2&#39;s   left child</span></span>
<span class="line"><span> 3 is  2&#39;s  right child</span></span>
<span class="line"><span> 6 is  4&#39;s  right child</span></span>
<span class="line"><span> 5 is  6&#39;s   left child</span></span>
<span class="line"><span>13 is  7&#39;s  right child</span></span>
<span class="line"><span>11 is 13&#39;s   left child</span></span>
<span class="line"><span> 9 is 11&#39;s   left child</span></span>
<span class="line"><span>10 is  9&#39;s  right child</span></span>
<span class="line"><span>12 is 11&#39;s  right child</span></span>
<span class="line"><span>15 is 13&#39;s  right child</span></span>
<span class="line"><span>14 is 15&#39;s   left child</span></span>
<span class="line"><span>16 is 15&#39;s  right child</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><blockquote><p>本文主要来源于@skywang12345的<a href="https://www.cnblogs.com/skywang12345/p/3577479.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E9%87%8D%E6%96%B0%E7%BB%84%E7%BB%87%E5%92%8C%E5%A2%9E%E5%8A%A0%E4%BA%86%E5%86%85%E5%AE%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3577479.html，在此基础上重新组织和增加了内容。</a></p></blockquote><p>其它参考</p><p><a href="https://blog.csdn.net/m0%5C_37609579/article/details/99690222" target="_blank" rel="noreferrer">https://blog.csdn.net/m0\\_37609579/article/details/99690222</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,109)]))}const F=n(C,[["render",S]]);export{B as __pageData,F as default};
