<template>
  <div>
    <label class="form-label">
      {{ item.label }}
      <span v-if="item.required" class="text-danger">*</span>
    </label>
    <div v-for="(option, index) in item.options" :key="index" class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        :id="'checkbox_' + item.id + '_' + index"
        :required="item.required && index === 0"
        :disabled="!preview"
      />
      <label class="form-check-label" :for="'checkbox_' + item.id + '_' + index">
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormCheckbox',
  props: {
    item: {
      type: Object,
      required: true
    },
    preview: {
      type: Boolean,
      default: false
    }
  }
};
</script>
