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


def get_image_position(image):
    return pyautogui.locateCenterOnScreen(image, confidence=0.9)


def err_stop(tag):
    if tag == 'step':
        sys.exit(1)


# 点击图片
def click_image(button, clicks, x, y, wait, img=None, tag=None):
    if img is None:
        abscissa = x
        ordinate = y
        pyautogui.click(x=abscissa, y=ordinate, clicks=clicks, button=button)
    else:
        i = 0
        position = None
        sleep = 1  # 每1秒查找一次图片
        while i < wait:
            position = get_image_position(img)
            if position is None:
                time.sleep(sleep)
                i = i + sleep
            else:
                i = wait
        if position is None:
            err_stop(tag)
        else:
            abscissa = position.x + x
            ordinate = position.y + y
            pyautogui.click(x=abscissa, y=ordinate, clicks=clicks, button=button)


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
    if presses == '每周':
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


def move_mouse(x, y):
    pyautogui.moveTo(x, y)


def run_step(step):
    step_type = step.get('type')
    next_wait = step.get('nextWait')
    desc = step.get('desc')

    button = step.get('button')
    clicks = step.get('clicks')
    error_tag = step.get('error')
    x = step.get('x')
    y = step.get('y')
    wait_time = step.get('wait')
    img = step.get('img')
    frequency = step.get('frequency')
    keyboard = step.get('keyboard')
    hotkey = step.get('hotkey')
    chart = step.get('chart')
    day_type = step.get('dayType')
    day = step.get('day')
    children = step.get('children')

    if step_type == '点击图片':
        click_image(button, clicks, x, y, wait_time, img, error_tag)
    elif step_type == '组合键':
        pyautogui.hotkey(*hotkey)
    elif step_type == '判断图片':
        judge_image(img, error_tag, wait_time, children)
    elif step_type == '单键':
        pyautogui.press(keyboard, frequency, 0.3)
    elif step_type == '输入字符':
        pyautogui.write(chart, 0.3)
    elif step_type == '点击坐标':
        click_image(button, clicks, x, y)
    elif step_type == '等待':
        time.sleep(wait_time)
    elif step_type == '循环':
        loop(frequency, children)
    elif step_type == '判断时间':
        judge_date(day_type, day, children)
    elif step_type == '移动光标':
        move_mouse(x, y)
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


main()

`