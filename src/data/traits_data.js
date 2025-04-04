import { ref, toRaw } from "vue";
import Colors from "./colors.js";
const colors = Colors;
const traits = [
  "Shape",
  "Eye",
  "Brows",
  "Nose",
  "Mouth",
  "Beard",
  "Mark1",
  "Mark2",
  "Hair",
  "Bangs",
  "Hat",
  "Shirt",
  "Sleeve",
  "Top",
  "Special",
  "Acc1",
  "Acc2"
];
var data = ref([
  {
    name: "top",
    max_trait: 17,
    total_color: 1,
    colors: [colors.univ],
    last_selected_trait_id: 0,
    base_path: "../images/traits/top/",
    preview_path: "../images/traits/preview/top/"
  },
  // {
  //   'name': 'special',
  //   'max_trait': 20,
  //   'total_color': 1,
  //   'colors':  [colors.hair],
  //   'last_selected_trait_id':0,
  //   'base_path': '../images/traits/special/',
  //   'preview_path': ''

  // },
  {
    name: "special",
    max_trait: 20,
    total_color: 3,
    colors: [colors.univ, colors.univ, colors.univ],
    last_selected_trait_id: 0,
    base_path: "../images/traits/special/",
    preview_path: "../images/traits/preview/special/"
  },
  {
    name: "sleeve",
    max_trait: 13,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/sleeve/",
    preview_path: "../images/traits/preview/sleeve/"
  },
  {
    name: "shirt",
    max_trait: 20,
    total_color: 2,
    colors: [colors.univ, colors.univ],
    last_selected_trait_id: 0,
    base_path: "../images/traits/shirt/",
    preview_path: "../images/traits/preview/shirt/"
  },
  {
    name: "nose",
    max_trait: 14,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/nose/",
    preview_path: "../images/traits/preview/nose/"
  },
  {
    name: "mouth",
    max_trait: 12,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/mouth/",
    preview_path: "../images/traits/preview/mouth/"
  },
  {
    name: "mark1",
    max_trait: 14,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/mark/",
    preview_path: "../images/traits/preview/mark2/"
  },
  {
    name: "mark2",
    max_trait: 14,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/mark/",
    preview_path: "../images/traits/preview/mark1/"
  },
  {
    name: "shape",
    max_trait: 16,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/face_shape/",
    preview_path: "../images/traits/preview/shape/"
  },
  {
    name: "eye",
    max_trait: 13,
    total_color: 1,
    colors: [colors.eye],
    last_selected_trait_id: 0,
    base_path: "../images/traits/eye/",
    preview_path: "../images/traits/preview/eye/"
  },
  {
    name: "brows",
    max_trait: 9,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/brows/",
    preview_path: "../images/traits/preview/brows/"
  },
  {
    name: "beard",
    max_trait: 14,
    total_color: 1,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/beard/",
    preview_path: "../images/traits/preview/beard/"
  },
  {
    name: "acc1",
    max_trait: 42,
    total_color: 1,
    colors: [colors.univ],
    last_selected_trait_id: 0,
    base_path: "../images/traits/acc/",
    preview_path: "../images/traits/preview/acc1/"
  },
  {
    name: "acc2",
    max_trait: 42,
    total_color: 1,
    colors: [colors.univ],
    last_selected_trait_id: 0,
    base_path: "../images/traits/acc/",
    preview_path: "../images/traits/preview/acc2/"
  },
  {
    name: "hair",
    max_trait: 39,
    total_color: 1,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/hair/",
    preview_path: "../images/traits/preview/hair/"
  },
  {
    name: "bangs_shadow",
    max_trait: 0,
    total_color: 0,
    colors: [colors.hair],
    last_selected_trait_id: 0,
    base_path: "../images/traits/bangs_shadow/",
    preview_path: "../images/traits/preview/bangs_shadow/"
  },
  {
    name: "bangs",
    total_color: 0,
    colors: [colors.hair],
    max_trait: 32,
    last_selected_trait_id: 0,
    base_path: "../images/traits/bangs/",
    preview_path: "../images/traits/preview/bangs/"
  },
  {
    name: "hat",
    total_color: 1,
    colors: [colors.univ],
    max_trait: 40,
    last_selected_trait_id: 0,
    base_path: "../images/traits/hat/",
    preview_path: "../images/traits/preview/hat/"
  },
  {
    name: "hat_bottom",
    total_color: 1,
    colors: [colors.hair],
    max_trait: 40,
    last_selected_trait_id: 0,
    base_path: "../images/traits/hat_bottom/",
    preview_path: "../images/traits/preview/hat_bottom/"
  },
  {
    name: "base",
    max_trait: 2,
    colors: [colors.base],
    total_color: 1,
    last_selected_trait_id: 0,
    base_path: "../images/base/",
    preview_path: "../images/traits/preview/base/"
  }
]);

function get_data(name) {
  for (let i of data.value) {
    if (i.name == name) {
      return i;
    }
  }
}

function get_random_colors(_colors){
  var r= []
  for(let i of _colors){
    var random=Math.floor(Math.random() * (i.length-1))
    r.push(toRaw(i[random]))
  }
  return r
}

export default function useTraitsDetail() {
  return {
    data,
    get_data,
    get_random_colors,
  };
}
