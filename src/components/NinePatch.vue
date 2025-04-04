<script setup>
  const props= defineProps(['nine', 'slice', 'round', 'bg', 'size'])
  const border_style= {'image-rendering': 'pixelated', 'border': `${props.size}px solid black`, 'border-image-source': `url(${new URL('../images/nine_patch/'+props.nine+'.png', import.meta.url).href})`, 'border-image-slice': props.slice}
  
</script>

<template>
  <div class="main relative flex-1">
    <div :style="border_style" class="nine absolute w-full h-full left-0 top-0 z-10"></div>
    <div :style="{'border-radius' : props.round+'px', 'background-color': props.bg}" class="absolute w-full h-full left-0 top-0"></div>
    <div class="relative z-20 flex justify-center">
      <slot name="content">
        
      </slot>
    </div>
  </div>
  
</template>