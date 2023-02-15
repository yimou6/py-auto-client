export const batStr =
`
@echo off
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"

start python start.py
`

export const pyStr =
`
import ctypes
import datetime
import sys
import time
import json
import pyautogui


def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False


def get_image_position(image):
    return pyautogui.locateCenterOnScreen(image, confidence=0.9)


def err_stop(tag):
    if tag == 'step':
        sys.exit(1)


# 点击图片
def click_image(button, clicks, x, y, img=None, tag=None):
    abscissa = 0  # 横坐标
    ordinate = 0  # 纵坐标
    if img is None:
        abscissa = x
        ordinate = y
    else:
        position = get_image_position(img)
        if position is None:
            err_stop(tag)
        else:
            abscissa = position.x + x
            ordinate = position.y + y
    pyautogui.click(abscissa, ordinate, clicks, 0.3, button)


# 判断图片
def judge_image(img, tag, wait_time, steps):
    fail = []
    success = []
    last = []
    if steps is not None:
        for step in steps:
            if step.get('childKey') == 'success':
                success.append(step)
            if step.get('childKey') == 'fail':
                fail.append(step)
            if step.get('childKey') == 'finally':
                last.append(step)
    i = 0
    position = None
    sleep = 1  # 每1秒查找一次图片
    while i < wait_time:
        position = get_image_position(img)
        if position is None:
            time.sleep(sleep)
            i = i + sleep
        else:
            i = wait_time
    if position is None:
        err_stop(tag)
        for fail_step in fail:
            run_step(fail_step)
    else:
        for success_step in success:
            run_step(success_step)
    for last_step in last:
        run_step(last_step)


# 循环
def loop(presses, steps):
    if steps is not None:
        i = 0
        while i < presses:
            for step in steps:
                run_step(step)
            i = i + 1


# 判断时间
def judge_date(presses, day, steps):
    fail = []
    success = []
    last = []
    if steps is not None:
        for step in steps:
            if step.get('childKey') == 'success':
                success.append(step)
            if step.get('childKey') == 'fail':
                fail.append(step)
            if step.get('childKey') == 'finally':
                last.append(step)
    if presses == 1:
        if datetime.datetime.now().weekday() - 1 == day:
            for success_step in success:
                run_step(success_step)
        else:
            for fail_step in fail:
                run_step(fail_step)
    else:
        if datetime.datetime.now().strftime('$d') == day:
            for success_step in success:
                run_step(success_step)
        else:
            for fail_step in fail:
                run_step(fail_step)
    for last_step in last:
        run_step(last_step)


def run_step(step):
    step_type = step.get('type')
    next_wait = step.get('nextWait')

    options = step.get('options')
    opera = options.get('opera')
    button = options.get('button')
    clicks = options.get('clicks')
    x = options.get('x')
    y = options.get('y')
    presses = options.get('presses')
    wait_time = options.get('waitTime')
    day = options.get('day')
    error_tag = options.get('error')
    hotkey = options.get('hotkey')
    children = step.get('children')

    if step_type == '点击图片':
        click_image(button, clicks, x, y, opera, error_tag)
    elif step_type == '组合键':
        pyautogui.hotkey(*hotkey)
    elif step_type == '判断图片':
        judge_image(opera, error_tag, wait_time, children)
    elif step_type == '键盘按键':
        pyautogui.press(opera, presses, 0.3)
    elif step_type == '输入字符':
        pyautogui.write(opera, 0.3)
    elif step_type == '单击坐标':
        click_image(button, clicks, x, y)
    elif step_type == '等待':
        time.sleep(wait_time)
    elif step_type == '循环':
        loop(presses, children)
    elif step_type == '判断时间':
        judge_date(presses, day, children)
    time.sleep(next_wait)


def get_id():
    if len(sys.argv) == 2:
        return sys.argv[1]
    else:
        return None



def main():
    with open('step.json', encoding='utf8') as data:
        for step in json.load(data):
            run_step(step)


if is_admin():
    main()
else:
    if sys.version_info[0] == 3:
        ctypes.windll.shell32.ShellExecuteW(None, 'runas', sys.executable, __file__, None, 1)
    main()
`