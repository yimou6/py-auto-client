import {Step} from "./step";

export type TStepType = '' | '单击图片' | '判断图片出现'

export enum EMouseRightMenu {
    'previous' = '添加上一步',
    'next' = '添加下一步',
    'success' = '判断成功步骤',
    'fail' = '判断失败步骤',
    'finally' = '判断结束步骤',
    'edit' = '修改步骤',
    'del' = '删除步骤'
}

export interface IStep {
    id: string
    name: string
    type: TStepType
    opera: string | string[]
    success?: IStep[]
    fail?: IStep[]
    finally?: IStep[]
    x?: number
    y?: number
    maxTime?: number
    button?: string
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
    position: { x: number, y: number }
    nodes: Step[]
}