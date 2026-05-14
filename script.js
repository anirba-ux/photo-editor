// ==========================================
// DEFAULT FILTERS
// ==========================================

const defaultFilters = {

  brightness: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%"
  },

  contrast: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%"
  },

  saturation: {
    value: 100,
    min: 0,
    max: 300,
    unit: "%"
  },

  grayscale: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%"
  },

  sepia: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%"
  },

  blur: {
    value: 0,
    min: 0,
    max: 10,
    unit: "px"
  },

  hueRotation: {
    value: 0,
    min: 0,
    max: 360,
    unit: "deg"
  },

  invert: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%"
  },

  opacity: {
    value: 100,
    min: 0,
    max: 100,
    unit: "%"
  }
}

let filters =
  structuredClone(defaultFilters)

// ==========================================
// DOM ELEMENTS
// ==========================================
const menuBtn =
  document.getElementById("menuBtn")

const mobileMenu =
  document.getElementById("mobileMenu")

const canvas =
  document.getElementById("image-canvas")

const ctx =
  canvas.getContext("2d")

const imageInput =
  document.getElementById("image-input")

const placeholder =
  document.querySelector(".placeholder")

const filtersContainer =
  document.querySelector(".filters")

const presetsContainer =
  document.querySelector(".presets")

const resetBtn =
  document.getElementById("reset-btn")

const downloadBtn =
  document.getElementById("download-btn")

const cropBtn =
  document.getElementById("cropBtn")

const cropMenu =
  document.getElementById("cropMenu")

const manualCropBtn =
  document.getElementById("manualCrop")

const backgroundRemoverBtn =
  document.getElementById("background-remover")

const filterBtn =
  document.getElementById("filterBtn")

const presetBtn =
  document.getElementById("presetBtn")

const sidebar =
  document.querySelector(".right")

const closeSidebarBtn =
  document.getElementById("closeSidebar")

const overlay =
  document.getElementById("overlay")

const doneCropBtn = document.getElementById("doneCropBtn")

 const mobilePopup =
  document.getElementById(
    "mobilePopup"
  )

const mobileCropOptions =
  document.getElementById(
    "mobileCropOptions"
  )

const menuButtons =
  document.getElementById(
    "menuButtons"
  )

// ==========================================
// IMAGE VARIABLES
// ==========================================

let image = null
let originalImage = null

// ==========================================
// SIDEBAR FUNCTIONS
// ==========================================

function openSidebar(type) {

  sidebar.classList.add("show")

  overlay.classList.add("show")

  if (type === "filters") {

    sidebar.classList.remove(
      "show-presets"
    )

    sidebar.classList.add(
      "show-filters"
    )
  }

  if (type === "presets") {

    sidebar.classList.remove(
      "show-filters"
    )

    sidebar.classList.add(
      "show-presets"
    )
  }
}

function closeSidebar() {

  sidebar.classList.remove(
    "show"
  )

  sidebar.classList.remove(
    "show-filters"
  )

  sidebar.classList.remove(
    "show-presets"
  )

  overlay.classList.remove(
    "show"
  )
}

// ==========================================
// MOBILE MENU
// ==========================================

if(menuBtn){

  menuBtn.addEventListener(
    "click",
    () => {

      mobileMenu.classList.toggle(
        "show"
      )
    }
  )
}

// ==========================================
// MOBILE BUTTONS
// ==========================================

if (filterBtn) {

  filterBtn.addEventListener(
    "click",
    () => {

      // toggle

      if (
        sidebar.classList.contains(
          "show-filters"
        )
      ) {

        closeSidebar()
      }

      else {

        openSidebar("filters")
      }
    }
  )
}

if (presetBtn) {

  presetBtn.addEventListener(
    "click",
    () => {

      // toggle

      if (
        sidebar.classList.contains(
          "show-presets"
        )
      ) {

        closeSidebar()
      }

      else {

        openSidebar("presets")
      }
    }
  )
}

// ==========================================
// CLOSE SIDEBAR
// ==========================================

if (closeSidebarBtn) {

  closeSidebarBtn.addEventListener(
    "click",
    closeSidebar
  )
}

if (overlay) {

  overlay.addEventListener(
    "click",
    closeSidebar
  )
}

// ==========================================
// IMAGE UPLOAD
// ==========================================

imageInput.addEventListener(
  "change",
  e => {

    const file =
      e.target.files[0]

    if (!file) return

    const img =
      new Image()

    img.src =
      URL.createObjectURL(file)

    img.onload = () => {

      image = img

      originalImage = img

      canvas.width =
        img.width

      canvas.height =
        img.height

      placeholder.style.display =
        "none"

      canvas.style.display =
        "block"

      applyFilters()
    }
  }
)

