### 一个用于windows的自动化工具

> 仅用于学习交流

#### 使用技术、库、插件等

- electron
- element-plus
- vue3
- pinia
- typescript
- vite3
- pyautogui

#### 基础原理

利用pyautogui提供的操作键盘、鼠标API，
通过json文件描述步骤信息，
再通过electron+vue做步骤的图形化操作处理，
最后生成对应的python脚本和步骤json文件。

#### 使用前提
- 安装`python3`
- 安装`pyautogui`
  - `pip install pyautogui`
- 更改用户账户控制
  - windows 控制面板 `->` 系统和安全 `->` 安全和维护 `->` 更改用户账户控制设置 `->` 改为“从不通知”
  - 因为当系统弹出“你要允许此应用对你的设备进行更改吗？”的弹窗时，python 脚本无法正常工作。



#### 图示

![eg0](./eg0.png)
![eg1](./eg1.png)
![eg2](./eg2.png)
![eg3](./eg3.png)