<script setup>
  import {ref, onMounted} from 'vue'
  const texture= ref('')
  const emit= defineEmits(['on_click'])
  const props= defineProps(['active_texture', 'inactive_texture', 'gender', 'initial_active'])
  const active_texture= new URL(props.active_texture, import.meta.url).href
  const inactive_texture= new URL(props.inactive_texture, import.meta.url).href
  
  function set_active(cond= true){
    if (cond== false){
      texture.value.src= inactive_texture
      return
    }
    texture.value.src= active_texture
  }
  function on_click(){
    //set_active()
    emit('on_click', set_active, props.gender)
  }
  
  onMounted(()=>{
    var img= new Image()
    img.src=new URL('../images/base/female.png', import.meta.url).href
    
    if (props.initial_active=='true'){
    texture.value.src= active_texture
    }})
    
  defineExpose({
    set_active
  })
  
  
</script>

<template>
  <div @click="on_click()" class="flex w-full flex-col items-center">
    <img ref="texture" class="w-full" :src='inactive_texture' alt="">
    <p class="text-[#947E4A] text-xs">{{gender}}</p>
  </div>
</template>