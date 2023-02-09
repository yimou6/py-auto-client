import {render, h, isVNode, VNode} from 'vue'
import Notification from './notification.vue'

let seed = 1
const notify = function (options = {}) {
    let appendTo: HTMLElement | null = document.body
    const container = document.createElement('div')
    const id = `notify_${seed++}`
    const props = {
        id,
        ...options
    }
    const vm = h(
        Notification,
        props,
        // @ts-ignore
        null
    )

    render(vm, container)
    appendTo.appendChild(container.firstElementChild!)

}

export default notify