<script setup>
import { ref, nextTick, toRaw } from "vue";
import Data from "./data/current_data.js";
import TraitsData from "./data/traits_data.js";
import CharacterPreview from "./components/CharacterPreview.vue";
import ColorPicker from "./components/ColorPicker.vue";
import TraitsDisplay from "./components/TraitsDisplay.vue";
import TraitsBar from "./components/TraitsBar.vue";
import Control from "./components/Control.vue";
import Tools from "./components/Tools.vue";
import SkinTone from "./components/SkinTones.vue";
import ColorSelection from "./components/ColorSelection.vue";
import ColorSelectionWide from "./components/ColorSelectionWide.vue";

const data = Data();

const use_traits_data = TraitsData();
var avatar = ref(null);
const c_picker = ref();
const control = ref();
const traits_display = ref();
const traits_bar = ref();
const color_selection = ref();

async function test(col, idx) {
  //exported ref, but we don't need to add .value to set it.
  avatar.value.can_change_color = true;
  console.log(avatar.value.can_change_color);
  await avatar.value.catch_change_color(col, idx);
  avatar.value.can_change_color = false;
}

function request_color_open(color_idx) {
  c_picker.value.set_active(color_idx);
}

async function on_skin_tone_selected(new_color, idx) {
  var last_category = avatar.value.current_category;
  avatar.value.current_category = "base";
  await avatar.value.catch_color_change(new_color, idx);
  avatar.value.set_category(last_category);
}

async function on_gender_changed(gender_name) {
  traits_display.value.idle();
  traits_bar.value.idle();
  //TODO get the copy of this var, done, using toRaw from vue

  if (gender_name == "male") {
    avatar.value.base_gender = "male";
    avatar.value.current_category = "base";
    await avatar.value.catch_trait_change("base", "../images/base/base.png");
    avatar.value.previous_gender = "male";
    //avatar.value.current_category = data.non_base_category.value;
    return;
  }
  avatar.value.base_gender = "female";
  avatar.value.current_category = "base";
  await avatar.value.catch_trait_change("base", "../images/base/female.png");
  avatar.value.previous_gender = "female";
  //avatar.value.current_category = data.non_base_category.value;

  return;
}

async function on_category_selected(category_name) {
  control.value.disable_gender_button();
  //c_picker.value.set_active("", false);
  var _colors = use_traits_data.get_data(category_name).colors;
  //c_picker.value.set_colors(_colors);
  //control.value.set_tittle(`Colors ( ${category_name.toUpperCase()} )`)
  //control.value.set_max(use_traits_data.get_data(category_name).total_color)
  //
  var _data = use_traits_data.get_data(category_name);
  traits_display.value.set_data({
    base_path: _data.base_path,
    max_trait: _data.max_trait,
    last_selected_trait_id: _data.last_selected_trait_id,
    preview_path: _data.preview_path
  });
  traits_display.value.get_focus_back(_data.last_selected_trait_id);
}

function on_trait_selected(path, id, category_name) {
  //abort if the changes is not fully complete.
  if (avatar.value.loading == true) return;
  avatar.value.catch_trait_change(category_name, path, id);
}

function on_color_selected(color, idx) {
  //console.log('idx is', idx)
  if (data.current_category == "base") {
    on_skin_tone_selected(color, idx);
    return;
  }
  avatar.value.catch_color_change(color, idx);
}

async function on_tools_clicked(tool_name) {
  switch (tool_name) {
    case "download":
      avatar.value.download_avatar();
      break;
    case "save":
      avatar.value.save()
      break;
    case "random":
      await avatar.value.randomize();
      break;
    case "bg":
      await avatar.value.set_is_transparent(!avatar.value.is_transparent);
      break;
    case "load":
      await avatar.value.load()
      break;
    case "share":
      console.log('-g')
      navigator.clipboard.writeText(avatar.value.to_url().url)
  }
}

async function on_reset() {
  color_selection.value.idle()
  await avatar.value.reset();
  //control.value.set_gender_active(data.current_gender.value)
}
</script>

<template>
  
  <div class="relative container">
    <!--<div class="fixed w-full h-full z-20 top-0 left-0 flex justify-center items-center">-->
    <!--  <div class="absolute w-[80vw] h-[80vh] flex justify-center items-center border-4 border-[#5E1818]">-->
    <!--    <img src="./images/icon/close.png" class="absolute top-2 right-2 z-30" width=10 alt="">-->
    <!--    <div class="absolute h-full w-full bg-[#5E1818] opacity-60"></div>-->
    <!--    <p class="text-[#DBBD77] z-30 text-sm">* We can add 'about' content here!</p>-->
    <!--  </div>-->
    <!--</div>-->

    <div class="bg-[#BD702A] flex flex-col p-1 min-h-screen max-h-screen">
      <!--<ColorPicker @color_selected="on_color_selected" ref="c_picker"></ColorPicker>-->
      <div class="px-3 flex bg-[#5E1818] justify-between items-center">
        <div class="flex flex-col py-2">
          <p
            style="text-shadow: -2px -2px 0 #783a2b"
            class="text-xl text-[#DBBD77] drop-shadow drop-shadow-xl"
          >
            Avatar Tools
          </p>
          <!--<p class="text-xs text-[#DBBD77] opacity-60" >Art & code : Piyan</p>-->
        </div>
        <!--<p class="text-xs border-b-2 border-[#DBBD77] text-[#DBBD77]">About</p>-->
      </div>
      <div
        class=" gap-1 p-2 overflow-hidden flex flex-1 flex-col lg:flex-row lg:justify-center bg-[#DBBD77] rounded-md p-1 m-1"
      >
        <div class="flex lg:gap-3 flex-col">
          <div class="flex w-full justify-center self-center gap-2">
            <CharacterPreview ref="avatar"></CharacterPreview>
            <Control
              ref="control"
              @reset="on_reset"
              @gender_changed="on_gender_changed"
            ></Control>
          </div>
          <ColorSelection ref="color_selection" @color_selected="on_color_selected"></ColorSelection>
        </div>

        <div
          class="flex flex-1 lg:flex-initial flex-col overflow-hidden"
        >
          <div class="flex justify-center gap-2">
            <
            <TraitsBar
              ref="traits_bar"
              @category_selected="on_category_selected"
            ></TraitsBar>
            >
          </div>

          <TraitsDisplay
            @trait_selected="on_trait_selected"
            ref="traits_display"
          ></TraitsDisplay>
          <Tools @tools_clicked="on_tools_clicked"></Tools>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
img {
  image-rendering: pixelated;
}
</style>
