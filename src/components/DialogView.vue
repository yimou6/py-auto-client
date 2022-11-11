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
</style>
