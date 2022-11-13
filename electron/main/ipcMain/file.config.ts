export const batStr =
`
@echo off
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"

start python start.py
`

export const pyStr =
`
import sys
import pyautogui
import datetime
import time
import json


logStr = ''


def loggerText(msg):
    global logStr
    msgStr = '【{}】: {}'.format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg)
    logStr = logStr + '\\n' + msgStr
    print(msgStr)
    if msg == '失败' or msg == '结束':
        createAndwriteLogFile(logStr)


def createAndwriteLogFile(log):
    logFilename = '{}.txt'.format(datetime.datetime.now().strftime("%Y%m%d_%H%M%S"))
    # logFilename = 'text.txt'
    f = open(logFilename, mode='w')
    f.write(log)
    f.close()
    


def getImagePosition(image):
    return pyautogui.locateCenterOnScreen(image, confidence=0.9)


def errorStop(error_stop):
    if error_stop == 1:
        loggerText('失败')
        sys.exit(1)


# 单击图片
def clickImage(image, error_stop, button='left', x=0, y=0):
    position = getImagePosition(image)
    if position is not None:
        loggerText('成功-;position:{};x:{};y:{};button:{}'.format(position, x, y, button))
        pyautogui.click(
            x=position.x + int(x),
            y=position.y + int(y),
            button=button,
            clicks=1,
            interval=0.25
        )
    else:
        errorStop(error_stop)


# 双击图片
def bdClickImage(image, error_stop, x=0, y=0):
    position = getImagePosition(image)
    if position is not None:
        pyautogui.click(
            x=position.x + int(x),
            y=position.y + int(y),
            clicks=2
        )
        loggerText('成功:{}'.format(position))
    else:
        errorStop(error_stop)


# 判断图片出现
def judgeImageView(image, error_stop, success, fail, last, max_time=2):
    loggerText('判断时间：{}'.format(max_time))
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
        loggerText('判断图片出现:失败')
        errorStop(error_stop)
        if fail is not None:
            for fail_task in fail:
                run(fail_task)
    else:
        loggerText('判断图片出现:成功')
        if success is not None:
            for success_task in success:
                run(success_task)
    if last is not None:
        for last_task in last:
            run(last_task)


# 判断日期
def judgeDate(day_type, day, error_stop, success, fail, last):
    if day_type == '每月':
        if datetime.datetime.now().strftime('%d') == day:
            loggerText('判断日期:成功')
            if success is not None:
                for success_task in success:
                    run(success_task)
        else:
            loggerText('判断日期:失败')
            errorStop(error_stop)
            if fail is not None:
                for fail_task in fail:
                    run(fail_task)
        if last is not None:
            for last_task in last:
                run(last_task)
    if day_type == '每周':
        if datetime.datetime.now().weekday() == day:
            loggerText('判断日期:成功')
            if success is not None:
                for success_task in success:
                    run(success_task)
        else:
            loggerText('判断日期:失败')
            errorStop(error_stop)
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


# 快捷键
def keyboardHotkey(hotkey):
    with pyautogui.hold(hotkey[0]):
        pyautogui.press(hotkey[1])
        if hotkey[2]:
            pyautogui.press(hotkey[2])


# 单击坐标
def clickPosition(x=0, y=0):
    pyautogui.click(x=int(x), y=int(y))


# 等待
def wait(sleep):
    if int(sleep) > 0:
        time.sleep(sleep)
        loggerText('成功')


# 循环
def loopTask(frequency, success):
    if success is not None:
        i = 0
        loggerText('需要循环{}次'.format(frequency))
        while i < int(frequency):
            loggerText('第{}次循环'.format(i + 1))
            for successTask in success:
                run(successTask)
            i = i + 1


# 运行任务
def run(task):
    name = task.get('name')
    type = task.get('type')
    opera = task.get('opera')
    last_time = task.get('lastTime')
    if last_time is None:
        last_time = 1
    error_stop = task.get('errorStop')
    if error_stop is None:
        error_stop = 0
    hotkey = task.get('hotkey')
    x = task.get('x')
    if x is None:
        x = 1
    y = task.get('y')
    if y is None:
        y = 1
    success = task.get('success')
    fail = task.get('fail')
    last = task.get('finally')
    max_time = task.get('maxTime')
    if max_time is None:
        max_time = 2
    day_type = task.get('dayType')
    if day_type is None:
        day_type = '每月'
    day = task.get('day')
    if day is None:
        day = 0
    frequency = task.get('frequency')
    if frequency is None:
        frequency = 1
    sleep = task.get('sleep')
    if sleep is None:
        sleep = 1
    button = task.get('button')
    if button is None:
        button = 'left'

    loggerText('name={};type={}'.format(name, type))
    if type == '快捷键':
        keyboardHotkey(hotkey)
    elif type == '双击图片':
        bdClickImage(image=opera, error_stop=int(error_stop), x=x, y=y)
    elif type == '单击图片':
        clickImage(image=opera, error_stop=int(error_stop), button=button, x=x, y=y)
    elif type == '判断图片出现':
        judgeImageView(image=opera, error_stop=int(error_stop), success=success, fail=fail, last=last, max_time=int(max_time))
    elif type == '判断日期':
        judgeDate(day_type=day_type, day=day, error_stop=int(error_stop), success=success, fail=fail, last=last)
    elif type == '输入字符':
        writeCharacter(opera)
    elif type == '键盘按键':
        keyboardPress(opera, presses=int(frequency))
    elif type == '单击坐标':
        clickPosition(x=x, y=y)
    elif type == '等待':
        wait(int(max_time))
    elif type == '循环':
        loopTask(frequency=frequency, success=success)
    wait(int(last_time))

# 读取 step.json
def readStep():
    with open('step.json', encoding='utf-8') as data:
        for task in json.load(data):
            run(task)
        loggerText('结束')


readStep()
`