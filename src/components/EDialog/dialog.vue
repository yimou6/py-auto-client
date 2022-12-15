<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <teleport to="body">
    <Transition name="fade" :duration="500">
      <div class="dialog" v-if="visible">
        <div class="dialog-warp">
          <div class="dialog-title" v-if="title">{{ title }}</div>
          <div class="dialog-content">
            <slot/>
          </div>
          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped lang="scss">
.dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;

  .dialog-warp {
    background-color: #ffffff;
    border-radius: 2px;
    margin-top: 20px;
    max-width: 420px;

    .dialog-title {
      font-size: 16px;
      font-weight: bold;
      text-align: left;
      color: #565656;
      padding: 10px 15px;
      border-bottom: 1px solid #dddddd;
    }

    .dialog-content {
      padding: 15px;
      min-width: 300px;
    }

    .dialog-footer {
      height: 42px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid #dddddd;
      padding-right: 15px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .dialog-warp,
.fade-leave-active .dialog-warp {
  transition: all 0.3s ease-out;
}
.fade-enter-from .dialog-warp,
.fade-leave-to .dialog-warp {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
