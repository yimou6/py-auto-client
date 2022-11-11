import { StepClass } from './Step.Class'

export enum EMouseRightMenu {
    'previous' = '添加上一步',
    'next' = '添加下一步',
    'success' = '判断成功步骤',
    'fail' = '判断失败步骤',
    'finally' = '判断结束步骤',
    'edit' = '修改步骤',
    'del' = '删除步骤'
}

export interface IStepType {
    name: string,
    color: string
}
export interface IArea {
    x: number
    y: number
}

export interface IClickNode {
    position: PointerEvent
    nodes: StepClass[]
}

export interface IScript {
    title: string
    filename: string
    createdAt: string
    updatedAt: string
}