import { InjectionKey } from 'vue'

export interface FormContext {
    errorFiled: ErrorField[],
    model: Record<string, any>,
    rules: Partial<Record<string, any[]>>
}

export interface FormItemContext {
    rules: FormContext['rules']
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')

export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')

export interface ErrorField {
    field: string,
    errMsg: string
}