# PandaCUT 熊猫切图

一个photoshop CC的javascript脚本,可以帮助任何被PS切图折磨的人
进行自动的,批量的,跨越图层的,自由的切图.


![image](https://github.com/menzi11/PandaCUT/blob/master/thePandaWhoCUT.png)


-------------------


## 为什么需要一个新的切图工具?

世界上有不少切图工具,但大部分是基于图层的切图,但事实上,我们经常会遇到
跨越多个图层的切图需求,例如从后向前ABC三个图层,PandaCUT可以实现先隐藏B图层,
打开A和C图层导出,再隐藏A图层,打开C和B图层导出.如此批量导出图片,几乎是全自动化!
你还可以设置无论怎么导出都不隐藏的图层,例如背景图层,曲线/亮度对比度调整图层.

> 本项目并不使用外部的工具,而是使用photoshop自带的javascript脚本功能,也就是说:
> + 你不需要安装photoshop之外的任何东西
> + 所有的第三方滤镜,素材什么的均可使用.
> + 完全由photoshop渲染,就如同手动导出一模一样,photoshop里什么样,导出就什么样. 
> + 性能? photoshop撑得住,PandaCUT就撑得住!

 > *如果你不熟悉javascript,或者不熟悉photoshop如何调用脚本,这都没关系,后文中我们会提到.*


---------------------------


##那么,如何安装呢?


如果你是个会用GIT的程序员,那么我想你可以直接看下一段了,如果是不熟悉GIT的朋友,
直接找到屏幕右边,点这里:

![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/0.png)


-------------------------


## 那么,如何使用呢?

** 下文示例中的所有图层元素均可在文件夹中的"example.psd"文件中找到! **


我们来假设一种情况,老板让我绘制一个按钮,于是我先画了一个按钮的底板:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/1.png)


看上去它是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/2.png)


然后,我又在它上面画了一个按钮:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/3.png)


在它上面,我写了一行字:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/4.png)


于是这个图看上去是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/5.png)


当然,有按钮抬起来,就有按下去,于是我又新建了两个图层,分别是按钮和按钮上的文字:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/6.png)


按钮按下去的状态是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/7.png)



###现在,我们需要导出它了!

首先，我们先需要创建一个组，这个组的位置需要在最外层，和背景同层，把这个组的名字改成“@PandaCUT_MASKS”，然后我们可以把需要截图的区域用一个矩形(矢量)来覆盖，给这个承载矢量矩形的图层创建起一个已@开头的名字（如@button1），就像这样:

![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/8.png)
![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/9.png)


我们给矢量矩形图层起的名字,被作为一个标示,任何在"@PandaCUT_MASKS"组以下的图层中,
一旦出现了名字中有@button1字样的图层,即会被导出在@button1图片中.无论这个图层的层叠状态如何,无论图层是矢量图层,文字图层,调整图层.


> *这个矢量图层中的图形基本上必须是矩形,其大小和位置则用来确定截图的大小和位置，这个矢量图层的其他属性则不重要，我们可以同时创建多个图层.*


在本例中,我们要导出两个元素,一个是button1,另一个是button1_down,那么,我们就这样写:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/10.png)


写好之后,点击photoshop上方菜单,执行PandaCUT!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/11.png)
![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/12.png)


点击PandaCUT后,你需要告诉它你想把图标导到哪里去,一个文件夹选框会弹出:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/13.png)


选择您想要的目录后,让熊猫来工作吧! 当它完成工作后,您将看到以下提示:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/14.png)


打开你刚才选定的文件夹,文件已经导好啦!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/15.png)


> 我们再来回顾一下: 

> 在photoshop里顺序点击 文件->脚本->浏览，然后选择你本机PandaCUT.jsx的路径，运行后会弹出文件夹选择框，选择一个你用来保存导出图片的文件夹，然后等程序提示运行完成就可以了。

> 导出图片的名字将和矢量图层名字一样，但是会自动去掉@字符，格式则为png。


------------------


###"老湿,好是好,可是底板和背景哪里去了?"


##同一个图层被多个标示共享


由于底板图层和背景图层都没有所有没加过@button1标志,所以它们不会被导入到button1所对应的文件中.

**如果一个图层没有添加任何一个"@"开头的标识,或者添加了"@"标示,但在最上层的“@PandaCUT_MASKS”中没有它对应的正确名称,那么这个图层永远不可能被导出.**


因此,我们只需给按钮底板添加一个@button标志就行了,但这里有个问题,按钮的底板同时被@button1和@button1_down两个元素使用,它们都要导出按钮底板,这怎么办呢? 


很简单! 写两个名字,中间加个空格就行了:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/16.png)


再导一个看看:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/17.png)


哈哈! 这回有啦!


> 每一个图层或组可以加多个标志，但标示必须符合以下规律:
> + 标示的**起始**位置**必须**有一个"@"号.
> + 紧跟在"@"后面的**一个不分割的词**为名字,不能有空格,逗号句号等标点.
> + 不同的标示中间**必须**加一个空格,例如: "@button1 @button2"
> + *在示例图中您会看到我在标示前面写了个冒号,实际上不写也行.*

--------------------------------

##再加一个按钮试试?

假如我们现在需要画一个新按钮,颜色不同,我们把原来的图层复制然后绘制一个新按钮,就像这个:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/18.png)


想要导出它,只需要按照上文所述方式,添加一个"@button2"和"@button2_mask"标示即可:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/19.png)


**"可是,底板怎么办?"**


聪明的你可能会想到一个问题,假如我不是有2个按钮,而是有100个,那岂不是按钮底板图层要写好多好多标示来表明它在每一个文件中都不隐藏? 就像这样:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/20.png)


实际上这是不用的,如果你需要无论如何都不会隐藏的图层存在,只需要在这个图层的名称中加入特殊标志“@PandaCUT_NEVERHIDE”:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/21.png)


这样,无论我导出多少个文件,标示了"@PandaCUT_NEVERHIDE"的图层均不会隐藏!!


导出一下,一共出来四个图! 都带着底板!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/22.png)


----------------


##调整图层? 没问题! 


我们现在看看我们导出的图片.....恩,或许会显得有些"太亮了",在这种时候,除了破坏性编辑,
我们还喜欢在工程的最上层添加"调整图层",比如调个色啊,调调对比度啊,这些一般都是位于最上层图层的.有"@PandaCUT_NEVERHIDE"在,这些都不是事! 


添加曲线图层:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/23.png)
![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/24.png)


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/25.png)

导出吧!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/26.png)


再来个反色:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/27.png)


导出吧!

![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/28.png)


-----------------


##能不能再给力一点啊,老湿?


每一次导出,根据位置,脚本都会自动生成一个txt文件,其中记录着各个文件的位置和大小,如果你是前端工程师,你应该知道我在说什么!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/29.png)


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/30.png)


不过,因为我也不知道你对代码有何种需求,目前导出的格式是针对特定的GUI库的,如果你希望能再再给力一点,告诉我们!


-------------------------


##English Doc ?

I will do it futrue.

------------

如果有任何意见或建议或使用不明之处,可以提issues,或者可发我的邮箱:
nanxingjiang@gmail.com

另外我们在北京招聘热爱金属材质和拟真风格的设计师,如果你有兴趣,也可向这个邮箱发邮件.
或者您有朋友,同学,学生,徒弟亲戚是热爱金属材质和拟真风格的设计师,想找工作,也可以联系我们.
