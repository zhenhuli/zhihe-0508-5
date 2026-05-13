<template>
  <div>
    <label class="form-label">
      {{ item.label }}
      <span v-if="item.required" class="text-danger">*</span>
    </label>
    <input
      type="text"
      class="form-control"
      :placeholder="item.placeholder"
      :required="item.required"
      :disabled="!preview"
    />
  </div>
</template>

<script>
export default {
  name: 'FormInput',
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
