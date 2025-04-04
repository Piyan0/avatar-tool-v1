<script setup>
  import {ref, toRaw} from 'vue'
  const active= ref(false)
  const text= ref('Primary')
  const emit= defineEmits(['color_selected'])
  const color_data= ref()
  
  function set_colors(new_colors){
    color_data.value= new_colors
  }
  function set_active(_text, cond= true){
    if(cond== false){
    active.value= false
      return
    }
    active.value= true
    text.value= _text
  }
  
  
  
  function color_selected(el, color){
    
    emit('color_selected', toRaw(color))
  }
  
  defineExpose({
    set_active, set_colors
  })
</script>

<template>

  <div v-if="active" id="main" class="absolute max-w-[250px] left-0 top-[32px] z-30 max-h-[300px] flex flex-col">
    <div class=" min-h-[30px] flex px-2 gap-2  justify-between items-center">
      <p class="text-[#DABC76] text-sm">{{text}}</p>
      <img @click="active=false" class="hiddenn" width=12 src="../images/icon/close.png" alt="">
    </div>
  <div class="flex border-b-8 border-transparent justify-center overflow-scroll flex-wrap gap-1 flex-1 p-2">
    <div v-for="i in color_data" :style="{'background-color' : `#${i.preview}`}" @click="color_selected($event, i)" class="active:opacity-40 ColorPicker_color border-b-2 border-violet-950 min-h-[36px] min-w-[36px]"></div>
  </div>
  </div>
</template>

<style scoped>
  #main{
    image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/1.png");
		border-image-width: 20px;
		border-image-slice: 12 fill;
	}
  
</style>