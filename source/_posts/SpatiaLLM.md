---
title: SpatiaLLM
date: 2026-01-29 15:19:45
updated:
tags: ["3DGS","LLM"]
categories: 3D Reconstruction
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
abcjs:
noticeOutdate:
---

## .vscode文件夹

虽然 launch.json 文件位于 .vscode 文件夹里，但 VS Code 调试器默认的工作目录 (Current Working Directory, CWD)是你的项目根目录（也就是你用 VS Code 打开的那个最外层文件夹），而不是 .vscode 文件夹

## Step Over、Step Into、Step Out

Step Over (单步跳过):调试主函数时，调试器不会带你进入中间调用的函数内部,当你确信被调用函数是没问题的时候用
**Step Into (单步调试 / 进入)：** 遇到被调用函数会进入函数内部
Step Out (单步跳出)：点击后，它会立即执行完当前被调用函数剩余的所有代码，然后直接跳回到主函数中调用它的地方的下一行

## Prompt 长什么样

``` python
prompt = '<|point_start|><|point_pad|><|point_end|>Detect walls, doors, windows, boxes. The reference code is as followed: @dataclass\nclass Wall:\n    ax: int\n    ay: int\n    az: int\n    bx: int\n    by: int\n    bz: int\n    height: int\n    thickness: int\n\n@dataclass\nclass Door:\n    wall_id: str\n    position_x: int\n    position_y: int\n    position_z: int\n    width: int\n    height: int\n\n@dataclass\nclass Window:\n    wall_id: str\n    position_x: int\n    position_y: int\n    position_z: int\n    width: int\n    height: int\n\n@dataclass\nclass Bbox:\n    class: str\n    position_x: int\n    position_y: int\n    position_z: int\n    angle_z: int\n    scale_x: int\n    scale_y: int\n    scale_z: int'
```

**视觉感知层 (<|point_start|>...)：** 之前的 preprocess_point_cloud 生成的那个 Tensor（点云特征）会通过 Cross-Attention 或者 Embedding 注入到这里。模型读到这里时，它“看”到了房间的 3D 结构
**任务指令层 (Detect walls...)：** 这是一个标准的 NLP 指令，告诉模型现在的任务是“检测”，而不是“描述房间风格”或者“数椅子”
**语法约束层（The reference code is as followed）：** 利用了 LLM 强大的代码补全能力。Input: class Wall: ... (定义)；Output: wall_1 = Wall(ax=10, ay=20...) (实例化/调用)

## 关于generate_layout的输出

``` python
layout_str = 'wall_0=Wall(2,2,2,132,2,2,136,0)\nwall_1=Wall(2,2,2,2,200,2,136,0)\nwall_2=Wall(132,2,2,132,170,2,136,0)\nwall_3=Wall(78,170,2,132,170,2,136,0)\nwall_4=Wall(78,170,2,78,200,2,136,0)\nwall_5=Wall(2,200,2,78,200,2,136,0)\ndoor_0=Door(wall_5,44,200,44,39,104)\nwindow_0=Window(wall_0,67,2,68,116,83)\nbbox_0=Bbox(curtain,67,6,68,639,207,12,133)\nbbox_1=Bbox(dressing_table,113,29,25,480,85,60,73)\nbbox_2=Bbox(bed,89,88,19,480,121,138,53)\nbbox_3=Bbox(painting,132,91,59,480,83,6,50)\nbbox_4=Bbox(nightstand,124,136,12,480,30,27,30)\nbbox_5=Bbox(wardrobe,105,159,51,320,87,35,155)'
```

最后的输出layout（其实就是layout_str的转换）里面包含doors、windows、bboxes类

### 具体的例子

Wall(id=5, ax=0.05, ay=5.0, az=0.05, bx=1.95, by=5.0, bz=0.05, height=2.72, thickness=0.0, entity_label='wall')
Door(id=0, wall_id=5, position_x=1.1, position_y=5.0, position_z=1.1, width=0.78, height=2.08, entity_label='door')

#### Wall

ax,ay,az为起点，bx,by,bz为终点，可以看到连成的一条线是平行与x轴的一条直线。然后平行于Z轴延申height（即2.72米），垂直与这个墙面向左向右延申共thickness（这里是0米），这样就准确描述好了这个墙

#### Door

wall_id表示与门属于哪个墙
position_x,y,z表示其中心点位置
根据width向左右延申，height向上下延申，类似嵌入到墙里面，因此可以确定方向，厚度也与wall一致

#### 如下图所示

``` text
Z (高度)
^
|       ---------------------  <- 墙顶 (2.77)
|       |                   |
|       |                   |
|       |      _______      |  <- 门顶 (2.14)
|       |     |       |     |
|       |     |       |     |
|       |     |  Door |     |
|       |     |_______|     |  <- 门底 (0.06)
|       -------=======-------  <- 地板 (0.05)
-------------------------------------> X (水平位置)
      0.05   0.71     1.49   1.95
      (墙始)  (门始)   (门终) (墙终)
```

## 项目架构

### 感知层（Sonata编码器）

