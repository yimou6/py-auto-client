export const batStr =
`
@echo off
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"

start python start.py
`

export const pyStr =
`import sys
import pyautogui
import datetime
import time
import json


logStr = ''


def loggerText(msg):
    global logStr
    msg_str = '【{}】: {}'.format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg)
    logStr = logStr + '\\n' + msg_str
    if msg == '失败' or msg == '结束':
        createAndWriteLogFile(logStr)


def createAndWriteLogFile(log):
    log_filename = '{}.txt'.format(datetime.datetime.now().strftime("%Y%m%d_%H%M%S"))
    # logFilename = 'text.txt'
    f = open(log_filename, mode='w')
    f.write(log)
    f.close()
    

def getImagePosition(image):
    return pyautogui.locateCenterOnScreen(image, confidence=0.9)


def errorStop(error_stop):
    if error_stop == 'stop':
        loggerText('失败')
        sys.exit(1)


# 点击图片
def clickImage(image, error_stop, clicks=1, button='left', x=0, y=0):
    position = getImagePosition(image)
    if position is not None:
        loggerText('成功: position:{};x:{};y:{}'.format(position, x, y))
        pyautogui.click(
            x=position.x + x,
            y=position.y + y,
            button=button,
            clicks=clicks,
            interval=0.3
        )
    else:
        errorStop(error_stop)


# 判断图片
def judgeImageView(image, error_stop, success, fail, last, max_time=2):
    i = 0
    position = None
    while i < max_time:
        position = getImagePosition(image)
        if position is not None:
            i = max_time
        else:
            time.sleep(2)
            i = i + 2
    if position is None:
        errorStop(error_stop)
        if fail is not None:
            for fail_task in fail:
                run(fail_task)
    else:
        if success is not None:
            for success_task in success:
                run(success_task)
    if last is not None:
        for last_task in last:
            run(last_task)


# 判断时间
def judgeDate(day_type, day, success, fail, last):
    if day_type == '2':
        if datetime.datetime.now().strftime('%d') == day:
            if success is not None:
                for success_task in success:
                    run(success_task)
        else:
            if fail is not None:
                for fail_task in fail:
                    run(fail_task)
        if last is not None:
            for last_task in last:
                run(last_task)
    if day_type == '1':
        if datetime.datetime.now().weekday() - 1 == int(day):
            if success is not None:
                for success_task in success:
                    run(success_task)
        else:
            if fail is not None:
                for fail_task in fail:
                    run(fail_task)
        if last is not None:
            for last_task in last:
                run(last_task)


# 输入字符
def writeCharacter(character):
    pyautogui.write(character, interval=0.25)


# 键盘按键
def keyboardPress(key, presses=1):
    pyautogui.press(key, presses=presses, interval=0.25)


# 组合键
def keyboardHotkey(hotkey):
    with pyautogui.hold(hotkey[0]):
        pyautogui.press(hotkey[1])
        if hotkey[2]:
            pyautogui.press(hotkey[2])


# 单击坐标
def clickPosition(x=0, y=0, button='left', clicks=1):
    pyautogui.click(x=float(x), y=float(y), button=button, clicks=clicks)


# 等待
def wait(sleep):
    if float(sleep) > 0:
        time.sleep(float(sleep))
        loggerText('成功')


# 循环
def loopTask(frequency, success):
    if success is not None:
        i = 0
        while i < int(frequency):
            loggerText('第{}次循环'.format(i + 1))
            for successTask in success:
                run(successTask)
            i = i + 1


# read step info
def run(step):
    step_type = step.get('type')
    next_wait = step.get('nextWait')

    options = step.get('options')

    if step_type == '组合键':
        hotkey = options.get('hotkey')
        loggerText('[{}]: hotkey={}'.format(step_type, hotkey))
        keyboardHotkey(hotkey=hotkey)
    elif step_type == '点击图片':
        button = options.get('button')
        clicks = options.get('clicks')
        x = float(options.get('x'))
        y = float(options.get('y'))
        error_stop = options.get('error')
        opera = options.get('opera')
        loggerText('[{}]: opera={}, x={}, y={}, button={}, clicks={}, error_stop={}'
                   .format(step_type, opera, x, y, button, clicks, error_stop))
        if button == '左键':
            button = 'left'
        else:
            button = 'right'
        if clicks == '单击':
            clicks = 1
        else:
            clicks = 2
        if error_stop == '继续':
            error_stop = 'continue'
        else:
            error_stop = 'stop'
        clickImage(image=opera, error_stop=error_stop, clicks=clicks, button=button, x=x, y=y)
    elif step_type == '判断图片':
        opera = options.get('opera')
        wait_time = float(options.get('waitTime'))
        error_stop = options.get('error')
        if error_stop == '继续':
            error_stop = 'continue'
        else:
            error_stop = 'stop'

        children = step.get('children')
        success = []
        fail = []
        last = []
        if type(children) == list:
            for _children in children:
                if _children.get('childKey') == 'success':
                    success.append(_children)
                elif _children.get('childKey') == 'fail':
                    fail.append(_children)
                elif _children.get('childKey') == 'finally':
                    last.append(_children)

        loggerText('[{}]: opera={}, wait_time={}, error_stop={}'
                   .format(step_type, opera, wait_time, error_stop))

        judgeImageView(image=opera, error_stop=error_stop, max_time=wait_time, success=success, fail=fail, last=last)
    elif step_type == '键盘按键':
        opera = options.get('opera')
        presses = int(options.get('presses'))
        loggerText('[{}]: opera={}, presses={}'
                   .format(step_type, opera, presses))
        keyboardPress(key=opera, presses=presses)
    elif step_type == '输入字符':
        opera = options.get('opera')
        loggerText('[{}]: opera={}'
                   .format(step_type, opera))
        writeCharacter(character=opera)
    elif step_type == '单击坐标':
        x = float(options.get('x'))
        y = float(options.get('y'))
        button = options.get('button')
        clicks = options.get('clicks')
        if button == '左键':
            button = 'left'
        else:
            button = 'right'
        if clicks == '单击':
            clicks = 1
        else:
            clicks = 2
        loggerText('[{}]: x={}, y={}, button={} clicks={}'
                   .format(step_type, x, y, button, clicks))
        if clicks == 'single':
            clicks = 1
        else:
            clicks = 2
        clickPosition(x=x, y=y, button=button, clicks=clicks)
    elif step_type == '等待':
        wait_time = float(options.get('waitTime'))
        loggerText('[{}]: waitTime={}'
                   .format(step_type, wait_time))
        wait(sleep=wait_time)
    elif step_type == '循环':
        presses = int(options.get('presses'))
        children = step.get('children')
        success = []
        if type(children) == list:
            for _children in children:
                if _children.get('childKey') == 'success':
                    success.append(_children)
        loggerText('[{}]: presses={}'
                   .format(step_type, presses))
        if success:
            loopTask(frequency=presses, success=success)
    elif step_type == '判断时间':
        presses = options.get('presses')
        day = options.get('day')
        if presses == '每周':
            presses = '1'
        else:
            presses = '2'

        children = step.get('children')
        success = []
        fail = []
        last = []
        if type(children) == list:
            for _children in children:
                if _children.get('childKey') == 'success':
                    success.append(_children)
                elif _children.get('childKey') == 'fail':
                    fail.append(_children)
                elif _children.get('childKey') == 'finally':
                    last.append(_children)

        loggerText('[{}]: presses={}, day={}'
                   .format(step_type, presses, day))
        judgeDate(day_type=presses, day=day, success=success, fail=fail, last=last)
    wait(next_wait)


# 读取 step.json
def readStep():
    with open('step.json', encoding='utf-8') as data:
        for task in json.load(data):
            run(task)
        loggerText('结束')


readStep()
`