// ==========================================
// FILTER STRING
// ==========================================

function getFilterString() {

  return `

    brightness(${filters.brightness.value}%)

    contrast(${filters.contrast.value}%)

    saturate(${filters.saturation.value}%)

    grayscale(${filters.grayscale.value}%)

    sepia(${filters.sepia.value}%)

    blur(${filters.blur.value}px)

    hue-rotate(${filters.hueRotation.value}deg)

    invert(${filters.invert.value}%)

    opacity(${filters.opacity.value}%)

  `
}

// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

  if (!image) return

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  )

  ctx.filter =
    getFilterString()

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height
  )

  ctx.filter = "none"
}

// ==========================================
// CREATE FILTER SLIDERS
// ==========================================

function createFilters() {

  filtersContainer.innerHTML = ""

  Object.keys(filters).forEach(
    filterName => {

      const filter =
        filters[filterName]

      const div =
        document.createElement("div")

      div.classList.add("filter")

      div.innerHTML = `

        <p>
          ${filterName} :
          ${filter.value}${filter.unit}
        </p>

        <input
          type="range"
          min="${filter.min}"
          max="${filter.max}"
          value="${filter.value}"
        >
      `

      const input =
        div.querySelector("input")

      const label =
        div.querySelector("p")

      input.addEventListener(
        "input",
        () => {

          filters[filterName].value =
            input.value

          label.innerText =
            `${filterName} : ${input.value}${filter.unit}`

          applyFilters()

          if (cropData.active) {

            drawCropPreview()
          }
        }
      )

      filtersContainer.appendChild(
        div
      )
    }
  )
}

createFilters()

// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener(
  "click",
  () => {

    if (!originalImage) return

    filters =
      structuredClone(defaultFilters)

    createFilters()

    image =
      originalImage

    canvas.width =
      originalImage.width

    canvas.height =
      originalImage.height

    applyFilters()

    cropData.active = false

    
  }
)

// ==========================================
// DOWNLOAD
// ==========================================

downloadBtn.addEventListener(
  "click",
  () => {

    const link =
      document.createElement("a")

    link.download =
      "edited-image.png"

    link.href =
      canvas.toDataURL("image/png")

    link.click()
  }
)

// ==========================================
// FILTER PRESETS
// ==========================================

const presets = {

   normal: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotation: 0,
    invert: 0,
    opacity: 100
  },

  vintage: {
    brightness: 110,
    contrast: 90,
    saturation: 80,
    grayscale: 10,
    sepia: 45,
    blur: 0,
    hueRotation: 0,
    invert: 0,
    opacity: 100
  },

  horror: {
    brightness: 70,
    contrast: 180,
    saturation: 60,
    grayscale: 20,
    sepia: 0,
    blur: 1,
    hueRotation: 140,
    invert: 0,
    opacity: 100
  },

  oldSchool: {
    brightness: 95,
    contrast: 120,
    saturation: 70,
    grayscale: 30,
    sepia: 60,
    blur: 0,
    hueRotation: 0,
    invert: 0,
    opacity: 100
  },

  dreamy: {
    brightness: 120,
    contrast: 80,
    saturation: 130,
    grayscale: 0,
    sepia: 10,
    blur: 2,
    hueRotation: 15,
    invert: 0,
    opacity: 100
  },

  neon: {
    brightness: 120,
    contrast: 180,
    saturation: 220,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotation: 25,
    invert: 0,
    opacity: 100
  },

  noir: {
    brightness: 90,
    contrast: 150,
    saturation: 0,
    grayscale: 100,
    sepia: 0,
    blur: 0,
    hueRotation: 0,
    invert: 0,
    opacity: 100
  },

  sunset: {
    brightness: 120,
    contrast: 110,
    saturation: 150,
    grayscale: 0,
    sepia: 20,
    blur: 0,
    hueRotation: 330,
    invert: 0,
    opacity: 100
  },

  coolBlue: {
    brightness: 105,
    contrast: 110,
    saturation: 120,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotation: 180,
    invert: 0,
    opacity: 100
  },

  warmLight: {
    brightness: 115,
    contrast: 105,
    saturation: 140,
    grayscale: 0,
    sepia: 25,
    blur: 0,
    hueRotation: 10,
    invert: 0,
    opacity: 100
  },

  cyberpunk: {
    brightness: 115,
    contrast: 190,
    saturation: 250,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotation: 290,
    invert: 0,
    opacity: 100
  },

  ghost: {
    brightness: 140,
    contrast: 70,
    saturation: 0,
    grayscale: 80,
    sepia: 0,
    blur: 2,
    hueRotation: 180,
    invert: 10,
    opacity: 90
  },

  darkMode: {
    brightness: 70,
    contrast: 140,
    saturation: 80,
    grayscale: 10,
    sepia: 0,
    blur: 0,
    hueRotation: 0,
    invert: 0,
    opacity: 100
  },

  candy: {
    brightness: 125,
    contrast: 100,
    saturation: 220,
    grayscale: 0,
    sepia: 10,
    blur: 0,
    hueRotation: 320,
    invert: 0,
    opacity: 100
  }

}