#### 对应 spatiallm/model/spatiallm_qwen.py 60行附近

为了让 LLM 看懂 3D 点云，必须先用一个 Encoder 把 N 个点的点云变成 K 个特征向量
注：inference.py 里的 preprocess_point_cloud 把点云变成了 Grid（网格）格式，这正是为了喂给这个 Encoder

### 翻译层（MLP）

#### 对应 spatiallm/model/spatiallm_qwen.py 83行附近

把 3D 特征向量“翻译”成 LLM 能理解的 Token Embeddings

### 大脑层（LLM）

使用了通用的开源 LLM（如 Qwen2.5 或 Llama），看到特定的 3D 特征后，输出特定的 Python 代码格式

注：spatiallm/model/spatiallm_qwen.py 248行附近有一个拼接的操作，把文本里原本用来占位的无效向量（Padding）剪掉， 把 Sonata 算出来的 3D 特征向量粘贴进去

| 阶段 | 数据形态 | 执行者 (Component) | 核心动作 (Action) |
| :--- | :--- | :--- | :--- |
| **1. 采集 (Input)** | `.ply` 文件 <br> *(原始 3D 点云)* | Python (Open3D) | **读取与预处理**   <br> 将点云量化并网格化 (Voxelization) |
| **2. 编码 (Encode)** | **Tensor 向量序列** <br> *(Visual Embeddings)* | **Sonata Encoder** | **特征提取** <br> 将几十万个离散点压缩成几百个高维特征向量 |
| **3. 提示 (Prompt)** | 文本向量序列 <br> *(Text Embeddings)* | Tokenizer | **指令注入** <br> 将 "Detect walls..." 文本转为向量 |
| **4. 融合 (Fusion)** | **混合多模态向量** <br> *(Input Embeddings)* | `spatiallm_qwen.py` | **移花接木 (Concatenation)** <br> 剪掉 Prompt 中的占位符，填入 3D 特征向量 |
| **5. 思考 (Reasoning)** | Logits (概率分布) | **LLM (Qwen)** | **自回归预测 (Next Token Prediction)** <br> 结合视觉特征与先验知识，逐个预测字符 |
| **6. 输出 (Decode)** | **文本字符串** <br> *(`wall_0=Wall(...)`)* | Tokenizer | **解码** <br> 将预测的 Token ID 变回人类可读的字符串 |
| **7. 还原 (Deserialize)** | **Python 对象** <br> *(`Wall` Instance)* | `layout.py` | **反序列化 (Parsing)** <br> 解析字符串，实例化为内存中的 3D 对象 |

注：Encoder负责把 3D 世界 压缩 成 LLM 能理解的数学特征，而LLM负责把这些数学特征 翻译 成符合 Python 语法的、有逻辑的布局代码，还会预测看不见的地方

## Loss 计算

### 对应 spatiallm/tuner/trainer.py 44行附近

直接使用了父类（以及模型内部 spatiallm_qwen.py）的标准 Loss 计算逻辑：Cross Entropy Loss (交叉熵损失)

## 数据流水线（那些杂乱的 .ply 文件和 .txt 标注，到底经历了什么，才变成了模型能吃的 Tensor？）

### mm_plugin.py的三大核心职能

### 数据增强

#### 对应42行附近

颜色干扰： ChromaticJitter (改颜色), RandomColorGrayScale (变黑白)
几何干扰： RandomJitter, ElasticDistortion。给点云加噪声、扭曲它。模拟现实中传感器扫描不准的情况
随机旋转： self.random_rotation

### 格式化：体素化

#### 对应67行附近

模型吃不下无限精度的浮点数坐标 (x=1.23456...)。它需要把空间切成格子
输出返回 grid_coord (整数索引) 和 coord (原始偏移量)。Sonata Encoder 主要是对这些整数格子进行卷积处理

### 文本与点云的“同步旋转”

#### 对应227行附近

同步变换：点云怎么转和缩放，Layout 对象就怎么转和缩放

## 总结

输入的是ply文件，也就是原始的3D点云，在mm_plugin.py文件中进行处理，比如数据增强（训练时增加了干扰）、体素化（把空间分成一个个格子，把点云的信息变成格子的信息）；随后在spatiallm_qwen.py文件中，使用Sonata进行编码，把点云变成特征向量；然后把对模型的指令和输出的模板也变成特征向量，并把点云信息转换的特征向量和这些拼接起来（用的字符串分割），形成完整的prompt，输入到LLM中。
LLM对看到的信息进行处理（理解），对看不到的信息做出预测，生成python代码（即inference中的layout），生成scene0000_00.txt文件，内容比如：
Wall(id=5, ax=0.05, ay=5.0, az=0.05, bx=1.95, by=5.0, bz=0.05, height=2.72, thickness=0.0, entity_label='wall')
Door(id=0, wall_id=5, position_x=1.1, position_y=5.0, position_z=1.1, width=0.78, height=2.08, entity_label='door')
最后进行对LLM的输出进行后处理，进行可视化：加载点云ply文件，然后把LLM的输出layout转化成Rerun能理解的格式，可以在Rerun上渲染出来
