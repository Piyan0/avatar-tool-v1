<script setup>
  import {ref, onMounted, computed, nextTick} from 'vue'
  import TraitsData from '../data/traits_data.js'
  import Data from '../data/current_data.js'
  
  const emit= defineEmits(['trait_selected'])
  const use_traits_data= TraitsData()
  const use_data= Data()
  var max_trait= ref(0)
  
  var base_path= ref('../images/traits/hair/')
  var preview_path= ref('../images/traits/preview/hair/')
  var last_selected_trait_id= ref(0)
  
  function idle(){
    max_trait.value= 0
    
  }
  function set_data(options){
    base_path.value= options.base_path
    preview_path.value= options.preview_path
    //last_selected_trait_id.value= options.last_selected_trait_id
    max_trait.value= options.max_trait
  }
  
  //list of traits, path
  
  const data= computed(()=>{
    const r= []
    for(let i =0; i<max_trait.value; i++){
      r.push({
        'path' : new URL(base_path.value+i+'.png', import.meta.url).href,
        'preview' : new URL(preview_path.value+i+'.png', import.meta.url).href,
        'id' : i,
      })
    }
    return r
  })
  

  
  //data is traits
  const is_no_data= computed(()=>{
    return data.value.length==0
  })
  
  function trait_selected(el,path, id){
    //console.log(path)
    if (use_data.loading_state.value==true) return
    emit('trait_selected', path, id, use_data.current_category.value)
    use_traits_data.get_data(use_data.current_category.value).last_selected_trait_id= id
    //console.log(use_traits_data.get_data(use_data.current_category.value))
    const all= document.querySelectorAll('.TraitsDisplay_item')
    for(let i of all){
      if (id== last_selected_trait_id.value){
      }
      i.classList.remove('brightness-[0.7]')
    }
    
    el.currentTarget.classList.add('brightness-[0.7]')
    
  }
  
  async function get_focus_back(id){
    //need to use await next tick, otherwise, it will return empty node list, re-render.
    await nextTick()
    const all= document.querySelectorAll('.TraitsDisplay_item')
    
    for(let i of all){
      const id_matched= i.dataset.id==id
      //console.log(id_matched, i.dataset.id, id)
      if(id_matched==true){
        i.classList.add('brightness-[0.7]')
        continue
      }
      i.classList.remove('brightness-[0.7]')
    }
  }
  
  defineExpose({
    set_data, get_focus_back, idle
  })
  
  
</script>

<template>

  
  <!--border is like padding for border image-->
	<div id=main class="flex relative max-w-[400px] p-1 self-center w-full overflow-scroll border-y-8 p-1 flex-1 justify-center items-start">
		<!--flex wrap=became multi line, that is why the parent handle the items-start-->
		<div class="flex flex-wrap gap-1 justify-center">
			<div @click="trait_selected($event, i.path, i.id)" v-for="i in data" id="item"  :data-id='i.id' class="TraitsDisplay_item size-[100px] p-[0.5px]">
			  <img :src="i.preview" class=" h-full w-full object-contain" alt="">
			</div>
		</div>
    <div v-if="is_no_data" class=" w-full flex justify-center self-center items-center">
      <p class="text-[#97814C]">[ No category selected. ]</p>
    </div>
	</div>
	
</template>

<style scoped>
	#main {
		image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/4.png");
		border-image-width: 5px;
		border-image-slice: 3 fill;
	}

	#item {
	  
		image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/3.png");
		border-image-width: 5px;
		border-image-slice: 3 fill;
	}
</style>