// ==========================================
// CREATE PRESETS
// ==========================================

Object.keys(presets).forEach(
  presetName => {

    const button =
      document.createElement("button")

    button.classList.add("btn")

    button.innerText =
      presetName

    button.addEventListener(
      "click",
      () => {

        const preset =
          presets[presetName]

        Object.keys(preset).forEach(
          filterName => {

            filters[filterName].value =
              preset[filterName]
          }
        )

        createFilters()

        applyFilters()
      }
    )

    presetsContainer.appendChild(
      button
    )
  }
)

// ==========================================
// CROP MENU TOGGLE
// ==========================================

cropBtn.addEventListener(
  "click",
  () => {

    cropMenu.classList.toggle(
      "show"
    )
  }
)

// ==========================================
// MANUAL CROP
// ==========================================

const cropData = {

  active: false,

  dragging: false,

  startX: 0,
  startY: 0,

  endX: 0,
  endY: 0
}



manualCropBtn.addEventListener(
  "click",
  () => {

    if (!image) return;

    cropData.active = true;

    alert("Drag on image and press ENTER");

    // 👉 safer condition
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        doneCropBtn.classList.add("show");
      }
    });

  }
);

// ==========================================
// POINTER POSITION
// ==========================================

function getPointerPosition(e) {

  const rect =
    canvas.getBoundingClientRect()

  const scaleX =
    canvas.width / rect.width

  const scaleY =
    canvas.height / rect.height

  let clientX
  let clientY

  if (e.touches) {

    clientX =
      e.touches[0].clientX

    clientY =
      e.touches[0].clientY
  }

  else {

    clientX = e.clientX
    clientY = e.clientY
  }

  return {

    x:
      (clientX - rect.left) *
      scaleX,

    y:
      (clientY - rect.top) *
      scaleY
  }
}

// ==========================================
// START CROP
// ==========================================

function startCrop(e) {

  if (!cropData.active) return

  cropData.dragging = true

  const pos =
    getPointerPosition(e)

  cropData.startX = pos.x
  cropData.startY = pos.y

  cropData.endX = pos.x
  cropData.endY = pos.y
}

// ==========================================
// MOVE CROP
// ==========================================

function moveCrop(e) {

  if (
    !cropData.active ||
    !cropData.dragging
  ) return

  e.preventDefault()

  const pos =
    getPointerPosition(e)

  cropData.endX = pos.x
  cropData.endY = pos.y

  drawCropPreview()
}

// ==========================================
// END CROP
// ==========================================

function endCrop() {

  cropData.dragging = false
}

// ==========================================
// DONE CROP
// ==========================================

doneCropBtn.addEventListener(
  "click",
  () => {

    if (!cropData.active) return

    performCrop()

    cropData.active = false

    // HIDE button after crop
    doneCropBtn.classList.remove("show");

    // MOBILE UI RESET

    if (mobilePopup) {

      mobilePopup.classList.remove(
        "show"
      )
    }

    if (mobileCropOptions) {

      mobileCropOptions.classList.remove(
        "show"
      )
    }

    if (menuButtons) {

      menuButtons.style.display =
        "flex"
    }
  }
)

// ==========================================
// CANVAS EVENTS
// ==========================================

canvas.addEventListener(
  "mousedown",
  startCrop
)

canvas.addEventListener(
  "mousemove",
  moveCrop
)

canvas.addEventListener(
  "mouseup",
  endCrop
)

canvas.addEventListener(
  "touchstart",
  startCrop
)

canvas.addEventListener(
  "touchmove",
  moveCrop
)

canvas.addEventListener(
  "touchend",
  endCrop
)

// ==========================================
// DRAW CROP PREVIEW
// ==========================================

function drawCropPreview() {

  applyFilters()

  const x =
    Math.min(
      cropData.startX,
      cropData.endX
    )

  const y =
    Math.min(
      cropData.startY,
      cropData.endY
    )

  const width =
    Math.abs(
      cropData.endX -
      cropData.startX
    )

  const height =
    Math.abs(
      cropData.endY -
      cropData.startY
    )

  ctx.strokeStyle =
    "#fff"

  ctx.lineWidth = 3

  ctx.strokeRect(
    x,
    y,
    width,
    height
  )
}

