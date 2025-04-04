<script setup>
  import {ref} from 'vue'
  var main= ref()
  var props= defineProps(['color_data', 'tittle' ])
  
  function color_clicked(color, id){
    if (data.loading_state.value==true) return
		const colors = main.value.querySelectorAll(".SkinTones_item");
		//console.log(base_color[id])
	  scroll_colors(id/color_data.length*scroll.value.scrollWidth)
		for (let i of colors) {
			//console.log(i)
			if (i.dataset.id == id) {
				i.style.outline = "2px solid white";
				continue;
			}
			i.style.outline = "0px solid blue";
		}
		if(emit_call) emit("skin_tone_selected", color_data[id], idx_to_affect, id);
  }
</script>

<template>
  <div class="flex flex-col max-w-[300px] my-5">
    <p class="text-sm">{{props.tittle}}</p>
    <div ref="main" class="flex flex-wrap gap-1">
      <div @click="" v-for="i in color_data" :style="{ 'background-color': `#${i.preview}` }" class="item min-w-[32px] min-h-[32px] bg-blue-100 border-b-2 border-[#97814C]"></div>
    </div>
  </div>
</template>