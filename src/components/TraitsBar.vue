<script setup>
  import {onMounted} from 'vue'
  import Data from '../data/current_data.js'
  const emit= defineEmits(['category_selected'])
  const traits= [
    'Shape', 'Eye', 'Brows', 'Nose',
    'Mouth', 'Beard', 'Mark1','Mark2',
    'Hair', 'Bangs','Hat', 'Shirt','Sleeve','Top',
    'Special', 'Acc1', 'Acc2',
  ]
  const data= Data()
  
  function on_clicked(el, name){
    emit('category_selected', name.toLowerCase())
    data.current_category.value= name.toLowerCase()
    const all= document.querySelectorAll('.TraitsBar_main')
    for(let i of all){
      i.style.borderImageSource= `url(${new URL("../images/nine_patch/7.png", import.meta.url).href}`;
    }
    el.target.style.borderImageSource= `url(${new URL("../images/nine_patch/6.png", import.meta.url).href}`;
  }
  
  function idle(){
    
    const all= document.querySelectorAll('.TraitsBar_main')
    for(let i of all){
      i.style.borderImageSource= `url(${new URL("../images/nine_patch/7.png", import.meta.url).href}`;
    }
  }
  
  onMounted(()=>{
    var img= new Image()
    img.src= new URL("../images/nine_patch/6.png", import.meta.url)
  })
  
  defineExpose({
    idle
  })
  
</script>
<template>
  <div class="max-w-[400px] flex overflow-scroll">
    <p @click="on_clicked($event, i)" v-for="i in traits" id="main" class="TraitsBar_main text-sm p-1 px-4">{{i}}</p>
  </div>
</template>

<style scoped>
  #main{
    image-rendering: pixelated;
		border-image-width: 4px;
		border-image-source: url("../images/nine_patch/7.png");
		border-image-slice: 2 fill;
  }
</style>