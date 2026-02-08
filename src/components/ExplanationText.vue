<template>
  <div class="explanation-formatted">
    <p
      v-for="(segment, idx) in segments"
      :key="idx"
      :class="['segment', `segment--${segmentType(segment)}`]"
    >
      {{ segment }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatExplanation, segmentType } from '@/utils/textFormatter'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})

const segments = computed(() => formatExplanation(props.text))
</script>

<style scoped>
.explanation-formatted {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.segment {
  margin: 0;
  line-height: 1.65;
}

/* Intro / regular paragraph text */
.segment--text {
  color: inherit;
}

/* Main bullet points (•) */
.segment--bullet {
  padding-left: 0.25rem;
}

/* Sub-bullet points (◦) */
.segment--sub-bullet {
  padding-left: 1.25rem;
}

/* Numbered list items */
.segment--numbered {
  padding-left: 0.25rem;
}
</style>
