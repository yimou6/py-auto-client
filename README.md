# py-client-auto

> 一个桌面操作自动化脚本工具。[下载](https://github.com/yimou6/py-auto-client/releases)
> 
> 开发初衷: 利用windows的定时任务功能，来完成一些重复的操作。

### 使用前提
- 需安转 `python3` [官网下载](https://www.python.org/downloads/windows/)
- 安装完 `python` 后再下载 `pyautogui pillow opencv-python`
  ```shell
    pip install pyautogui pillow opencv-python==3.4.18.65
  ```
- 如果需要**操作某个应用**，则需要**更改windows的用户账户控制**，不然当系统弹出“你要允许此应用对你的设备进行更改吗？”的弹窗时，python 脚本无法正常工作。
  - 操作：
    - windows 控制面板 `->` 系统和安全 `->` 安全和维护 `->` 更改用户账户控制设置 `->` 改为“从不通知”


### 开发
```
// install
npm install

// dev
npm run dev

// build
npm run build
```

### 使用技术、库、插件等

- electron
- vue3
- pinia
- typescript
- vite3
- pyautogui

### 基础原理

利用pyautogui提供的操作键盘、鼠标API，
通过json文件描述步骤信息，
再通过electron+vue做步骤的图形化操作处理，
最后生成对应的python脚本和步骤json文件。


  