// ==========================================
// ENTER = FINAL CROP
// ==========================================

document.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "Enter" &&
      cropData.active
    ) {

      performCrop()
    }
  }
)

// ==========================================
// FINAL CROP
// ==========================================

function performCrop() {

  const x =
    Math.min(
      cropData.startX,
      cropData.endX
    )

  const y =
    Math.min(
      cropData.startY,
      cropData.endY
    )

  const width =
    Math.abs(
      cropData.endX -
      cropData.startX
    )

  const height =
    Math.abs(
      cropData.endY -
      cropData.startY
    )

  if (
    width < 10 ||
    height < 10
  ) return

  const tempCanvas =
    document.createElement("canvas")

  const tempCtx =
    tempCanvas.getContext("2d")

  tempCanvas.width =
    width

  tempCanvas.height =
    height

  tempCtx.drawImage(
    canvas,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  )

  canvas.width = width
  canvas.height = height

  ctx.drawImage(
    tempCanvas,
    0,
    0
  )

  const newImg =
    new Image()

  newImg.src =
    canvas.toDataURL()

  newImg.onload = () => {

    image = newImg

    applyFilters()
  }

  cropData.active = false

  doneCropBtn.classList.remove("show");
}

// ==========================================
// PRESET CROPS
// ==========================================

const cropPresets = {

  instaPost: [1, 1],

  youtubeVideo: [16, 9],

  instaPortrait: [4, 5],

  dslrPhoto: [3, 2],

  instaReel: [9, 16]
}

Object.keys(cropPresets).forEach(
  id => {

    const btn =
      document.getElementById(id)

    if (!btn) return

    btn.addEventListener(
      "click",
      () => {

        const [rw, rh] =
          cropPresets[id]

        applyPresetCrop(
          rw,
          rh
        )
      }
    )
  }
)

// ==========================================
// APPLY PRESET CROP
// ==========================================

function applyPresetCrop(
  ratioWidth,
  ratioHeight
) {

  if (!image) return

  const currentWidth =
    canvas.width

  const currentHeight =
    canvas.height

  let newWidth =
    currentWidth

  let newHeight =
    currentWidth *
    (ratioHeight / ratioWidth)

  if (
    newHeight >
    currentHeight
  ) {

    newHeight =
      currentHeight

    newWidth =
      currentHeight *
      (ratioWidth / ratioHeight)
  }

  const cropX =
    (currentWidth - newWidth) / 2

  const cropY =
    (currentHeight - newHeight) / 2

  const tempCanvas =
    document.createElement("canvas")

  const tempCtx =
    tempCanvas.getContext("2d")

  tempCanvas.width =
    newWidth

  tempCanvas.height =
    newHeight

  tempCtx.drawImage(
    canvas,
    cropX,
    cropY,
    newWidth,
    newHeight,
    0,
    0,
    newWidth,
    newHeight
  )

  canvas.width =
    newWidth

  canvas.height =
    newHeight

  ctx.drawImage(
    tempCanvas,
    0,
    0
  )

  const newImg =
    new Image()

  newImg.src =
    canvas.toDataURL()

  newImg.onload = () => {

    image = newImg

    applyFilters()
  }
}

// ==========================================
// BACKGROUND REMOVER
// ==========================================

backgroundRemoverBtn.addEventListener(
  "click",
  async () => {

    if (!image) {

      alert(
        "Upload image first"
      )

      return
    }

    try {

      backgroundRemoverBtn.innerText =
        "Removing..."

      const blob =
        await fetch(
          canvas.toDataURL("image/png")
        ).then(
          res => res.blob()
        )

      const formData =
        new FormData()

      formData.append(
        "image_file",
        blob,
        "image.png"
      )

      formData.append(
        "size",
        "auto"
      )

      const response =
        await fetch(
          "https://api.remove.bg/v1.0/removebg",
          {
            method: "POST",

            headers: {
              "X-Api-Key":
                "7kLH9nYNQW5LzQ3sR9v47dpS "
            },

            body: formData
          }
        )

      if (!response.ok) {

        throw new Error(
          "Failed"
        )
      }

      const resultBlob =
        await response.blob()

      const url =
        URL.createObjectURL(
          resultBlob
        )

      const newImg =
        new Image()

      newImg.src = url

      newImg.onload = () => {

        image = newImg

        canvas.width =
          newImg.width

        canvas.height =
          newImg.height

        applyFilters()

        backgroundRemoverBtn.innerText =
          "Background Remove"
      }

    } catch (err) {

      console.log(err)

      alert(
        "Background remove failed"
      )

      backgroundRemoverBtn.innerText =
        "Background Remove"
    }
  }
)