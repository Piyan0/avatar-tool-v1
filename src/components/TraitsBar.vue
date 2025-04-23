<script setup>
  import {onMounted, ref} from "vue";
  
  import Data from "../data/current_data.js";
  const emit = defineEmits(["category_selected"]);
  const traits = ["Shape", "Eye", "Brows", "Nose", "Mouth", "Beard", "Mark1", "Mark2", "Hair", "Bangs", "Hat", "Shirt", "Sleeve", "Top", "Special", "Acc1", "Acc2"];
  const data = Data();
  const scroll = ref(null);
  var _current_active_id= -1
  
  function scroll_category(target_x=200){
    scroll.value.scrollTo({
      'top': 0,
      'left': target_x,
    })
  }
  function on_clicked(el, name) {
    _current_active_id= parseInt(el.target.dataset.idx)
    //console.log('clicked on',_current_active_id)
    emit("category_selected", name.toLowerCase());
    data.current_category.value = name.toLowerCase();
    const all = document.querySelectorAll(".TraitsBar_main");
    for (let i of all) {
      i.style.borderImageSource = `url(${new URL("../images/nine_patch/7.png", import.meta.url).href}`;
    }
    el.target.style.borderImageSource = `url(${new URL("../images/nine_patch/6.png", import.meta.url).href}`;
  }

  function idle() {
    const all = document.querySelectorAll(".TraitsBar_main");
    for (let i of all) {
      i.style.borderImageSource = `url(${new URL("../images/nine_patch/7.png", import.meta.url).href}`;
    }
  }
  
  function arrow_clicked(dir){
    const all = document.querySelectorAll(".TraitsBar_main");
    const all_size= all.length
    //console.log('>>>', all_size, _current_active_id)
    if (dir=="left"){
      _current_active_id-= 1
    }else{
      _current_active_id+= 1
    }
    //console.log('this is',_current_active_id)
    
    if(_current_active_id<0){
      _current_active_id=0
      //console.log('idx is zero')
      return
    }else if(_current_active_id>all_size-1){
      _current_active_id=all_size-1
      //console.log('idx is out of bound')
      //console.log('>>', _current_active_id ,all_size-1)
      return
      
    }
    
    const rect= all[_current_active_id].getBoundingClientRect()
    const scroll_destination= (_current_active_id/(all_size-1)) * scroll.value.scrollWidth
    scroll_category(
      scroll_destination-rect.width
    )
    
    for (let i of all) {
      i.style.borderImageSource = `url(${new URL("../images/nine_patch/7.png", import.meta.url).href}`;
    }
    
    
    all[_current_active_id].style.borderImageSource = `url(${new URL("../images/nine_patch/6.png", import.meta.url).href}`;
    
    const category_name= all[_current_active_id].dataset.name.toLowerCase()
    emit("category_selected", category_name);
    data.current_category.value = category_name
  }
  onMounted(() => {
    var img = new Image();
    img.src = new URL("../images/nine_patch/6.png", import.meta.url);
  });
  

  defineExpose({
    idle,
  });
</script>
<template>
  <div class="flex overflow-scroll gap-2">
    <p @click="arrow_clicked('left')"><</p>
    <div ref="scroll" class="max-w-[400px] flex overflow-scroll">
      <p @click="on_clicked($event, i)" :data-name= "i" :data-idx="traits.indexOf(i)" v-for="i in traits" id="main" class="TraitsBar_main text-sm p-1 px-4">{{ i }}</p>
    </div>
    <p @click="arrow_clicked('right')">></p>
  </div>
</template>

<style scoped>
  #main {
    image-rendering: pixelated;
    border-image-width: 4px;
    border-image-source: url("../images/nine_patch/7.png");
    border-image-slice: 2 fill;
  }
</style>
