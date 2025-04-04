<script setup>
  import { onMounted, ref } from 'vue' 
	import base_color from "../data/base_color.js";
	import ColorPicker from "./ColorPicker.vue";
	import Data from '@/data/current_data.js'
	const data= Data()
	const props= defineProps(['colors', 'idx_to_affect', 'tittle', 'last_id'])
	
	var color_data= props.colors
	var idx_to_affect= props.idx_to_affect
	const c_picker= ref()
	const tittle= props.tittle
	const emit = defineEmits(["skin_tone_selected", "reset"]);
	const main= ref()
	const scroll= ref()
	var current_idx = 0
	var default_idx = 0;
	//sk fot skin tones
  
  function scroll_colors(target_x=200){
    scroll.value.scrollTo({
      'top': 0,
      'left': target_x,
    })
  }

	
	function sk_selected(el, new_color) {
		emit("skin_tone_selected", new_color, 0);
		//console.log(new_color)
		const colors = document.querySelectorAll(".SkinTones_item");
		for (let i of colors) {
			//console.log(i)
			i.style.outline = "0px solid blue";
		}

		el.target.style.outline = "2px solid white";
	}


	function color_clicked(id) {
		current_idx = id;
		set_active(id);
	}
  
  function color_clicked_from_all(color){
    //emit('skin_tone_selected', color, idx_to_affect)
    current_idx= color_data.indexOf(color)
    set_active(color_data.indexOf(color))
  }
	function set_active(id, emit_call= true) {
	  //console.log(id)
	  
	  //if (data.loading_state.value==true) return
	  
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

	function click_arrow(dir) {
		if (dir == "right") {
			current_idx -= 1;
			if (current_idx < 0) {
				current_idx = 0;
			}
		} else if (dir == "left") {
			current_idx += 1;
			if (current_idx > color_data.length - 1) {
				current_idx = color_data.length - 1;
			}
		}

		set_active(current_idx);
	}
	
	function on_swipe(dir, mouse) {
		if (dir == "right") {
			current_idx -= 1;
			if (current_idx < 0) {
				current_idx = 0;
			}
		} else if (dir == "left") {
			current_idx += 1;
			if (current_idx > color_data.length - 1) {
				current_idx = color_data.length-1;
			}
		}
		//console.log(current_idx);
		set_active(current_idx);
	}
	
	function show_all_c(){
	  c_picker.value.set_active('Colors')
	}
	
	onMounted(()=>{
	
	  //console.log(this.$refs)
	  set_active(props.last_id, false)
	  //console.log('new',props.last_id)
	  c_picker.value.set_colors(color_data)
	})
	
	defineExpose({
	  set_active
	})
	
	
</script>

<template>
	<div ref="main" v-touch:swipe="on_swipe" class="relative max-w-[356px] flex gap-2 items-center self-center w-full">
    <ColorPicker @color_selected="color_clicked_from_all" ref="c_picker"></ColorPicker>
		<div class="flex lg:flex-col lg:items-start lg:overflow-visible flex-1 overflow-hidden gap-2 lg:gap-0 items-center">
		  <div @click="show_all_c" class="group flex items-center gap-1">
  			<p class="text-xs min-w-max  ">{{tittle}}</p>
		    <img class="group-active:opacity-60 lg:hidden" width=14 src="/arrow_down.png" alt="">
		  </div>
			<div class="flex flex-1 overflow-hidden items-center gap-2">
				<p @click="click_arrow('right')" class="lg:hidden"><</p>
				<div ref="scroll" class="scroll flex flex-1 lg:flex-wrap p-1 justify-self-start gap-1 overflow-hidden">
					<div v-for="i in color_data" @click="color_clicked(color_data.indexOf(i))" :data-id="color_data.indexOf(i)" :style="{ 'background-color': `#${i.preview}` }" class="SkinTones_item outline-offset-1 min-h-[24px] min-w-[24px] border-b-2 border-[#97814C]"></div>
				</div>
				<p @click="click_arrow('left')" class="lg:hidden">></p>
			</div>
		</div>
	</div>
	
</template>

<style scoped>
	.reset {
		image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/8.png");
		border-image-width: 8px;
		border-image-slice: 4 fill;
	}
	.scrolll{
	  scroll-behavior: smooth
	}
</style>
