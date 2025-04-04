<script setup>
  var tools= [
    {
    'name': 'save',
    'icon': new URL('../images/icon/save.png', import.meta.url).href
    },
    {
    'name': 'load',
    'icon': new URL('../images/icon/load.png', import.meta.url).href
    },
    {
    'name': 'download',
    'icon': new URL('../images/icon/download.png', import.meta.url).href
    },
    {
    'name': 'share',
    'icon': new URL('../images/icon/share.png', import.meta.url).href
    },
    {
    'name': 'bg',
    'icon': new URL('../images/icon/toggle_bg.png', import.meta.url).href
    },
    {
    'name': 'random',
    'icon': new URL('../images/icon/dice.png', import.meta.url).href
    },
  ]
  
  const emit= defineEmits(['tools_clicked'])
  function tools_clicked(tool_name){
    emit('tools_clicked', tool_name)
  }
  
</script>
<template>
  <div class="flex py-2">
    <div v-for="i in tools" @click="tools_clicked(i.name)" class="group flex flex-1 items-center flex-col">
      <img class="group-active:opacity-40 " width=24 :src="i.icon" alt="">
      <p class="text-xs">{{i.name}}</p>
    </div>
  </div>
</template>