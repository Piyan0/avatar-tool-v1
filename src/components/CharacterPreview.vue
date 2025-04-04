<script setup>
  //IMPORTANT change the current_category in order for trait can be changed, for example, if we want to modify base, set the current_category to base.
  import {onMounted, ref, toRaw} from "vue";
  import Data from "@/data/current_data.js";
  import TraitsData from "@/data/traits_data.js";
  import TraitList from "@/data/trait_list.js";
  import NinePatch from "./NinePatch.vue";
  import base_color from "@/data/base_color.js";
  import univ_color from "@/data/univ_color.js";
  import colors, {get_color_by_id, change_colors_to_id, colors_from_id, get_color_by_global_id, color_to_global_id, change_colors_to_global_id, colors_from_global_id, get_color_category, get_random_colors, get_random_color} from "@/data/colors.js";
  import trait_dependent from "@/data/trait_dependent.js";
  import color_dependent from "@/data/color_dependent.js";
  import * as SimpleBase from "simple-base";

  var reset_data = [];
  const is_transparent = ref(false);
  const current_data = Data();
  const use_traits_data = TraitsData();
  const loading = ref(current_data.loading_state);
  const last_color_changed = ref(current_data.last_color_changed);
  const size = [128, 135];
  const character_img = ref("character_img");
  //use this flag wether can process color or not, for performance reason.So, only click the traits won't process color
  const previous_gender = ref("male");
  const base_gender = current_data.current_gender;
  const depends_color = color_dependent;
  const depends_traits = trait_dependent;

  var want_to_reset = false;
  var master_image = null;
  var can_change_color = ref(false);
  //the data of the selected traits.
  var data = TraitList;
  var current_category = current_data.current_category;
  var current_trait_id = current_data.current_trait_id;

  function get_cat(category) {
    for (let i of data) {
      if (i.name == category) {
        return i;
      }
    }
  }

  async function change_dependant_color(parent, child, take, place) {
    //console.log('previous shit>>', current_category.value)
    //current_category.value= child
    get_cat(child).replaceColor[place] = get_cat(parent).replaceColor[take];
    //console.log('---P')
    //console.log(get_cat(child).replaceColor)
    //console.log('---C')
    //console.log(get_cat(parent).replaceColor)
    //console.log(data)
    //await set_up_data();
  }

  async function change_dependant_trait(parent, child, id) {
    var path = use_traits_data.get_data(child).base_path + `${id}.png`;
    //console.log('child>>',path)
    use_traits_data.get_data(child).last_selected_trait_id = id;
    get_cat(child).path = path;
    get_cat(child).replaceColor = get_cat(parent).replaceColor;
    get_cat(child).defaultColor = get_cat(parent).defaultColor;
    //await set_up_data();
  }

  //a bit of error here, it takes all the current ctx..note: fixed by using sub canvas.
  //Bookmark1
  var force_update = [];
  async function set_up_data(_data = data) {
    if (loading.value == true) return;
    loading.value = true;

    //console.log(use_traits_data.data.value)

    const main_canvas = document.createElement("canvas");
    const ctx = main_canvas.getContext("2d");
    var canvas_size_setted = false;
    //console.log(data)

    for (let i of _data) {
      if (i.name == "special") {
        if (i.path.includes(0)) {
          torso_mode = "shirt";
          prev_torso_mode = "shirt";
        } else {
          torso_mode = "special";
          prev_torso_mode = "special";
        }
        //console.log('>>>',torso_mode)
      }
      //traits color that depends_color on other, 'with' depends_color on 'parent'
      //check if there is already cached category, since we do loops everytime there is a change, so don't continue loop if the cached image is already there.
      const is_gender_just_changed = () => base_gender.value != previous_gender.value;
      //in order to change traits, we need to set the category, bangs shadow is not one of the category...
      if (want_to_reset == false && i.name != "bangs_shadow" && i.name != "hat_bottom" && force_update.includes(i.name) == false && i.transparent == false && current_category.value != i.name && i.last_image != null && is_gender_just_changed() == false) {
        //console.log('Drawing from last image', i.name)
        if (canvas_size_setted == false) {
          main_canvas.width = i.last_image.width;
          main_canvas.height = i.last_image.height;
          canvas_size_setted = true;
        }
        ctx.drawImage(i.last_image, 0, 0);
        continue;
      }

      //console.log(i.name)
      //console.log(i.name);
      const img = new Image();
      //using URL object for dynamic image ( Can't use an alias ), the .href props.
      img.src = new URL(i.path, import.meta.url).href;
      //console.log('>>>', i.path)
      await new Promise((res) => {
        img.onload = async () => {
          const sub_canvas = document.createElement("canvas");
          const sub_ctx = sub_canvas.getContext("2d");
          if (canvas_size_setted == false) {
            // I just know that setting canvas size will reset canvas content.
            main_canvas.width = img.width;
            main_canvas.height = img.height;
            canvas_size_setted = true;
          }
          sub_canvas.width = img.width;
          sub_canvas.height = img.height;
          //sub_ctx.drawImage(img, 0, 0);

          // Add offset to spesific base, female in this case.
          const offset_traits_for_female = (traits_name) => {
            var offset_traits = ["hair", "bangs", "bangs_shadow", "shape", "bangs_bottom", "hat", "hat_bottom", "acc1", "acc2", "eye", "brows", "mouth", "nose", "mark1", "mark2", "beard"];
            return offset_traits.includes(traits_name);
          };
          // Female base has offset for traits.
          if (base_gender.value == "female" && offset_traits_for_female(i.name)) {
            await add_traits_to_canvas(sub_ctx, i.name, {
              path: i.path,
              offset_x: 0,
              offset_y: 3,
            });
          } else {
            await add_traits_to_canvas(sub_ctx, i.name, {
              path: i.path,
              offset_x: 0,
              offset_y: 0,
            });
          }

          //region color replacement sections
          //kunai
          var combined_colors = (arr) => {
            var r = [];
            for (let n of arr) {
              for (let m of n.rgba) {
                r.push(m);
              }
            }
            //console.log(r)
            return r;
          };
          var x = combined_colors(i.defaultColor);
          var y = combined_colors(i.replaceColor);
          if (JSON.stringify(x) != JSON.stringify(y)) {
            var changed = await _change_colors(sub_canvas.toDataURL(), {x: 128, y: 135}, x, y);
            sub_ctx.drawImage(changed, 0, 0);
          } else {
            //createElementonsole.log('Same')
          }

          var sub_img = new Image();
          sub_img.src = sub_canvas.toDataURL();

          await new Promise((_res) => {
            sub_img.onload = () => {
              i.last_image = sub_img;
              ctx.drawImage(sub_img, 0, 0);
              _res();
            };
          });
          //endregion
          res();
        };
      });

      if (i.transparent == true && i.name != "acc1" && i.name != "acc2") {
        //used white color as transparent hint.
        change_color(ctx, ctx.getImageData(0, 0, main_canvas.width, main_canvas.height), [255, 255, 255, 255], [255, 255, 255, 0]);
      }
    }
    //console.log('anjay')
    master_image = new Image();
    master_image.src = main_canvas.toDataURL();
    character_img.value.src = main_canvas.toDataURL();
    loading.value = false;
  }

  async function substract_color_shade(
    img_path = "./test.png",
    target_color = [
      [119, 79, 33, 255],
      [145, 99, 46, 255],
    ],
    replace_color = [
      [10, 0, 100, 255],
      [100, 100, 0, 255],
    ],
  ) {
    //console.time('substract_color_shade')

    var img = new Image();

    img.src = img_path;

    await new Promise((res) => {
      img.onload = res;
    });

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var _data = img_data.data;
    for (let i = 0; i < _data.length; i += 4) {
      var current_col = [_data[i], _data[i + 1], _data[i + 2], _data[i + 3]];
      let matched = false;
      for (let j = 0; j < target_color.length; j += 1) {
        if (current_col.every((val, idx) => val == target_color[j][idx])) {
          _data[i] = replace_color[j][0];
          _data[i + 1] = replace_color[j][1];
          _data[i + 2] = replace_color[j][2];
          _data[i + 3] = replace_color[j][3];
          matched = true;
          break;
        }
      }
      if (!matched) {
        _data[i + 3] = 0;
      }
    }
    ctx.putImageData(img_data, 0, 0);
    //
    var result_image = new Image();
    result_image.src = canvas.toDataURL();
    await new Promise((res) => {
      result_image.onload = res;
    });
    //console.timeEnd('substract_color_shade')
    return result_image;
  }

  async function _change_colors(base_img, size, array_of_target, array_of_shade) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = size.x;
    canvas.height = size.y;

    var base_image = new Image();
    base_image.src = base_img;
    await new Promise((res) => {
      base_image.onload = res;
    });
    ctx.drawImage(base_image, 0, 0);

    var new_shade = await substract_color_shade(base_img, array_of_target, array_of_shade);
    ctx.drawImage(new_shade, 0, 0);

    var result = new Image();
    result.src = canvas.toDataURL();
    await new Promise((res) => {
      result.onload = res;
    });
    return result;
  }

  async function add_traits_to_canvas(ctx, _category, _data) {
    const need_extra = () => {
      if (base_gender.value == "male") {
        //console.log("Traits don't need extra, since it was male.")
        return false
      };
      const _traits = ["hair", "shirt", "special", "top"];
      var cat_in_offset= _traits.includes(_category)
      if(!cat_in_offset){
        //console.log({info: "category is not in extra list.", category: _category})
      }
      return cat_in_offset
    };

    //console.log(_category, need_extra(), base_gender.value)

    if (need_extra()) {
      //TODO category must be hair, or needed extra.
      //Still error whem changing gender.
      const id = use_traits_data.get_data(_category).last_selected_trait_id;
      const extra_path = `../images/traits/extras/${_category}/${id}.png`;
      //console.log(extra_path);
      const cvs = document.createElement("canvas");
      cvs.width = size[0];
      cvs.height = size[1];
      const _ctx = cvs.getContext("2d");
      await draw_img(_ctx, _data.path);
      await draw_img(_ctx, extra_path);
      change_color(_ctx, _ctx.getImageData(0, 0, size[0], size[1]), [255, 255, 255, 255], [255, 255, 255, 0]);
      var result = new Image();
      result.src = cvs.toDataURL();
      await new Promise((res) => {
        result.onload = () => {
          ctx.drawImage(result, _data.offset_x, _data.offset_y);
          res();
        };
      });
    } else {
      var _img = new Image();
      _img.src = new URL(_data.path, import.meta.url).href;
      await new Promise((res) => {
        _img.onload = () => {
          ctx.drawImage(_img, _data.offset_x, _data.offset_y);
          res();
        };
      });
    }
  }

  async function draw_img(ctx, path, offset) {
    var _img = new Image();
    _img.src = new URL(path, import.meta.url).href;

    await new Promise((res) => {
      _img.onload = () => {
        ctx.drawImage(_img, 0, 0);
        res();
      };
    });
  }
  function download_avatar() {
    if (master_image == null) {
      return;
    }
    const upscale = 6;

    const cvs = document.createElement("canvas");
    const ctx = cvs.getContext("2d");
    //this not work..
    //ctx.imageSmoothingEnabled= false

    cvs.width = master_image.width * upscale;
    cvs.height = master_image.height * upscale;

    //and this work! done: setting size will reset canvas.
    ctx.imageSmoothingEnabled = false;

    if (is_transparent.value == false) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, master_image.width * upscale, master_image.height * upscale);
    }

    ctx.drawImage(master_image, 0, 0, cvs.width, cvs.height);

    const a = document.createElement("a");
    a.href = cvs.toDataURL("image/png");
    a.download = "untitled_avatar.png";
    a.click();
  }

  //use space each element, [r, g, b, a].
  function change_color(ctx, imgdata, _color, color_replacing) {
    //console.log('changing color',current_category.value, _color, color_replacing)
    if (is_color_equal(_color, color_replacing)) return;

    for (let j = 0; j < imgdata.data.length; j += 4) {
      const equal = is_color_equal(_color, [imgdata.data[j], imgdata.data[j + 1], imgdata.data[j + 2], imgdata.data[j + 3]]);
      //previous one is indeed equal.
      if (equal == true) {
        imgdata.data[j] = color_replacing[0];
        imgdata.data[j + 1] = color_replacing[1];
        imgdata.data[j + 2] = color_replacing[2];
        imgdata.data[j + 3] = color_replacing[3];
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  //when load, it need to be set too!
  var torso_mode = "shirt";
  var prev_torso_mode = "shirt";

  function change_trait_path(path, id, _category) {
    get_cat(_category).path = path;
    use_traits_data.get_data(_category).last_selected_trait_id = id;
  }
  async function catch_trait_change(_category = "hats", new_path = "../images/traits/hats/1.png", id = 0) {
    if (_category != "base") {
      current_trait_id.value = id;
    }

    if (_category == "special") {
      torso_mode = "special";
    } else if (["top", "shirt", "sleeve"].includes(_category)) {
      torso_mode = "shirt";
    }

    if (torso_mode == "special" && prev_torso_mode != "special") {
      change_trait_path(use_traits_data.get_data("shirt").base_path + "0.png", 0, "shirt");
      change_trait_path(use_traits_data.get_data("top").base_path + "0.png", 0, "top");
      change_trait_path(use_traits_data.get_data("sleeve").base_path + "0.png", 0, "sleeve");

      use_traits_data.get_data('shirt').last_selected_trait_id=0
      use_traits_data.get_data('top').last_selected_trait_id=0
      use_traits_data.get_data('sleeve').last_selected_trait_id=0
      
      force_update.push("shirt");
      force_update.push("top");
      force_update.push("sleeve");
    } else if (torso_mode == "shirt" && prev_torso_mode != "shirt") {
      change_trait_path(use_traits_data.get_data("special").base_path + "0.png", 0, "special");
      force_update.push("special");
      use_traits_data.get_data('special').last_selected_trait_id=0
    }

    //console.log(torso_mode)

    const _data = data;
    var target = null;
    for (let i of _data) {
      if (i.name == _category) {
        target = i;
        break;
      }
    }
    target.path = new_path;
    //console.log('target>>',target.name)
    //await set_up_data();
    if (current_category.value != "base") {
      use_traits_data.get_data(current_category.value).last_selected_trait_id = new_path.match(/(\d+).png$/)[1];
    }
    //force_update= []
    var _temp_category = current_category.value;
    if (depends_traits[current_category.value] != undefined) {
      for (let i of depends_traits[current_category.value]) {
        //if (current_category.value!= i.parent) continue
        force_update.push(i.child);
        change_dependant_trait(i.parent, i.child, use_traits_data.get_data(i.parent).last_selected_trait_id);
      }
    }
    //console.log('>>',force_update)
    await set_up_data();
    force_update = [];
    current_category.value = _temp_category;
    prev_torso_mode = torso_mode;
  }

  function set_category(new_category) {
    current_category.value = new_category;
  }

  //set the category before changing the color.
  //follow the original color data data structure defined in base_color.js
  async function catch_color_change(new_color, idx) {
    //console.log(new_color);
    force_update = [];
    last_color_changed.value = current_category.value;
    let target = null;
    for (let i of data) {
      if (i.name == current_category.value) {
        target = i;
        break;
      }
    }
    target.replaceColor[idx] = new_color;
    //await set_up_data();
    //return
    var _temp_category = current_category.value;
    if (depends_color[current_category.value] != undefined) {
      for (let i of depends_color[current_category.value]) {
        if (i.parent != current_category.value) continue;
        force_update.push(i.child);
        //console.log('previous>>', current_category.value)
        change_dependant_color(i.parent, i.child, i.take, i.place);
      }
    }
    await set_up_data();
    force_update = [];
    current_category.value = _temp_category;
  }
  //RGBA array, ex. [1,1,1,1], A is alpha (opacity).
  function is_color_equal(arr, arr2) {
    //console.log(arr, arr2)
    return JSON.stringify(arr) == JSON.stringify(arr2);
  }

  async function reset() {
    want_to_reset = true;
    base_gender.value = "male";
    for (let i of data) {
      i.last_image = null;
      i.replaceColor = JSON.parse(JSON.stringify(i.defaultColor));
      i.path = use_traits_data.get_data(i.name).base_path + "0.png";
      if (i.name == "base") {
        i.path = use_traits_data.get_data(i.name).base_path + "base.png";
      }
    }

    for (let i of use_traits_data.data.value) {
      i.last_selected_trait_id = 0;
    }

    await set_up_data();
    //console.log(data)
    //console.log(current_category.value)
    want_to_reset = false;
  }

  async function load() {
    var data_obtained = JSON.parse(localStorage.getItem("avatar_saved"));
    if (data_obtained == null) return;
    want_to_reset = true;
    data = JSON.parse(data_obtained.traits);
    base_gender.value = data_obtained.gender;
    use_traits_data.data.value = JSON.parse(data_obtained.last_data);
    await set_up_data();
    want_to_reset = false;
  }
  function save() {
    var saved_data = {};
    saved_data.traits = JSON.stringify(data);
    saved_data.last_data = JSON.stringify(use_traits_data.data.value);
    saved_data.gender = base_gender.value;
    localStorage.setItem("avatar_saved", JSON.stringify(saved_data));
  }

  async function randomize() {
    torso_mode = "shirt";
    prev_torso_mode = "shirt";
    get_cat("special").path = "../images/traits/special/0.png";
    for (let i of data) {
      if (i.name == "base" || i.name == "special" || i.name == "acc2" || i.name == "mark2" || i.name == "sleeve") continue;
      i.last_image = null; //setting last image to null, otherwise it will be not continued the loop at set_up_data (it used last_image instead, if last_image!= null)
      var random = Math.ceil(Math.random() * toRaw(use_traits_data.get_data(i.name).max_trait - 1));
      use_traits_data.get_data(i.name).last_selected_trait_id = random;

      if (random == 0) {
        random += 1;
      }
      i.path = toRaw(use_traits_data.get_data(i.name).base_path) + `${random}.png`;
      var total_color = use_traits_data.get_data(i.name).total_color;
      if (total_color > 0 && i.name != "base") {
        for (let j = 0; j < i.replaceColor.length; j += 1) {
          i.replaceColor[j] = get_random_color(i.replaceColor[j]);
        }
      }
      // console.log(i.replaceColor.length)
    }
    
    //change base color
    get_cat('base').replaceColor= [base_color[Math.floor(Math.random()* (base_color.length-1))]]
    //dependent traits
    for (let i in depends_traits) {
      for (let j of depends_traits[i]) {
        //using regex here, well, I could set the last_selected_trait_id above, but this works!
        var id = get_cat(j.parent).path.match(/(\d+).png$/)[1];
        change_dependant_trait(j.parent, j.child, id);
      }
    }

    for (let i in depends_color) {
      for (let j of depends_color[i]) {
        change_dependant_color(j.parent, j.child, j.take, j.place);
      }
    }
    want_to_reset= true
    await set_up_data();
    want_to_reset= false
    //console.log(toRaw(use_traits_data.data));
  }

  function to_url() {
    var mini = [];
    var r = "";
    //fill based on array
    for (let i of data) {
      var _last_selected_trait_id = use_traits_data.get_data(i.name).last_selected_trait_id;
      if (i.name == "base") {
        if (base_gender.value == "male") {
          _last_selected_trait_id = "base";
        } else {
          _last_selected_trait_id = "female";
        }
      }
      mini.push({
        last_selected_trait_id: _last_selected_trait_id,
        colors: i.replaceColor,
      });
    }
    for (let i of mini) {
      r += JSON.stringify(change_colors_to_global_id(i.colors));
      r += "+";
      r += i.last_selected_trait_id;
      r += ".";
    }

    var obj = {
      url: window.location.origin + window.location.pathname + "?p=" + SimpleBase.encode(r, 36),
      str: r,
    };
    console.log(r);
    return obj;
  }

  async function from_url(_url = "2ex00w8xq7to10bmo0fjrhrguibvk2zpytv6apggw87v53x5zybu86hcq2giwp8drle5jb86l787wohpdwxx3k3ksqs28kfemadi7e17d5g5k9ty8hj9bpkrc82s3mpk2ssrcalqwt071a1x7o1iaunfz1r1m08zgkb8i7zkjbvsxm6o6vycbm9wivvo5dyscqqbyvuc2g4u4ezret0n2ofhnxl9wakcqkfa0w7iruufv8m5fbfodusst6bhwamt95ku02hu47v5y389qich6pa") {
    //url= SimpleBase.base36.decode(url)
    _url = SimpleBase.base36.decode(_url);
    //console.log(_url);
    if (_url.includes("female")) {
      base_gender.value = "female";
      previous_gender.value = "female";
    } else {
      base_gender.value = "male";
      previous_gender.value = "male";
    }
    var spl = _url.split(".");
    //console.log(_url)
    //return
    var parsed = [];
    //console.log(spl)
    for (let i = 0; i < data.length; i += 1) {
      var _spl = spl[i].split("+");

      parsed.push({
        colors: colors_from_global_id(JSON.parse(_spl[0])),
        last_selected_trait_id: _spl[1],
      });
    }

    for (let i = 0; i < data.length; i += 1) {
      use_traits_data.get_data(data[i].name).last_selected_trait_id= parsed[i].last_selected_trait_id
      data[i].replaceColor = parsed[i].colors;
      data[i].path = use_traits_data.get_data(data[i].name).base_path + `${parsed[i].last_selected_trait_id}.png`;
    }
    //console.log(data);
    want_to_reset = true;
    await set_up_data();
    want_to_reset = false;
  }
  function set_is_transparent(cond) {
    is_transparent.value = cond;
  }
  onMounted(async () => {
    var url = new URLSearchParams(window.location.search);
    if (url != "") {
      from_url(url.get("p"));
      return;
    }
    await set_up_data();
  });

  function test() {
    console.log(get_color_category(univ_color[0]));
  }

  //define expose using ref, and the property will bound to component instance, else, it is just a plain data, not bound to anything.
  defineExpose({
    catch_color_change,
    catch_trait_change,
    can_change_color,
    current_category,
    set_category,
    base_gender,
    previous_gender,
    loading,
    download_avatar,
    reset,
    save,
    randomize,
    is_transparent,
    set_is_transparent,
    load,
    to_url,
  });
</script>

<template>
  <!--<button @click="to_url()" >share</button>-->
  <!--<button @click="from_url()" >from</button>-->

  <div id="main" class="max-h-[200px] max-w-[356px] lg:min-w-[310px] lg:min-h-[250px] relative flex flex-1 flex-col">
    <img src="/loading.gif" v-show="loading" class="absolute w-[48px] right-2 bottom-2" alt="" />
    <div id="detail" class="flex items-center gap-2 mx-2">
      <img width="16" class="" src="../images/icon/love.png" alt="" />
      <p class="text-amber-100 text-xs">* Untitled_avatar.png</p>
    </div>

    <div id="content" class="overflow-hidden flex rounded-xl flex-1 pb-1 relative justify-center">
      <div v-if="is_transparent" class="bg-transparent h-full w-full top-0 left-0 absolute"></div>
      <img ref="character_img" src="../images/base/base.png" id="image" class="z-10" alt="" />
    </div>
  </div>
</template>
<!-- -->

<style scoped>
  .bg-transparent {
    background-image: url('../../public/bg_transparent.png');
  }
  .d {
    border: 2px solid blue;
  }

  #image {
    image-rendering: pixelated;
  }

  #detail {
    height: 28px;
  }
  #main {
    image-rendering: pixelated;

    border-image-source: url("../images/nine_patch/1.png");
    border-image-width: 40px;
    border-image-slice: 20 fill;
  }
</style>
